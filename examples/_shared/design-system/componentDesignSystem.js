const mergeSection = (base = {}, override = {}) => ({
	...base,
	...override,
	attrs: { ...(base.attrs || {}), ...(override.attrs || {}) },
	style: { ...(base.style || {}), ...(override.style || {}) },
	vars: { ...(base.vars || {}), ...(override.vars || {}) },
});

const baseComponents = (name) => ({
	all: {
		attrs: {
			'data-example-design-system': name,
		},
	},
	carouselBlock: {
		attrs: { 'data-component-surface': 'carousel-block' },
	},
	carousel: {
		attrs: { 'data-component-surface': 'carousel' },
	},
	featureSplitBlock: {
		attrs: { 'data-component-surface': 'feature-split' },
	},
	gridItemsBlock: {
		attrs: { 'data-component-surface': 'grid-items' },
	},
	plpProductsBlock: {
		attrs: { 'data-component-surface': 'plp-products' },
	},
	productDetailBlock: {
		attrs: { 'data-component-surface': 'product-detail' },
	},
	productSearch: {
		attrs: { 'data-component-surface': 'product-search' },
	},
	themeModeSwitch: {
		attrs: { 'data-component-surface': 'theme-mode-switch' },
	},
});

export const createExampleComponentDesignSystem = (name, overrides = {}) => {
	const components = baseComponents(name);
	const overrideComponents = overrides.components || {};

	for (const [componentName, componentConfig] of Object.entries(overrideComponents)) {
		components[componentName] = mergeSection(components[componentName], componentConfig);
	}

	return {
		name,
		...overrides,
		attrs: {
			'data-example-design-system': name,
			...(overrides.attrs || {}),
		},
		style: { ...(overrides.style || {}) },
		vars: { ...(overrides.vars || {}) },
		components,
	};
};
