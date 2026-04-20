import React from 'react';

const renderHeadTag = (tag, idx, kind) => {
	if (!tag || typeof tag !== 'object') return null;
	return React.createElement(kind, { key: `${kind}-${idx}`, ...tag });
};

const renderStyleTag = (style, idx) => {
	if (!style?.cssText) return null;
	return React.createElement('style', {
		key: `style-${idx}`,
		id: style.id,
		media: style.media,
		dangerouslySetInnerHTML: { __html: style.cssText },
	});
};

export const HtmlDocument = ({
	head,
	children,
	manifestJson,
	manifestIntegrity,
	runtimeSrc,
	preambleSrc,
	documentProps = {},
	hasIslands = false,
}) => {
	const title = head?.title || 'react-islands';
	const refreshImport = hasIslands && preambleSrc ? new URL('/@react-refresh', preambleSrc).toString() : null;
	const htmlAttrs = { lang: 'en', ...(documentProps.htmlAttrs || {}) };
	const bodyAttrs = { ...(documentProps.bodyAttrs || {}) };
	const metaTags = [...(head?.meta || []), ...(documentProps.meta || [])];
	const linkTags = [...(head?.links || []), ...(documentProps.links || [])];
	const styleTags = documentProps.styles || [];
	const headPrefix = documentProps.headPrefix || [];
	const headSuffix = documentProps.headSuffix || [];
	const hasThemeColor = metaTags.some((tag) => tag?.name === 'theme-color');

	return React.createElement(
		'html',
		htmlAttrs,
		React.createElement(
			'head',
			null,
			...headPrefix,
			React.createElement('meta', { charSet: 'utf-8' }),
			React.createElement('meta', {
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			}),
			hasThemeColor ? null : React.createElement('meta', { name: 'theme-color', content: '#ffffff' }),
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
			...metaTags.map((tag, idx) => renderHeadTag(tag, idx, 'meta')),
			...linkTags.map((tag, idx) => renderHeadTag(tag, idx, 'link')),
			...styleTags.map((style, idx) => renderStyleTag(style, idx)),
			hasIslands && preambleSrc ? React.createElement('script', { type: 'module', src: preambleSrc }) : null,
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
			hasIslands
				? React.createElement('script', {
						id: 'islands-manifest',
						type: 'application/json',
						'data-integrity': manifestIntegrity,
						dangerouslySetInnerHTML: { __html: manifestJson },
					})
				: null,
			hasIslands ? React.createElement('script', { type: 'module', src: runtimeSrc }) : null,
			React.createElement('script', {
				type: 'module',
				src: '/pwa-register.js',
			}),
			...headSuffix,
		),
		React.createElement('body', bodyAttrs, React.createElement('div', { id: 'app' }, children)),
	);
};
