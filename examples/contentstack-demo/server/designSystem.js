import { defineTheme } from 'react-islands-runtime/ssr';

import { createAppThemeFeature, createAppThemeModeFeature, createSharedStyles } from '../../_shared/design-system/base.js';

const theme = defineTheme({
	name: 'contentstack',
	colorScheme: 'light',
	themeColor: '#f7f2ea',
	tokens: {
		surface: {
			canvas: '#f7f2ea',
			muted: '#efe3d2',
			panel: '#fffdfa',
			accent: '#f0b56f',
			shadow: '#9e5f25',
		},
		text: {
			primary: '#332117',
			muted: '#7d614a',
		},
		border: {
			subtle: '#e1c5a3',
		},
		interactive: {
			link: '#9c4f10',
			linkHover: '#6d3305',
		},
	},
	documentProps: {
		htmlAttrs: { 'data-demo-theme': 'contentstack' },
		styles: createSharedStyles(),
	},
	modes: {
		dark: {
			colorScheme: 'dark',
			themeColor: '#1f1712',
			tokens: {
				surface: {
					canvas: '#18110d',
					muted: '#241912',
					panel: 'rgba(49, 34, 24, 0.84)',
					accent: '#efb364',
					shadow: '#070403',
				},
				text: {
					primary: '#f8e8db',
					muted: '#caa88a',
				},
				border: {
					subtle: '#76543b',
				},
				interactive: {
					link: '#f3bf82',
					linkHover: '#ffe1ba',
				},
			},
		},
	},
});

export const demoFeatures = [createAppThemeFeature(theme), createAppThemeModeFeature(theme)];
