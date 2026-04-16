import { defineTheme } from 'react-islands-runtime/ssr';

import { createAppThemeFeature, createAppThemeModeFeature, createSharedStyles } from '../../_shared/design-system/base.js';

const theme = defineTheme({
	name: 'contentstack',
	colorScheme: 'light',
	themeColor: '#edf7f2',
	tokens: {
		surface: {
			canvas: '#edf7f2',
			muted: '#d9efe4',
			panel: '#fbfffd',
			accent: '#80d4b2',
			shadow: '#215d48',
		},
		text: {
			primary: '#143126',
			muted: '#4d6f63',
		},
		border: {
			subtle: '#b8dccc',
		},
		interactive: {
			link: '#0e7a5e',
			linkHover: '#084d3c',
		},
	},
	documentProps: {
		htmlAttrs: { 'data-demo-theme': 'contentstack' },
		styles: createSharedStyles(),
	},
	modes: {
		dark: {
			colorScheme: 'dark',
			themeColor: '#101d18',
			tokens: {
				surface: {
					canvas: '#0d1512',
					muted: '#14221d',
					panel: 'rgba(20, 42, 34, 0.84)',
					accent: '#73d2ac',
					shadow: '#030706',
				},
				text: {
					primary: '#eafaf2',
					muted: '#a7cdbd',
				},
				border: {
					subtle: '#30574a',
				},
				interactive: {
					link: '#8fe6c1',
					linkHover: '#c4f7df',
				},
			},
		},
	},
});

export const demoFeatures = [createAppThemeFeature(theme), createAppThemeModeFeature(theme)];
