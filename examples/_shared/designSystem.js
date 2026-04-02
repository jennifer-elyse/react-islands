import { createDomainThemeFeature, defineThemes } from 'react-islands-runtime/ssr';

const sharedDocumentStyles = `
	body {
		margin: 0;
		background:
			radial-gradient(circle at top, color-mix(in srgb, var(--surface-accent) 18%, transparent), transparent 42%),
			linear-gradient(180deg, var(--surface-canvas), var(--surface-muted));
		color: var(--text-primary);
		font-family: "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif;
	}

	a {
		color: var(--interactive-link);
	}

	a:hover {
		color: var(--interactive-link-hover);
	}

	::selection {
		background: color-mix(in srgb, var(--surface-accent) 45%, white);
		color: var(--text-primary);
	}

	#app {
		min-height: 100vh;
	}
`;

const shellStyles = `
	.demo-shell {
		max-width: 1040px;
		margin: 0 auto;
		padding: 32px 20px 56px;
	}

	.demo-shell__header {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 28px;
		padding: 18px 22px;
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-shell, 24px);
		background: color-mix(in srgb, var(--surface-panel) 88%, white);
		box-shadow: 0 16px 40px color-mix(in srgb, var(--surface-shadow) 16%, transparent);
		backdrop-filter: blur(14px);
	}

	.demo-shell__brand {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.demo-shell__eyebrow {
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.demo-shell__name {
		font-size: 1.2rem;
		font-weight: 700;
	}

	.demo-shell__nav {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.demo-shell__nav a {
		padding: 10px 14px;
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-pill, 999px);
		background: color-mix(in srgb, var(--surface-canvas) 72%, white);
		text-decoration: none;
		font-size: 0.95rem;
		transition: transform 180ms ease, background 180ms ease, border-color 180ms ease;
	}

	.demo-shell__nav a:hover {
		transform: translateY(-1px);
	}

	.demo-shell__main {
		display: grid;
		gap: 20px;
	}

	.demo-shell section {
		padding: 22px;
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-card, 22px);
		background: color-mix(in srgb, var(--surface-panel) 92%, white);
		box-shadow: 0 10px 30px color-mix(in srgb, var(--surface-shadow) 10%, transparent);
	}

	.demo-shell h1,
	.demo-shell h2 {
		font-family: "Avenir Next", "Segoe UI", sans-serif;
		letter-spacing: -0.03em;
	}

	.demo-shell__footer {
		margin-top: 28px;
		padding: 16px 4px 0;
		color: var(--text-muted);
		font-size: 0.92rem;
	}

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

	[data-demo-theme="test-data"] .demo-shell__main {
		gap: 24px;
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
	.test-data-cart-card {
		display: grid;
		gap: 14px;
	}

	.test-data-card-title {
		margin: 0;
		font-size: 1.35rem;
	}

	.test-data-card-copy {
		margin: 0;
		color: var(--text-muted);
	}

	.test-data-products-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 18px;
	}

	.test-data-product-card {
		display: grid;
		gap: 12px;
		padding: 14px;
		border-radius: var(--radius-card, 24px);
		border: 1px solid color-mix(in oklab, var(--border-subtle) 78%, white);
		background:
			linear-gradient(180deg, color-mix(in oklab, white 18%, transparent), transparent 38%),
			color-mix(in oklab, var(--surface-panel) 74%, white);
		box-shadow:
			0 16px 32px color-mix(in oklab, var(--surface-shadow) 10%, transparent),
			inset 0 1px 0 color-mix(in oklab, white 58%, transparent);
		backdrop-filter: blur(12px) saturate(1.12);
		text-decoration: none;
		color: inherit;
		transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
	}

	.test-data-product-card:hover {
		transform: translateY(-3px);
		box-shadow: 0 24px 42px color-mix(in oklab, var(--surface-shadow) 16%, transparent);
		border-color: color-mix(in oklab, var(--surface-accent) 40%, white);
	}

	.test-data-product-card img {
		width: 100%;
		height: 180px;
		object-fit: cover;
		border-radius: calc(var(--radius-card, 24px) - 8px);
	}

	.test-data-product-card__name {
		font-size: 1rem;
		font-weight: 700;
	}

	.test-data-product-card__price {
		font-size: 0.94rem;
		color: color-mix(in oklab, var(--text-primary) 84%, white);
	}

	.test-data-product-card__description {
		font-size: 0.88rem;
		line-height: 1.55;
		color: var(--text-muted);
	}

	.test-data-product-detail {
		display: grid;
		grid-template-columns: minmax(260px, 420px) minmax(0, 1fr);
		gap: 24px;
		align-items: start;
	}

	.test-data-product-detail__image {
		width: 100%;
		aspect-ratio: 4 / 5;
		object-fit: cover;
		border-radius: var(--radius-card, 24px);
		box-shadow: 0 24px 48px color-mix(in oklab, var(--surface-shadow) 16%, transparent);
	}

	.test-data-product-detail__copy {
		display: grid;
		gap: 12px;
	}

	.test-data-product-detail__sku {
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.12em;
		font-size: 0.78rem;
	}

	.test-data-product-detail__price {
		font-size: 1.5rem;
		font-weight: 800;
	}

	@media (max-width: 720px) {
		.demo-shell {
			padding-inline: 14px;
		}

		.demo-shell__header {
			padding: 16px;
			border-radius: 18px;
		}

		.demo-shell section {
			padding: 18px;
			border-radius: 18px;
		}

		.test-data-hero {
			grid-template-columns: 1fr;
		}

		.test-data-hero__visual {
			min-height: 220px;
		}

		.test-data-hero__visual img {
			inset: 0 18px 18px;
			width: calc(100% - 36px);
			height: calc(100% - 18px);
			border-radius: 22px;
		}

		.test-data-product-detail {
			grid-template-columns: 1fr;
		}
	}
`;

const themes = defineThemes({
	agility: {
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
			htmlAttrs: { 'data-demo-theme': 'agility' },
			styles: [
				{ id: 'demo-base', cssText: sharedDocumentStyles },
				{ id: 'demo-shell', cssText: shellStyles },
			],
		},
	},
	commercetools: {
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
			htmlAttrs: { 'data-demo-theme': 'commercetools' },
			styles: [
				{ id: 'demo-base', cssText: sharedDocumentStyles },
				{ id: 'demo-shell', cssText: shellStyles },
			],
		},
	},
	contentstack: {
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
			styles: [
				{ id: 'demo-base', cssText: sharedDocumentStyles },
				{ id: 'demo-shell', cssText: shellStyles },
			],
		},
	},
	'contentstack-commercetools': {
		name: 'contentstack-commercetools',
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
			htmlAttrs: { 'data-demo-theme': 'contentstack-commercetools' },
			styles: [
				{ id: 'demo-base', cssText: sharedDocumentStyles },
				{ id: 'demo-shell', cssText: shellStyles },
			],
		},
	},
	'test-data': {
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
			styles: [
				{ id: 'demo-base', cssText: sharedDocumentStyles },
				{ id: 'demo-shell', cssText: shellStyles },
			],
		},
	},
});

const mapDemoNameToThemeKey = (name) => {
	if (name === 'agility-demo') return 'agility';
	if (name === 'commercetools-demo') return 'commercetools';
	if (name === 'contentstack-demo') return 'contentstack';
	if (name === 'contentstack-commercetools-demo') return 'contentstack-commercetools';
	if (name === 'test-data-demo') return 'test-data';
	return 'commercetools';
};

export const createDemoThemeFeature = (name) =>
	createDomainThemeFeature({
		resolveTheme() {
			return themes[mapDemoNameToThemeKey(name)] || null;
		},
	});
