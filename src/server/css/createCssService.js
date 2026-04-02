// @ts-check

import { tokensToCssText } from './tokensToCss.js';
import { mergeDocumentProps } from './mergeDocumentProps.js';

/**
 * @typedef {import('../../../types/ssr/index.d.ts').CssService} CssService
 * @typedef {import('../../../types/ssr/index.d.ts').DocumentProps} DocumentProps
 */

const makeStyleEntry = (cssText, options = {}) => ({
	key: options.key || null,
	cssText,
	media: options.media || null,
	id: options.id || null,
});

const makeLinkEntry = (href, options = {}) => ({
	rel: options.rel || 'stylesheet',
	href,
	media: options.media || null,
	crossOrigin: options.crossOrigin || null,
	referrerPolicy: options.referrerPolicy || null,
});

const dedupeCssBlocks = (...blocks) =>
	blocks
		.filter(Boolean)
		.map((block) => String(block).trim())
		.filter((block, index, all) => all.indexOf(block) === index)
		.join('\n\n');

/**
 * Request-scoped CSS collector for SSR and server-rendered islands.
 * Safe to instantiate once per request.
 *
 * @returns {CssService}
 */
export const createCssService = () => {
	/** @type {Map<string, ReturnType<typeof makeStyleEntry>>} */
	const stylesByKey = new Map();
	/** @type {ReturnType<typeof makeStyleEntry>[]} */
	const anonymousStyles = [];
	/** @type {ReturnType<typeof makeLinkEntry>[]} */
	const links = [];
	/** @type {DocumentProps} */
	let extraDocumentProps = {};
	/** @type {string | null} */
	let selector = ':root';
	/** @type {string} */
	let variablePrefix = '';

	return {
		addInlineCss(cssText, options = {}) {
			const entry = makeStyleEntry(cssText, options);
			if (entry.key) stylesByKey.set(entry.key, entry);
			else anonymousStyles.push(entry);
			return entry;
		},
		addStylesheet(href, options = {}) {
			const entry = makeLinkEntry(href, options);
			links.push(entry);
			return entry;
		},
		setTheme(theme, options = {}) {
			selector = options.selector || selector || ':root';
			variablePrefix = options.variablePrefix || variablePrefix || '';

			if (theme?.tokens) {
				const cssText = dedupeCssBlocks(
					tokensToCssText(theme.tokens, {
						selector,
						prefix: variablePrefix,
					}),
					variablePrefix
						? tokensToCssText(theme.tokens, {
								selector,
							})
						: '',
				);
				this.addInlineCss(cssText, {
					key: options.styleKey || 'theme-tokens',
					id: options.styleId || 'ri-theme-tokens',
				});
			}

			/** @type {DocumentProps} */
			const patch = {
				htmlAttrs: {
					...(theme?.name ? { 'data-banner': theme.name } : {}),
					...(theme?.colorScheme ? { 'data-color-scheme': theme.colorScheme } : {}),
				},
				meta: theme?.themeColor ? [{ name: 'theme-color', content: theme.themeColor }] : [],
			};

			if (theme?.documentProps) extraDocumentProps = mergeDocumentProps(extraDocumentProps, theme.documentProps);
			extraDocumentProps = mergeDocumentProps(extraDocumentProps, patch);
			return theme;
		},
		extendDocumentProps(documentProps) {
			extraDocumentProps = mergeDocumentProps(extraDocumentProps, documentProps);
		},
		toDocumentProps() {
			const styles = [...stylesByKey.values(), ...anonymousStyles].map((entry) => ({
				id: entry.id || undefined,
				media: entry.media || undefined,
				cssText: entry.cssText,
			}));

			return mergeDocumentProps(extraDocumentProps, {
				links,
				styles,
			});
		},
	};
};
