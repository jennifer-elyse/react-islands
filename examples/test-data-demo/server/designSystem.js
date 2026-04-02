import { defineTheme } from 'react-islands-runtime/ssr';

import { createAppThemeFeature, createAppThemeModeFeature, createSharedStyles } from '../../_shared/design-system/base.js';

const testDataStyles = `
	[data-demo-theme="test-data"] .demo-shell {
		max-width: 1120px;
	}

	[data-demo-theme="test-data"] .demo-shell__header {
		background:
			linear-gradient(135deg, oklab(0.9 -0.035 -0.035 / 0.78), oklab(0.97 0.005 0.06 / 0.82)),
			color-mix(in oklab, var(--surface-panel) 78%, white);
		border-color: color-mix(in oklab, var(--border-subtle) 86%, white);
		box-shadow:
			0 22px 48px color-mix(in oklab, var(--surface-shadow) 16%, transparent),
			inset 0 1px 0 color-mix(in oklab, white 62%, transparent),
			inset 0 -18px 42px color-mix(in oklab, var(--surface-accent) 10%, transparent);
		backdrop-filter: blur(18px) saturate(1.18);
	}

	[data-demo-theme="test-data"] .demo-shell__nav a {
		background: color-mix(in oklab, var(--surface-panel) 72%, white);
		border-color: color-mix(in oklab, var(--border-subtle) 82%, white);
		box-shadow: inset 0 1px 0 color-mix(in oklab, white 50%, transparent);
	}

	[data-demo-theme="test-data"] .demo-theme-switch {
		background:
			linear-gradient(180deg, color-mix(in oklab, white 24%, transparent), transparent 88%),
			color-mix(in oklab, var(--surface-panel) 74%, white);
		border-color: color-mix(in oklab, var(--border-subtle) 78%, white);
		box-shadow:
			0 16px 36px color-mix(in oklab, var(--surface-shadow) 12%, transparent),
			inset 0 1px 0 color-mix(in oklab, white 54%, transparent);
	}

	html[data-demo-theme="test-data"][data-theme-mode="dark"] .demo-shell__header {
		background:
			linear-gradient(145deg, color-mix(in oklab, var(--surface-panel) 92%, black), color-mix(in oklab, var(--surface-accent) 14%, var(--surface-panel))),
			color-mix(in oklab, var(--surface-panel) 92%, black);
		border-color: color-mix(in oklab, var(--border-subtle) 72%, transparent);
		box-shadow:
			0 24px 58px color-mix(in oklab, black 34%, transparent),
			inset 0 1px 0 color-mix(in oklab, white 12%, transparent);
	}

	[data-demo-theme="test-data"] .demo-shell__main {
		gap: 24px;
	}
`;

const theme = defineTheme({
	name: 'test-data',
	colorScheme: 'light',
	themeColor: 'oklab(0.8 -0.055 -0.05)',
	tokens: {
		surface: {
			canvas: 'oklab(0.985 -0.015 -0.014)',
			muted: 'oklab(0.95 -0.018 0.038)',
			panel: 'oklab(0.99 -0.01 -0.004 / 0.84)',
			accent: 'oklab(0.82 -0.07 -0.055)',
			shadow: 'oklab(0.56 -0.052 -0.072)',
		},
		text: {
			primary: 'oklab(0.39 -0.022 -0.042)',
			muted: 'oklab(0.58 -0.015 -0.006)',
		},
		border: {
			subtle: 'oklab(0.875 -0.022 0.026)',
		},
		interactive: {
			link: 'oklab(0.62 -0.06 -0.082)',
			linkHover: 'oklab(0.48 -0.046 -0.067)',
		},
		radius: {
			shell: '32px',
			card: '26px',
			hero: '36px',
			pill: '999px',
		},
	},
	documentProps: {
		htmlAttrs: { 'data-demo-theme': 'test-data' },
		styles: createSharedStyles(testDataStyles),
	},
	modes: {
		dark: {
			colorScheme: 'dark',
			themeColor: 'oklab(0.34 -0.028 -0.05)',
			tokens: {
				surface: {
					canvas: 'oklab(0.2 -0.01 -0.02)',
					muted: 'oklab(0.27 -0.01 0.01)',
					panel: 'oklab(0.3 -0.012 -0.018 / 0.82)',
					accent: 'oklab(0.72 -0.07 -0.06)',
					shadow: 'oklab(0.12 -0.01 -0.02)',
				},
				text: {
					primary: 'oklab(0.92 -0.01 -0.015)',
					muted: 'oklab(0.76 -0.008 0.012)',
				},
				border: {
					subtle: 'oklab(0.46 -0.018 0.02)',
				},
				interactive: {
					link: 'oklab(0.82 -0.06 -0.07)',
					linkHover: 'oklab(0.9 -0.03 -0.03)',
				},
				radius: {
					shell: '32px',
					card: '26px',
					hero: '36px',
					pill: '999px',
				},
			},
		},
	},
});

export const demoFeatures = [createAppThemeFeature(theme), createAppThemeModeFeature(theme, { allowAuto: true })];
