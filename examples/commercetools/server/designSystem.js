import { createDesignSystem, defineTheme } from 'react-islands-runtime/ssr';

import { createSharedStyles } from './baseStyles.js';
import { carouselStyles, productSearchStyles } from './componentStyles.js';
import { createExampleComponentDesignSystem } from '../../_shared/design-system/componentDesignSystem.js';

const theme = defineTheme({
	name: 'commercetools',
	colorScheme: 'light',
	themeColor: '#eef6ff',
	tokens: {
		surface: {
			canvas: '#eef6ff',
			muted: '#dcecff',
			panel: '#ffffff',
			accent: '#7db8ff',
			shadow: '#3166a8',
		},
		text: {
			primary: '#132238',
			muted: '#52657f',
		},
		border: {
			subtle: '#bfd7f3',
		},
		interactive: {
			link: '#1359b7',
			linkHover: '#0a3977',
		},
	},
	documentProps: {
		htmlAttrs: { 'data-theme': 'commercetools' },
		styles: createSharedStyles(carouselStyles, productSearchStyles),
	},
	modes: {
		dark: {
			colorScheme: 'dark',
			themeColor: '#101a29',
			tokens: {
				surface: {
					canvas: '#0d1621',
					muted: '#132131',
					panel: 'rgba(22, 34, 52, 0.84)',
					accent: '#78b6ff',
					shadow: '#04070d',
				},
				text: {
					primary: '#edf6ff',
					muted: '#a9c0db',
				},
				border: {
					subtle: '#315070',
				},
				interactive: {
					link: '#8bc2ff',
					linkHover: '#c1e0ff',
				},
			},
		},
	},
});

export const demoComponentDesignSystem = createExampleComponentDesignSystem('commercetools');
export const { features: demoFeatures } = createDesignSystem(theme);
