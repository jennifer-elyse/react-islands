import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { createManifestProvider } from './manifest.js';
import { escapeJsonForInlineScript } from './serialize.js';
import { mergeDocumentProps } from './css/mergeDocumentProps.js';

const mergeHeads = (heads) => {
	const out = { title: null, meta: [], links: [] };

	for (const h of heads) {
		if (!h) continue;
		if (h.title) out.title = h.title;
		if (Array.isArray(h.meta)) out.meta.push(...h.meta);
		if (Array.isArray(h.links)) out.links.push(...h.links);
	}

	return out;
};

export const createRenderRequest = ({
	HtmlDocument,
	resolveIslandModule,
	getAllIslandModuleSpecifiers,
	devOrigin = 'http://localhost:5173',
	manifestPath = 'dist/client/islands-manifest.json',
	features = [],
	getDocumentProps,
}) => {
	const createProvider = () => {
		const isProd = process.env.NODE_ENV === 'production';

		if (isProd) {
			return createManifestProvider({
				mode: 'prod',
				manifestPath,
			});
		}

		const specifiers = getAllIslandModuleSpecifiers();
		const devModules = {};
		for (const spec of specifiers) {
			devModules[spec] = `${devOrigin}${spec}`;
		}

		return createManifestProvider({
			mode: 'dev',
			devModules,
			runtimeDevSrc: `${devOrigin}/src/client/islands-runtime.entry.js`,
		});
	};

	return async ({ req, res, router }) => {
		const match = router.match(req.path);

		if (!match) {
			res.status(404).send('Not Found');
			return;
		}

		const ctx = { req, params: match.params };
		let context = ctx;

		for (const feature of features) {
			if (typeof feature?.extendRequestContext !== 'function') continue;
			const extension = await feature.extendRequestContext({ req, res, match });
			if (extension && typeof extension === 'object') context = { ...context, ...extension };
		}

		let props = {};
		const heads = [];

		for (const layout of match.layouts) {
			if (layout && typeof layout === 'object' && layout?.loader) {
				const add = await layout?.loader?.(context);
				if (add && typeof add === 'object') props = { ...props, ...add };
			}
			if (layout && typeof layout === 'object' && layout?.head) {
				heads.push(await layout?.head?.(props, context));
			}
		}

		if (match.page?.loader) {
			const add = await match.page?.loader?.(context);
			if (add && typeof add === 'object') props = { ...props, ...add };
		}
		if (match.page?.head) {
			heads.push(await match.page?.head?.(props, context));
		}

		const head = mergeHeads(heads);
		let documentProps = {};

		for (const feature of features) {
			if (typeof feature?.getDocumentProps !== 'function') continue;
			const patch = await feature.getDocumentProps({ req, res, match, props, head, context });
			if (patch) documentProps = mergeDocumentProps(documentProps, patch);
		}
		if (typeof getDocumentProps === 'function') {
			const patch = await getDocumentProps({ req, res, match, props, head, context });
			if (patch) documentProps = mergeDocumentProps(documentProps, patch);
		}

		const provider = createProvider();
		const manifest = provider.getManifest();
		const manifestJson = escapeJsonForInlineScript(JSON.stringify(manifest));
		const manifestIntegrity = provider.getManifestIntegrity ? provider.getManifestIntegrity() : null;

		const runtimeSrc = manifest['islands-runtime'] || '/assets/islands-runtime.js';

		let element = React.createElement(match.page.Page, props);
		for (let i = match.layouts.length - 1; i >= 0; i--) {
			const L = match.layouts[i].Layout;
			element = React.createElement(L, props, element);
		}

		let didError = false;

		const doc = React.createElement(
			HtmlDocument,
			{
				head,
				documentProps,
				manifestJson,
				manifestIntegrity,
				runtimeSrc,
				resolveIslandModule,
			},
			element,
		);

		await new Promise((resolve, reject) => {
			const { pipe } = renderToPipeableStream(doc, {
				onShellReady() {
					res.statusCode = didError ? 500 : 200;
					res.setHeader('Content-Type', 'text/html; charset=utf-8');
					res.setHeader('X-Content-Type-Options', 'nosniff');
					pipe(res);
				},
				onShellError(err) {
					reject(err);
				},
				onError(err) {
					didError = true;

					console.error(err);
				},
			});

			res.on('close', resolve);
		});
	};
};
