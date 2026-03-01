import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { HtmlDocument } from './HtmlDocument.jsx';
import { createHostManifestProvider } from './manifestProvider.js';

export const renderPage = ({ req, res, appElement, head }) => {
	return new Promise((resolve, reject) => {
		const provider = createHostManifestProvider();
		const manifest = provider.getManifest();
		const manifestJson = provider.getManifestJson();
		const manifestIntegrity = provider.getManifestIntegrity();

		const runtimeSrc = manifest['islands-runtime'] || '/assets/islands-runtime.js';
		const preambleSrc = manifest['vite-client'];

		let didError = false;

		const element = React.createElement(
			HtmlDocument,
			{ head, manifestJson, manifestIntegrity, runtimeSrc, preambleSrc },
			appElement,
		);

		const { pipe } = renderToPipeableStream(element, {
			onShellReady() {
				res.statusCode = didError ? 500 : 200;
				res.setHeader('Content-Type', 'text/html; charset=utf-8');
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
