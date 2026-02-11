import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { globSync } from "glob";

const root = process.cwd();

// Client island entries
const islands = globSync("src/client/islands/*.entry.@(js|jsx)", { cwd: root });

const input = {
	"islands-runtime": path.resolve(root, "src/client/islands-runtime.entry.js"),
};

for (const rel of islands)
{
	const base = rel
		.replace(/^src\/client\/islands\//, "islands/")
		.replace(/\.entry\.(js|jsx)$/, "");

	input[base] = path.resolve(root, rel);
}

export default defineConfig({
	plugins: [react()],
	build: {
		outDir: "dist/client",
		emptyOutDir: true,
		manifest: true,
		rollupOptions: {
			input,
			output: {
				entryFileNames: "assets/[name]-[hash].js",
				chunkFileNames: "assets/[name]-[hash].js",
				assetFileNames: "assets/[name]-[hash][extname]",
			},
		},
	},
});
