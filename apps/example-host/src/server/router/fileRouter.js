import { readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { match as pathMatch } from "path-to-regexp";

const isRouteFile = (name) => name.endsWith(".route.jsx") || name.endsWith(".route.js");

const walk = async (dirAbs) => {
	const entries = await readdir(dirAbs, { withFileTypes: true });
	const files = [];

	for (const entry of entries)
	{
		const abs = path.join(dirAbs, entry.name);

		if (entry.isDirectory())
		{
			files.push(...(await walk(abs)));
			continue;
		}

		if (entry.isFile() && isRouteFile(entry.name))
		{
			files.push(abs);
		}
	}

	return files;
};

const filePathToPattern = (routesRootAbs, fileAbs) => {
	const rel = path.relative(routesRootAbs, fileAbs).replaceAll(path.sep, "/");
	const noExt = rel.replace(/\.route\.(jsx|js)$/, "");

	let pattern = "/" + noExt
		.split("/")
		.map((seg) => {
			if (seg === "index") return "";
			if (seg === "_layout") return "";
			const m = seg.match(/^\[(.+)\]$/);
			if (m) return `:${m[1]}`;
			return seg;
		})
		.filter(Boolean)
		.join("/");

	if (pattern === "") pattern = "/";
	return pattern;
};

const getDirSegments = (routesRootAbs, fileAbs) => {
	const rel = path.relative(routesRootAbs, path.dirname(fileAbs)).replaceAll(path.sep, "/");
	if (!rel || rel === ".") return [];
	return rel.split("/").filter(Boolean);
};

export const createFileRouter = async ({ routesDir }) => {
	const routesRootAbs = fileURLToPath(routesDir);
	const filesAbs = await walk(routesRootAbs);

	// Map: folderKey -> layout module
	// folderKey is "" for root, or "product", "product/details", etc.
	const layoutsByFolder = new Map();
	const pages = [];

	for (const fileAbs of filesAbs)
	{
		const url = pathToFileURL(fileAbs).href;
		const mod = await import(url);

		const baseName = path.basename(fileAbs);
		const folderKey = getDirSegments(routesRootAbs, fileAbs).join("/");

		if (baseName.startsWith("_layout.route."))
		{
			if (!mod.Layout)
			{
				throw new Error(`Layout module missing export "Layout": ${fileAbs}`);
			}
			layoutsByFolder.set(folderKey, mod);
			continue;
		}

		if (!mod.Page)
		{
			throw new Error(`Route module missing export "Page": ${fileAbs}`);
		}

		const pattern = filePathToPattern(routesRootAbs, fileAbs);
		pages.push({ pattern, module: mod, fileAbs, folderKey });
	}

	const records = pages.map((p) => {
		const segs = p.folderKey ? p.folderKey.split("/") : [];
		const chain = [];

		// Root layout first (folderKey="")
		if (layoutsByFolder.has(""))
		{
			chain.push(layoutsByFolder.get(""));
		}

		// Nested layouts by folder ancestry
		for (let i = 0; i < segs.length; i++)
		{
			const key = segs.slice(0, i + 1).join("/");
			if (layoutsByFolder.has(key))
			{
				chain.push(layoutsByFolder.get(key));
			}
		}

		return {
			pattern: p.pattern,
			page: p.module,
			layouts: chain,
			matcher: pathMatch(p.pattern, { decode: decodeURIComponent }),
		};
	});

	// Most-specific first
	records.sort((a, b) => b.pattern.length - a.pattern.length);

	return {
		match: (pathname) => {
			for (const rec of records)
			{
				const m = rec.matcher(pathname);
				if (m)
				{
					return {
						params: m.params,
						page: rec.page,
						layouts: rec.layouts,
						pattern: rec.pattern,
					};
				}
			}
			return null;
		},
		routes: records.map((r) => r.pattern),
	};
};
