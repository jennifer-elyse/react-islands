// @ts-check

import { createCssService } from '../css/createCssService.js';

/**
 * @typedef {import('../../../types/ssr/index.d.ts').DomainThemeFeatureOptions} DomainThemeFeatureOptions
 */

/**
 * Identity helper for JS-first theme authoring. TS consumers get inference from the .d.ts file.
 *
 * @template {import('../../../types/ssr/index.d.ts').ThemeDefinition} T
 * @param {T} theme
 * @returns {T}
 */
export const defineTheme = (theme) => theme;

/**
 * Identity helper for a theme map keyed by banner/store/domain alias.
 *
 * @template {Record<string, import('../../../types/ssr/index.d.ts').ThemeDefinition>} T
 * @param {T} themes
 * @returns {T}
 */
export const defineThemes = (themes) => themes;

/**
 * Creates a request feature that resolves a theme from the incoming request,
 * installs request-scoped CSS/document props, and exposes `ctx.theme` + `ctx.css`
 * to route loaders/layouts/pages.
 *
 * @param {DomainThemeFeatureOptions} options
 */
export const createDomainThemeFeature = ({
	resolveTheme,
	selector = ':root',
	variablePrefix = '',
	cssServiceFactory = createCssService,
} = {}) => {
	if (typeof resolveTheme !== 'function') {
		throw new Error('createDomainThemeFeature requires resolveTheme(req, match).');
	}

	return {
		name: 'domain-theme',
		extendRequestContext({ req, match }) {
			const css = cssServiceFactory();
			const theme = resolveTheme(req, match) || null;

			if (theme) {
				css.setTheme(theme, {
					selector,
					variablePrefix,
				});
			}

			return {
				css,
				theme,
			};
		},
		getDocumentProps({ context }) {
			return context.css?.toDocumentProps?.() || {};
		},
	};
};
