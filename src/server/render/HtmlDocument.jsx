import React from 'react';

export const HtmlDocument = ({ head, children, manifestJson, manifestIntegrity, runtimeSrc, preambleSrc }) => {
	const title = head?.title || 'react-islands';
	const refreshImport = preambleSrc ? new URL('/@react-refresh', preambleSrc).toString() : null;

	return React.createElement(
		'html',
		{ lang: 'en' },
		React.createElement(
			'head',
			null,
			React.createElement('meta', { charSet: 'utf-8' }),
			React.createElement('meta', {
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			}),
			React.createElement('meta', { name: 'theme-color', content: '#ffffff' }),
			React.createElement('title', null, title),
			React.createElement('link', {
				rel: 'manifest',
				href: '/manifest.webmanifest',
			}),
			React.createElement('link', {
				rel: 'icon',
				href: '/icons/icon.png',
				type: 'image/png',
			}),
			preambleSrc ? React.createElement('script', { type: 'module', src: preambleSrc }) : null,
			refreshImport
				? React.createElement('script', {
						type: 'module',
						dangerouslySetInnerHTML: {
							__html: `import RefreshRuntime from "${refreshImport}";
RefreshRuntime.injectIntoGlobalHook(window);
window.$RefreshReg$ = () => {};
window.$RefreshSig$ = () => (type) => type;
window.__vite_plugin_react_preamble_installed__ = true;`,
						},
					})
				: null,
			React.createElement('script', {
				id: 'islands-manifest',
				type: 'application/json',
				'data-integrity': manifestIntegrity,
				dangerouslySetInnerHTML: { __html: manifestJson },
			}),
			React.createElement('script', { type: 'module', src: runtimeSrc }),
			React.createElement('script', {
				type: 'module',
				src: '/pwa-register.js',
			}),
		),
		React.createElement('body', null, React.createElement('div', { id: 'app' }, children)),
	);
};
