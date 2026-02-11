import fs from "node:fs";
import path from "node:path";

const viteManifestPath = path.resolve("dist/client/.vite/manifest.json");
const outPath = path.resolve("dist/client/islands-manifest.json");

if (!fs.existsSync(viteManifestPath))
{
	throw new Error(`Vite manifest not found: ${viteManifestPath}`);
}

const viteManifest = JSON.parse(fs.readFileSync(viteManifestPath, "utf8"));

const toModuleSpecifier = (src) => {
	// We standardize the server markers to emit:
	// /src/client/islands/<Name>.entry.jsx (or .js)
	if (src.startsWith("src/client/islands/") && src.includes(".entry."))
	{
		const name = src
			.replace(/^src\/client\/islands\//, "")
			.replace(/\.entry\.(js|jsx)$/, "");

		const ext = src.endsWith(".js") ? ".js" : ".jsx";
		return `/src/client/islands/${name}.entry${ext}`;
	}
	return null;
};

const modules = {};

for (const [key, rec] of Object.entries(viteManifest))
{
	const moduleSpecifier = toModuleSpecifier(key);
	if (!moduleSpecifier) continue;
	modules[moduleSpecifier] = `/${rec.file}`;
}

let runtimeFile = null;
for (const [key, rec] of Object.entries(viteManifest))
{
	if (key === "src/client/islands-runtime.entry.js")
	{
		runtimeFile = `/${rec.file}`;
		break;
	}
}

if (!runtimeFile)
{
	throw new Error("Could not find runtime entry src/client/islands-runtime.entry.js in Vite manifest");
}

const islandsManifest = {
	modules,
	"islands-runtime": runtimeFile,
};

fs.writeFileSync(outPath, JSON.stringify(islandsManifest, null, "\t"), "utf8");
console.log(`Wrote ${outPath}`);
