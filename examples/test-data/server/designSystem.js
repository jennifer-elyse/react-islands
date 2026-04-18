import { createDesignSystem, defineTheme } from 'react-islands-runtime/ssr';

import { createSharedStyles } from '../../_shared/design-system/base.js';
import { createExampleComponentDesignSystem } from '../../_shared/design-system/componentDesignSystem.js';

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

	[data-demo-theme="test-data"] .demo-feature {
		background:
			radial-gradient(circle at 14% 18%, oklab(0.99 -0.008 -0.012 / 0.56), transparent 30%),
			linear-gradient(145deg, color-mix(in oklab, var(--surface-accent) 20%, white), transparent 52%),
			color-mix(in oklab, var(--surface-panel) 82%, white);
		border-color: color-mix(in oklab, var(--border-subtle) 80%, white);
		box-shadow:
			0 24px 56px color-mix(in oklab, var(--surface-shadow) 16%, transparent),
			inset 0 1px 0 color-mix(in oklab, white 62%, transparent),
			inset 0 -24px 44px color-mix(in oklab, var(--surface-accent) 10%, transparent);
	}

	[data-demo-theme="test-data"] .demo-feature__eyebrow {
		display: inline-flex;
		width: fit-content;
		padding: 8px 12px;
		border-radius: var(--radius-pill, 999px);
		background: color-mix(in oklab, var(--surface-panel) 60%, white);
		border: 1px solid color-mix(in oklab, var(--border-subtle) 72%, white);
		box-shadow: inset 0 1px 0 color-mix(in oklab, white 58%, transparent);
	}

	[data-demo-theme="test-data"] .demo-feature__chip {
		background: color-mix(in oklab, var(--surface-panel) 68%, white);
		border-color: color-mix(in oklab, var(--border-subtle) 74%, white);
		box-shadow: inset 0 1px 0 color-mix(in oklab, white 56%, transparent);
	}

	[data-demo-theme="test-data"] .demo-feature__lead-card {
		background:
			linear-gradient(155deg, color-mix(in oklab, var(--surface-accent) 20%, white), transparent 58%),
			color-mix(in oklab, var(--surface-panel) 84%, white);
		box-shadow:
			0 22px 44px color-mix(in oklab, var(--surface-shadow) 18%, transparent),
			inset 0 1px 0 color-mix(in oklab, white 58%, transparent);
	}

	[data-demo-theme="test-data"] .demo-feature__support-card {
		background:
			linear-gradient(180deg, color-mix(in oklab, white 26%, transparent), transparent 44%),
			color-mix(in oklab, var(--surface-panel) 80%, white);
	}

	[data-demo-theme="test-data"] .demo-feature__thumb,
	[data-demo-theme="test-data"] .demo-feature__support-media,
	[data-demo-theme="test-data"] .demo-feature__lead-media img {
		filter: saturate(1.06) contrast(1.02);
	}

	.test-data-page {
		display: grid;
		gap: 24px;
	}

	.test-data-hero {
		position: relative;
		overflow: hidden;
		display: grid;
		grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
		gap: 26px;
		padding: 0;
		border-radius: var(--radius-hero, 34px);
		border: 1px solid color-mix(in oklab, var(--border-subtle) 78%, white);
		background:
			linear-gradient(145deg, oklab(0.78 -0.07 -0.06), oklab(0.9 -0.015 0.015) 48%, oklab(0.96 0.008 0.06)),
			color-mix(in oklab, var(--surface-panel) 82%, white);
		box-shadow:
			0 24px 60px color-mix(in oklab, var(--surface-shadow) 22%, transparent),
			inset 0 1px 0 color-mix(in oklab, white 64%, transparent),
			inset 0 -28px 48px color-mix(in oklab, var(--surface-accent) 12%, transparent);
	}

	.test-data-hero::before {
		content: "";
		position: absolute;
		inset: 0;
		background:
			radial-gradient(circle at 18% 18%, oklab(0.98 -0.005 -0.01 / 0.6), transparent 30%),
			radial-gradient(circle at 80% 12%, oklab(0.98 -0.01 0.07 / 0.38), transparent 26%),
			linear-gradient(180deg, color-mix(in oklab, white 24%, transparent), transparent 32%);
		pointer-events: none;
	}

	.test-data-hero__content {
		position: relative;
		z-index: 1;
		padding: 34px 30px 32px;
		display: grid;
		align-content: center;
		gap: 14px;
	}

	.test-data-hero__eyebrow {
		display: inline-flex;
		width: fit-content;
		padding: 8px 12px;
		border-radius: var(--radius-pill, 999px);
		background: color-mix(in oklab, var(--surface-panel) 62%, white);
		border: 1px solid color-mix(in oklab, var(--border-subtle) 70%, white);
		box-shadow: inset 0 1px 0 color-mix(in oklab, white 58%, transparent);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.test-data-hero__title {
		margin: 0;
		font-size: clamp(2.6rem, 4vw, 4.5rem);
		line-height: 0.92;
		max-width: 8ch;
		text-wrap: balance;
	}

	.test-data-hero__subtitle {
		margin: 0;
		max-width: 32rem;
		font-size: 1.02rem;
		line-height: 1.65;
		color: color-mix(in oklab, var(--text-primary) 78%, white);
	}

	.test-data-hero__meta {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		padding: 0;
		margin: 8px 0 0;
		list-style: none;
	}

	.test-data-hero__meta li {
		padding: 10px 14px;
		border-radius: var(--radius-pill, 999px);
		background: color-mix(in oklab, var(--surface-panel) 64%, white);
		border: 1px solid color-mix(in oklab, var(--border-subtle) 68%, white);
		backdrop-filter: blur(12px);
		font-size: 0.9rem;
	}

	.test-data-hero__visual {
		position: relative;
		min-height: 320px;
	}

	.test-data-hero__visual img {
		position: absolute;
		inset: 18px 18px 18px 0;
		width: calc(100% - 18px);
		height: calc(100% - 36px);
		object-fit: cover;
		border-radius: 28px 0 0 28px;
		box-shadow:
			0 24px 50px color-mix(in oklab, var(--surface-shadow) 28%, transparent),
			inset 0 1px 0 color-mix(in oklab, white 42%, transparent);
		filter: saturate(1.08) contrast(1.02);
	}

	.test-data-hero__swash {
		position: absolute;
		right: 18px;
		bottom: 20px;
		padding: 10px 14px;
		border-radius: var(--radius-pill, 999px);
		background: color-mix(in oklab, var(--surface-panel) 62%, white);
		backdrop-filter: blur(14px) saturate(1.12);
		border: 1px solid color-mix(in oklab, var(--border-subtle) 70%, white);
		box-shadow: inset 0 1px 0 color-mix(in oklab, white 54%, transparent);
		font-size: 0.84rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.test-data-promo {
		display: grid;
		gap: 10px;
	}

	.test-data-promo__title {
		font-size: 1.05rem;
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.test-data-promo__body {
		color: var(--text-muted);
		line-height: 1.6;
	}

	.test-data-search-card,
	.test-data-cart-card,
	.test-data-carousel-card {
		display: grid;
		gap: 14px;
	}

	.test-data-carousel-card {
		background:
			linear-gradient(180deg, color-mix(in oklab, white 26%, transparent), transparent 36%),
			color-mix(in oklab, var(--surface-panel) 78%, white);
	}

	.test-data-card-title {
		margin: 0;
		font-size: 1.35rem;
	}

	.test-data-card-copy {
		margin: 0;
		color: var(--text-muted);
	}

	@media (max-width: 720px) {
		.test-data-hero {
			grid-template-columns: 1fr;
		}

		.test-data-hero__visual {
			min-height: 280px;
		}

		.test-data-hero__visual img {
			inset: 0;
			width: 100%;
			height: 100%;
			border-radius: 0 0 28px 28px;
		}
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

export const demoComponentDesignSystem = createExampleComponentDesignSystem('test-data');
export const { features: demoFeatures } = createDesignSystem(theme, {
	mode: {
		allowAuto: true,
		defaultPreference: 'auto',
		fallbackMode: 'light',
	},
});
