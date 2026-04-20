import React from 'react';
import { renderToPipeableStream, renderToStaticMarkup } from 'react-dom/server';
import { HtmlDocument } from './HtmlDocument.jsx';
import { createHostManifestProvider } from './manifestProvider.js';

export const renderPage = ({ req, res, appElement, head, documentProps }) => {
	return new Promise((resolve, reject) => {
		const provider = createHostManifestProvider();
		const manifest = provider.getManifest();
		const manifestJson = provider.getManifestJson();
		const manifestIntegrity = provider.getManifestIntegrity();

		const runtimeSrc = manifest['islands-runtime'] || '/assets/islands-runtime.js';
		const preambleSrc = manifest['vite-client'];
		const hasIslands = renderToStaticMarkup(appElement).includes('data-island-module=');

		let didError = false;

		const element = React.createElement(
			HtmlDocument,
			{
				head,
				manifestJson,
				manifestIntegrity,
				runtimeSrc,
				preambleSrc,
				documentProps,
				hasIslands,
			},
			appElement,
		);

		const { pipe } = renderToPipeableStream(element, {
			onShellReady() {
				res.statusCode = didError ? 500 : 200;
				res.setHeader('Content-Type', 'text/html; charset=utf-8');
				if (process.env.NODE_ENV !== 'production') {
					res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
				}
				pipe(res);
			},
			onShellError(err) {
				reject(err);
			},
			onError(err) {
				didError = true;
			},
		});

		res.on('close', resolve);
	});
};
