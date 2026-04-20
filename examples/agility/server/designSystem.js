import { createDesignSystem, defineTheme } from 'react-islands-runtime/ssr';

import { createSharedStyles } from './baseStyles.js';
import { carouselStyles, productSearchStyles } from './componentStyles.js';
import { createExampleComponentDesignSystem } from '../../_shared/design-system/componentDesignSystem.js';

const theme = defineTheme({
	name: 'agility',
	colorScheme: 'light',
	themeColor: '#f4efe5',
	tokens: {
		surface: {
			canvas: '#f4efe5',
			muted: '#efe6d6',
			panel: '#fffaf0',
			accent: '#d8b67a',
			shadow: '#8c6a3f',
		},
		text: {
			primary: '#2d241b',
			muted: '#6d5a45',
		},
		border: {
			subtle: '#d7c3a6',
		},
		interactive: {
			link: '#8b5e34',
			linkHover: '#5c3b1b',
		},
	},
	documentProps: {
		htmlAttrs: { 'data-theme': 'agility' },
		styles: createSharedStyles(carouselStyles, productSearchStyles),
	},
	modes: {
		dark: {
			colorScheme: 'dark',
			themeColor: '#1f1913',
			tokens: {
				surface: {
					canvas: '#19130f',
					muted: '#231b16',
					panel: 'rgba(45, 34, 27, 0.84)',
					accent: '#d9b16e',
					shadow: '#070504',
				},
				text: {
					primary: '#f3e8da',
					muted: '#c6ab88',
				},
				border: {
					subtle: '#6f573d',
				},
				interactive: {
					link: '#f2c588',
					linkHover: '#ffe0b4',
				},
			},
		},
	},
});

export const demoComponentDesignSystem = createExampleComponentDesignSystem('agility');
export const { features: demoFeatures } = createDesignSystem(theme);
