import React from "react";
import { renderToPipeableStream } from "react-dom/server";
import { createManifestProvider, escapeJsonForInlineScript } from "@jennifer-elyse/react-islands/server";

import { HtmlDocument } from "./HtmlDocument.jsx";
import { getAllIslandModuleSpecifiers } from "./islandsPolicy.js";

const mergeHeads = (heads) => {
	const out = { title: null, meta: [], links: [] };

	for (const h of heads)
	{
		if (!h) continue;
		if (h.title) out.title = h.title;
		if (Array.isArray(h.meta)) out.meta.push(...h.meta);
		if (Array.isArray(h.links)) out.links.push(...h.links);
	}

	return out;
};

const createProvider = () => {
	const isProd = process.env.NODE_ENV === "production";

	if (isProd)
	{
		return createManifestProvider({
			mode: "prod",
			manifestPath: "dist/client/islands-manifest.json",
		});
	}

	const origin = process.env.VITE_DEV_ORIGIN || "http://localhost:5173";
	const specifiers = getAllIslandModuleSpecifiers();

	const devModules = {};
	for (const spec of specifiers)
	{
		devModules[spec] = `${origin}${spec}`;
	}

	return createManifestProvider({
		mode: "dev",
		devModules,
		runtimeDevSrc: `${origin}/src/client/islands-runtime.entry.js`,
	});
};

export const renderRequest = async ({ req, res, router }) => {
	const match = router.match(req.path);

	if (!match)
	{
		res.status(404).send("Not Found");
		return;
	}

	const ctx = { req, params: match.params };

	// Loaders: outer layouts -> page
	let props = {};
	const heads = [];

	for (const layout of match.layouts)
	{
		if (layout.loader)
		{
			const add = await layout.loader(ctx);
			if (add && typeof add === "object") props = { ...props, ...add };
		}
		if (layout.head)
		{
			heads.push(await layout.head(props, ctx));
		}
	}

	if (match.page.loader)
	{
		const add = await match.page.loader(ctx);
		if (add && typeof add === "object") props = { ...props, ...add };
	}
	if (match.page.head)
	{
		heads.push(await match.page.head(props, ctx));
	}

	const head = mergeHeads(heads);

	const provider = createProvider();
	const manifest = provider.getManifest();
	const manifestJson = escapeJsonForInlineScript(JSON.stringify(manifest));

	const runtimeSrc = manifest["islands-runtime"] || "/assets/islands-runtime.js";

	// Compose layouts around the Page
	let element = React.createElement(match.page.Page, props);
	for (let i = match.layouts.length - 1; i >= 0; i--)
	{
		const L = match.layouts[i].Layout;
		element = React.createElement(L, props, element);
	}

	let didError = false;

	const doc = React.createElement(
		HtmlDocument,
		{
			head,
			manifestJson,
			runtimeSrc,
		},
		element
	);

	await new Promise((resolve, reject) => {
		const { pipe } = renderToPipeableStream(doc, {
			onShellReady()
			{
				res.statusCode = didError ? 500 : 200;
				res.setHeader("Content-Type", "text/html; charset=utf-8");
				res.setHeader("X-Content-Type-Options", "nosniff");
				pipe(res);
			},
			onShellError(err)
			{
				reject(err);
			},
			onError(err)
			{
				didError = true;
				// eslint-disable-next-line no-console
				console.error(err);
			},
		});

		res.on("close", resolve);
	});
};
