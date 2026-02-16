import esbuild from "esbuild";
import fs from "node:fs";

fs.rmSync("dist", { recursive: true, force: true });
fs.mkdirSync("dist/server", { recursive: true });
fs.mkdirSync("dist/client", { recursive: true });

// Server build (esbuild, now using package-local src/server)
await esbuild.build({
	entryPoints: [
		"src/server/index.js",
		"src/server/fileRouter.js",
		"src/server/genManifest.js",
		"src/server/HtmlDocument.jsx",
		"src/server/Island.jsx",
		"src/server/manifest.js",
		"src/server/renderRequest.js",
		"src/server/security.js",
		"src/server/serialize.js"
	],
	outdir: "dist/server",
	bundle: false,
	format: "esm",
	platform: "node",
	target: "node22",
	sourcemap: true,
	minify: true,
	loader: {
		".js": "js",
		".jsx": "jsx"
	}
});

await esbuild.build({
	entryPoints: ["src/server/genManifest.js"],
	outdir: "dist/server",
	bundle: true,
	format: "esm",
	platform: "node",
	target: "node22",
	minify: true,
	packages: "external",
	banner: {
		js: "#!/usr/bin/env node",
	},
});

await esbuild.build({
	entryPoints: ["src/client/islands-runtime.js"],
	outfile: "dist/client/islands-runtime.js",
	bundle: true,
	format: "esm",
	platform: "browser",
	// The host app must provide these; don't bundle.
	external: ["react", "react-dom/client"],
	minify: true,
});
