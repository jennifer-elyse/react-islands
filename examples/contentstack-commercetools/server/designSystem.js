import { defineTheme } from 'react-islands-runtime/ssr';

import {
	createAppThemeFeature,
	createAppThemeModeFeature,
	createSharedStyles,
} from '../../_shared/design-system/base.js';

const contentstackCommercetoolsStyles = `
	[data-demo-theme="contentstack-commercetools"] {
		--font-body: "Charter", "Iowan Old Style", "Palatino Linotype", Georgia, serif;
		--font-heading: "Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
		--font-ui: "Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
		--radius-surface: 24px;
		--radius-image: 16px;
		--radius-pill: 999px;
	}

	[data-demo-theme="contentstack-commercetools"] .demo-shell {
		max-width: 1040px;
	}

	[data-demo-theme="contentstack-commercetools"] .demo-shell__header {
		background:
			linear-gradient(180deg, color-mix(in srgb, white 36%, transparent), transparent 82%),
			color-mix(in srgb, var(--surface-panel) 94%, white);
		border-color: color-mix(in srgb, var(--border-subtle) 92%, white);
		box-shadow:
			0 18px 42px color-mix(in srgb, var(--surface-shadow) 12%, transparent),
			inset 0 1px 0 color-mix(in srgb, white 64%, transparent);
		backdrop-filter: blur(14px) saturate(1.06);
	}

	[data-demo-theme="contentstack-commercetools"] .demo-theme-switch {
		background:
			linear-gradient(180deg, color-mix(in srgb, white 24%, transparent), transparent 88%),
			color-mix(in srgb, var(--surface-panel) 78%, white);
		border-color: color-mix(in srgb, var(--border-subtle) 80%, white);
		box-shadow:
			0 10px 24px color-mix(in srgb, var(--surface-shadow) 10%, transparent),
			inset 0 1px 0 color-mix(in srgb, white 54%, transparent);
	}

	[data-demo-theme="contentstack-commercetools"] .demo-shell__main {
		gap: 32px;
	}

	[data-demo-theme="contentstack-commercetools"] .demo-feature {
		background:
			radial-gradient(circle at top left, color-mix(in srgb, var(--surface-accent) 18%, white), transparent 34%),
			linear-gradient(135deg, color-mix(in srgb, var(--surface-accent) 10%, white), transparent 42%),
			color-mix(in srgb, var(--surface-panel) 94%, white);
		box-shadow:
			0 18px 40px color-mix(in srgb, var(--surface-shadow) 12%, transparent),
			inset 0 1px 0 color-mix(in srgb, white 60%, transparent);
	}

	[data-demo-theme="contentstack-commercetools"] .demo-feature__eyebrow {
		display: inline-flex;
		width: fit-content;
		padding: 8px 12px;
		border-radius: var(--radius-pill, 999px);
		background: color-mix(in srgb, var(--surface-panel) 86%, white);
		border: 1px solid color-mix(in srgb, var(--border-subtle) 72%, white);
		box-shadow: inset 0 1px 0 color-mix(in srgb, white 58%, transparent);
	}

	[data-demo-theme="contentstack-commercetools"] .demo-feature__title {
		font-size: clamp(1.8rem, 3.2vw, 2.6rem);
	}

	[data-demo-theme="contentstack-commercetools"] .demo-feature__chips {
		margin-top: 6px;
	}

	[data-demo-theme="contentstack-commercetools"] .demo-feature__chip {
		background: color-mix(in srgb, var(--surface-panel) 92%, white);
		border-color: color-mix(in srgb, var(--border-subtle) 74%, white);
		box-shadow: inset 0 1px 0 color-mix(in srgb, white 54%, transparent);
	}

	[data-demo-theme="contentstack-commercetools"] .demo-feature__lead-card {
		background:
			linear-gradient(145deg, color-mix(in srgb, var(--surface-accent) 16%, white), transparent 56%),
			color-mix(in srgb, var(--surface-panel) 92%, white);
		box-shadow:
			0 18px 36px color-mix(in srgb, var(--surface-shadow) 12%, transparent),
			inset 0 1px 0 color-mix(in srgb, white 58%, transparent);
	}

	[data-demo-theme="contentstack-commercetools"] .demo-feature__support-card {
		background:
			linear-gradient(180deg, color-mix(in srgb, white 22%, transparent), transparent 44%),
			color-mix(in srgb, var(--surface-panel) 88%, white);
	}

	[data-demo-theme="contentstack-commercetools"] .demo-carousel__viewport {
		padding: 6px;
		border-radius: calc(var(--radius-card, 22px) - 2px);
		background:
			linear-gradient(180deg, color-mix(in srgb, white 16%, transparent), transparent 40%),
			color-mix(in srgb, var(--surface-panel) 88%, white);
		box-shadow:
			inset 0 1px 0 color-mix(in srgb, white 54%, transparent),
			0 16px 34px color-mix(in srgb, var(--surface-shadow) 8%, transparent);
	}

	[data-demo-theme="contentstack-commercetools"] .demo-carousel--spotlight-dots .demo-carousel__slide {
		background:
			linear-gradient(135deg, color-mix(in srgb, var(--surface-accent) 12%, white), transparent 52%),
			color-mix(in srgb, var(--surface-panel) 90%, white);
	}

	[data-demo-theme="contentstack-commercetools"] .demo-carousel__control {
		background: color-mix(in srgb, var(--surface-panel) 92%, white);
		border-color: color-mix(in srgb, var(--border-subtle) 84%, white);
		box-shadow:
			0 12px 26px color-mix(in srgb, var(--surface-shadow) 10%, transparent),
			inset 0 1px 0 color-mix(in srgb, white 60%, transparent);
	}

	[data-demo-theme="contentstack-commercetools"] .demo-carousel__dot[data-active="true"] {
		background: var(--surface-accent);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--surface-accent) 16%, transparent);
	}

	[data-demo-theme="contentstack-commercetools"] .grid-items {
		--grid-items-card-bg: color-mix(in srgb, var(--surface-panel) 82%, var(--surface-canvas));
		--grid-items-card-text: var(--text-primary);
		--grid-items-card-muted: color-mix(in srgb, var(--text-primary) 72%, var(--surface-panel));
		--grid-items-price-bg: color-mix(in srgb, var(--surface-panel) 88%, transparent);
		--grid-items-price-border: color-mix(in srgb, var(--surface-shadow) 12%, var(--border-subtle));
		--grid-items-price-text: var(--text-primary);
		--grid-items-card-shadow: color-mix(in srgb, var(--surface-shadow) 10%, transparent);
		--grid-items-image-overlay-top: color-mix(in srgb, var(--surface-canvas) 8%, transparent);
		--grid-items-image-overlay-bottom: color-mix(in srgb, var(--surface-canvas) 74%, transparent);
		--grid-items-image-overlay-mid: color-mix(in srgb, var(--surface-canvas) 26%, transparent);
		--grid-items-card-radius: var(--radius-surface, 24px);
		--grid-items-card-border: var(--border-subtle);
		--grid-items-card-gap: 1rem;
		--grid-items-card-padding: 1.5rem;
		--grid-items-title-size: clamp(1.6rem, 2vw, 2.15rem);
		--grid-items-item-title-size: clamp(1.35rem, 1.5vw, 2rem);
		--grid-items-meta-size: 1rem;
		--grid-items-link-size: 0.95rem;
		--grid-items-min-height: 16rem;
		--grid-items-feature-height: 33rem;
		display: grid;
		gap: 1.5rem;
	}

	[data-demo-theme="contentstack-commercetools"] .grid-items__header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
	}

	[data-demo-theme="contentstack-commercetools"] .grid-items__title {
		margin: 0;
		font-size: var(--grid-items-title-size);
		line-height: 1.05;
		letter-spacing: -0.04em;
		font-family: var(--font-heading);
	}

	[data-demo-theme="contentstack-commercetools"] .grid-items__link {
		font-family: var(--font-ui);
		font-size: var(--grid-items-link-size);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		text-decoration: none;
	}

	[data-demo-theme="contentstack-commercetools"] .grid-items__layout {
		display: grid;
		grid-template-columns: repeat(12, minmax(0, 1fr));
		gap: var(--grid-items-card-gap);
	}

	[data-demo-theme="contentstack-commercetools"] .grid-items__card {
		position: relative;
		display: flex;
		align-items: flex-end;
		min-height: var(--grid-items-min-height);
		overflow: clip;
		border-radius: var(--grid-items-card-radius);
		border: 1px solid var(--grid-items-card-border);
		background: var(--grid-items-card-bg);
		color: var(--grid-items-card-text);
		text-decoration: none;
		box-shadow: 0 10px 24px var(--grid-items-card-shadow);
	}

	[data-demo-theme="contentstack-commercetools"] .grid-items[data-grid-items-layout="even"] .grid-items__card {
		grid-column: span 3;
	}

	[data-demo-theme="contentstack-commercetools"] .grid-items__card--feature {
		grid-column: span 6;
		grid-row: span 2;
		min-height: var(--grid-items-feature-height);
	}

	[data-demo-theme="contentstack-commercetools"] .grid-items__card--supporting {
		grid-column: span 3;
	}

	[data-demo-theme="contentstack-commercetools"] .grid-items__media {
		position: absolute;
		inset: 0;
	}

	[data-demo-theme="contentstack-commercetools"] .grid-items__media::after {
		content: "";
		position: absolute;
		inset: 0;
		background:
			linear-gradient(180deg, var(--grid-items-image-overlay-top), transparent 30%),
			linear-gradient(
				0deg,
				var(--grid-items-image-overlay-bottom),
				var(--grid-items-image-overlay-mid) 44%,
				color-mix(in srgb, var(--surface-canvas) 6%, transparent)
			);
	}

	[data-demo-theme="contentstack-commercetools"] .grid-items__media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	[data-demo-theme="contentstack-commercetools"] .grid-items__content {
		position: relative;
		z-index: 1;
		display: grid;
		gap: 0.25rem;
		padding: var(--grid-items-card-padding);
	}

	[data-demo-theme="contentstack-commercetools"] .grid-items__eyebrow {
		font-family: var(--font-ui);
		font-size: 0.74rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--grid-items-card-text) 82%, transparent);
	}

	[data-demo-theme="contentstack-commercetools"] .grid-items__price {
		justify-self: start;
		padding: 0.3rem 0.7rem;
		border-radius: 999px;
		border: 1px solid var(--grid-items-price-border);
		background: var(--grid-items-price-bg);
		color: var(--grid-items-price-text);
		font-family: var(--font-ui);
		font-size: 1rem;
		font-weight: 800;
		line-height: 1;
		box-shadow: 0 8px 18px color-mix(in srgb, var(--surface-shadow) 12%, transparent);
		backdrop-filter: blur(8px) saturate(1.1);
		-webkit-backdrop-filter: blur(8px) saturate(1.1);
	}

	[data-demo-theme="contentstack-commercetools"] .grid-items__item-title {
		margin: 0;
		font-size: var(--grid-items-item-title-size);
		line-height: 1.02;
		letter-spacing: -0.04em;
		font-family: var(--font-heading);
	}

	[data-demo-theme="contentstack-commercetools"] .grid-items__meta {
		display: grid;
		gap: 0.15rem;
		margin-top: 0.25rem;
	}

	[data-demo-theme="contentstack-commercetools"] .grid-items__meta-line {
		font-family: var(--font-ui);
		font-size: var(--grid-items-meta-size);
		color: var(--grid-items-card-muted);
	}

	@media (max-width: 900px) {
		[data-demo-theme="contentstack-commercetools"] .grid-items[data-grid-items-layout="feature-first"] .grid-items__card--feature,
		[data-demo-theme="contentstack-commercetools"] .grid-items[data-grid-items-layout="feature-first"] .grid-items__card--supporting,
		[data-demo-theme="contentstack-commercetools"] .grid-items[data-grid-items-layout="even"] .grid-items__card {
			grid-column: span 6;
		}

		[data-demo-theme="contentstack-commercetools"] .grid-items[data-grid-items-layout="feature-first"] .grid-items__card--feature {
			min-height: 26rem;
		}
	}

	@media (max-width: 640px) {
		[data-demo-theme="contentstack-commercetools"] .grid-items__layout {
			grid-template-columns: 1fr;
		}

		[data-demo-theme="contentstack-commercetools"] .grid-items__card--feature,
		[data-demo-theme="contentstack-commercetools"] .grid-items__card--supporting,
		[data-demo-theme="contentstack-commercetools"] .grid-items[data-grid-items-layout="even"] .grid-items__card {
			grid-column: auto;
			grid-row: auto;
			min-height: 18rem;
		}

		[data-demo-theme="contentstack-commercetools"] .grid-items__header {
			flex-direction: column;
			align-items: flex-start;
		}
	}
`;

const theme = defineTheme({
	name: 'contentstack-commercetools',
	colorScheme: 'light',
	themeColor: '#ffffff',
	tokens: {
		surface: {
			canvas: '#ffffff',
			muted: '#f4f2f4',
			panel: '#ffffff',
			accent: '#bf1d4f',
			shadow: '#2a2026',
		},
		text: {
			primary: '#242124',
			muted: '#625963',
		},
		border: {
			subtle: '#e6e0e4',
		},
		interactive: {
			link: '#b3174d',
			linkHover: '#7e1238',
		},
		radius: {
			surface: '24px',
			image: '16px',
			pill: '999px',
		},
		spacing: {
			xxs: '0.125rem',
			xs: '0.25rem',
			sm: '0.75rem',
			md: '1rem',
			lg: '1.5rem',
			xl: '2rem',
			'2xl': '3rem',
		},
		font: {
			body: '"Charter", "Iowan Old Style", "Palatino Linotype", Georgia, serif',
			heading: '"Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
			ui: '"Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
			mono: '"SFMono-Regular", "SF Mono", "Cascadia Code", "Roboto Mono", Consolas, monospace',
		},
		layout: {
			contentMax: '100%',
			shellPaddingBlockStart: '0',
			shellPaddingInline: '0',
			shellPaddingBlockEnd: '2rem',
			headerGap: '1rem',
			stackGap: '2rem',
			sectionPadding: '1.25rem',
		},
		shadow: {
			panel: '0 10px 24px color-mix(in srgb, var(--surface-shadow) 8%, transparent)',
			floating: '0 12px 28px color-mix(in srgb, var(--surface-shadow) 10%, transparent)',
		},
		motion: {
			fast: '180ms',
			normal: '240ms',
		},
	},
	documentProps: {
		htmlAttrs: { 'data-demo-theme': 'contentstack-commercetools' },
		styles: createSharedStyles(contentstackCommercetoolsStyles),
	},
	modes: {
		dark: {
			colorScheme: 'dark',
			themeColor: '#121214',
			tokens: {
				surface: {
					canvas: '#121214',
					muted: '#1a1b1e',
					panel: '#18181a',
					accent: '#d73268',
					shadow: '#020203',
				},
				text: {
					primary: '#f7f4f6',
					muted: '#c4bcc3',
				},
				border: {
					subtle: '#393138',
				},
				interactive: {
					link: '#ef5b8d',
					linkHover: '#ff96b8',
				},
				radius: {
					surface: '24px',
					image: '16px',
					pill: '999px',
				},
				spacing: {
					xxs: '0.125rem',
					xs: '0.25rem',
					sm: '0.75rem',
					md: '1rem',
					lg: '1.5rem',
					xl: '2rem',
					'2xl': '3rem',
				},
				font: {
					body: '"Charter", "Iowan Old Style", "Palatino Linotype", Georgia, serif',
					heading: '"Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
					ui: '"Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
					mono: '"SFMono-Regular", "SF Mono", "Cascadia Code", "Roboto Mono", Consolas, monospace',
				},
				layout: {
					contentMax: '65rem',
					shellPaddingBlockStart: '2rem',
					shellPaddingInline: '1.5rem',
					shellPaddingBlockEnd: '3rem',
					headerGap: '1rem',
					stackGap: '2rem',
					sectionPadding: '1.5rem',
				},
				shadow: {
					panel: '0 10px 30px color-mix(in srgb, var(--surface-shadow) 10%, transparent)',
					floating: '0 16px 40px color-mix(in srgb, var(--surface-shadow) 16%, transparent)',
				},
				motion: {
					fast: '180ms',
					normal: '240ms',
				},
			},
		},
	},
});

export const demoFeatures = [createAppThemeFeature(theme), createAppThemeModeFeature(theme)];
