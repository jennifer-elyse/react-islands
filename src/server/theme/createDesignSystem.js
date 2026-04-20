// @ts-check

import { createDomainThemeFeature } from './createDomainThemeFeature.js';
import { createThemeModeFeature } from './createThemeModeFeature.js';

/**
 * @typedef {import('../../../types/ssr/index.d.ts').ThemeDefinition} ThemeDefinition
 * @typedef {import('../../../types/ssr/index.d.ts').DesignSystemDefinition} DesignSystemDefinition
 * @typedef {import('../../../types/ssr/index.d.ts').ThemeModeFeatureOptions} ThemeModeFeatureOptions
 * @typedef {import('../../../types/ssr/index.d.ts').RenderFeature} RenderFeature
 */

/**
 * Identity helper for JS-first design-system authoring.
 *
 * @template {DesignSystemDefinition} T
 * @param {T} designSystem
 * @returns {T}
 */
export const defineDesignSystem = (designSystem) => designSystem;

const isPlainObject = (value) => value && typeof value === 'object' && !Array.isArray(value);

const deriveThemeColors = (theme) => {
	if (!theme || typeof theme !== 'object') return {};

	/** @type {Record<string, string>} */
	const themeColors = {};

	if (typeof theme.themeColor === 'string' && theme.themeColor) {
		themeColors.light = theme.themeColor;
	}

	if (theme.modes && typeof theme.modes === 'object') {
		for (const [modeName, modeTheme] of Object.entries(theme.modes)) {
			if (typeof modeTheme?.themeColor === 'string' && modeTheme.themeColor) {
				themeColors[modeName] = modeTheme.themeColor;
			}
		}
	}

	return themeColors;
};

/**
 * @param {ThemeDefinition | DesignSystemDefinition} input
 * @param {Partial<DesignSystemDefinition>} [overrides]
 */
const normalizeDesignSystem = (input, overrides = {}) => {
	const base =
		isPlainObject(input) && ('theme' in input || 'resolveTheme' in input || 'mode' in input)
			? input
			: { theme: input };

	return {
		...base,
		...overrides,
		mode:
			Object.prototype.hasOwnProperty.call(overrides, 'mode')
				? overrides.mode
				: base.mode,
	};
};

/**
 * @param {ThemeDefinition | DesignSystemDefinition} input
 * @param {Partial<DesignSystemDefinition>} [overrides]
 * @returns {RenderFeature[]}
 */
export const createDesignSystemFeatures = (input, overrides = {}) => {
	const designSystem = normalizeDesignSystem(input, overrides);
	const { theme, resolveTheme, selector, variablePrefix, cssServiceFactory, mode } = designSystem;

	const resolvedTheme =
		typeof resolveTheme === 'function'
			? resolveTheme
			: () => theme || null;

	/** @type {RenderFeature[]} */
	const features = [
		createDomainThemeFeature({
			resolveTheme: resolvedTheme,
			selector,
			variablePrefix,
			cssServiceFactory,
		}),
	];

	if (mode !== false) {
		/** @type {ThemeModeFeatureOptions} */
		const modeOptions = {
			...(mode || {}),
			themeColors:
				mode?.themeColors && Object.keys(mode.themeColors).length > 0
					? mode.themeColors
					: deriveThemeColors(theme),
		};

		features.push(createThemeModeFeature(modeOptions));
	}

	return features;
};

/**
 * Normalizes a design system and attaches the render features needed to use it.
 *
 * @param {ThemeDefinition | DesignSystemDefinition} input
 * @param {Partial<DesignSystemDefinition>} [overrides]
 */
export const createDesignSystem = (input, overrides = {}) => {
	const designSystem = normalizeDesignSystem(input, overrides);
	return {
		...designSystem,
		features: createDesignSystemFeatures(designSystem),
	};
};
