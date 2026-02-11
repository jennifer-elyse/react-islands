import esbuild from "esbuild";
import fs from "node:fs";

fs.rmSync("dist", { recursive: true, force: true });
fs.mkdirSync("dist/server", { recursive: true });
fs.mkdirSync("dist/client", { recursive: true });

await esbuild.build({
	entryPoints: ["src/server/index.js"],
	outfile: "dist/server/index.js",
	bundle: true,
	format: "esm",
	platform: "node",
	// Keep react external to avoid bundling it into the library.
	external: ["react", "react-dom", "react-dom/server"],
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
