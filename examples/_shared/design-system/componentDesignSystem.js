export const createExampleComponentDesignSystem = (name, overrides = {}) => ({
	name,
	attrs: {
		'data-example-design-system': name,
	},
	components: {
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
		...(overrides.components || {}),
	},
	...overrides,
});
