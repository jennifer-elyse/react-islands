import fs from "node:fs";
import path from "node:path";

const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));

const toModuleSpecifier = (src) => {
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

export const buildIslandsManifest = ({ viteManifestPath, outPath }) => {
	if (!fs.existsSync(viteManifestPath))
	{
		throw new Error(`Vite manifest not found: ${viteManifestPath}`);
	}

	const viteManifest = readJson(viteManifestPath);
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
	return islandsManifest;
};

export const runCli = () => {
	const argv = process.argv.slice(2);
	const getFlag = (name) => {
		const idx = argv.indexOf(name);
		if (idx === -1) return null;
		return argv[idx + 1];
	};

	const inPath = getFlag("--in");
	const outPath = getFlag("--out") || "dist/client/islands-manifest.json";

	if (!inPath)
	{
		throw new Error("Usage: react-islands-gen-manifest --in dist/client/.vite/manifest.json [--out dist/client/islands-manifest.json]");
	}

	const absIn = path.resolve(inPath);
	const absOut = path.resolve(outPath);
	buildIslandsManifest({ viteManifestPath: absIn, outPath: absOut });
	// eslint-disable-next-line no-console
	console.log(`Wrote ${absOut}`);
};

if (import.meta.url === `file://${process.argv[1]}`)
{
	runCli();
}
