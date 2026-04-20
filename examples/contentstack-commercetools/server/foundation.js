import { createDomainThemeFeature, createThemeModeFeature } from 'react-islands-runtime/ssr';

export const documentStyles = `
	body {
		margin: 0;
		background:
			linear-gradient(180deg, var(--surface-canvas), var(--surface-muted));
		color: var(--text-primary);
		font-family: var(--font-body, "Charter", "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif);
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

	code,
	pre,
	kbd,
	samp {
		font-family: var(--font-mono, "SFMono-Regular", "SF Mono", "Cascadia Code", "Roboto Mono", Consolas, monospace);
	}
`;

export const shellStyles = `
	.app-shell {
		max-width: var(--layout-content-max, 65rem);
		margin: 0 auto;
		padding:
			var(--layout-shell-padding-block-start, var(--spacing-xl, 2rem))
			var(--layout-shell-padding-inline, var(--spacing-lg, 1.5rem))
			var(--layout-shell-padding-block-end, var(--spacing-2xl, 3rem));
	}

	.app-shell__header {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0;
		margin-bottom: var(--layout-stack-gap, var(--spacing-xl, 2rem));
		padding: 0;
		border: 0;
		border-bottom: 1px solid var(--border-subtle);
		border-radius: 0;
		background: #ffffff;
		color: var(--text-primary);
		box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
		backdrop-filter: none;
	}

	.app-shell__brand {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.app-shell__eyebrow {
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #ffffff;
		position: absolute;
		inset-inline-start: 2rem;
		inset-block-start: 1.3rem;
		background: color-mix(in srgb, black 20%, var(--surface-accent));
		padding: 0.6rem 1.1rem;
		border-radius: 999px;
		font-family: var(--font-ui, "Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif);
	}

	.app-shell__name {
		font-size: 2.1rem;
		font-weight: 700;
		letter-spacing: -0.05em;
		font-family: Georgia, "Times New Roman", serif;
	}

	.app-shell__nav {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		align-items: center;
	}

	.app-shell__actions {
		display: flex;
		align-items: center;
		margin-left: auto;
		position: absolute;
		inset-inline-end: 2rem;
		inset-block-start: 1rem;
	}

	.app-shell__nav a {
		padding: 0.55rem 0.9rem;
		border: 0;
		border-radius: 0.45rem;
		background: transparent;
		color: var(--text-primary);
		text-decoration: none;
		font-family: var(--font-ui, "Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif);
		font-size: 1rem;
		font-weight: 600;
		transition:
			transform var(--motion-fast, 180ms) ease,
			background var(--motion-fast, 180ms) ease,
			border-color var(--motion-fast, 180ms) ease;
	}

	.app-shell__nav a:hover {
		transform: translateY(-1px);
		background: color-mix(in srgb, var(--surface-accent) 8%, white);
	}

	.app-shell__main {
		display: grid;
		gap: var(--layout-stack-gap, var(--spacing-xl, 2rem));
		max-width: 86rem;
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	.app-shell section {
		padding: var(--layout-section-padding, var(--spacing-lg, 1.5rem));
		border: 1px solid var(--border-subtle);
		border-radius: 0.75rem;
		background: var(--surface-panel);
		box-shadow: var(--shadow-panel, 0 10px 30px color-mix(in srgb, var(--surface-shadow) 10%, transparent));
	}

	.app-shell h1,
	.app-shell h2 {
		font-family: var(--font-heading, "Avenir Next", "Segoe UI", sans-serif);
		letter-spacing: -0.03em;
	}

	.app-shell__footer {
		margin-top: 28px;
		padding: var(--spacing-md, 16px) 1.5rem 0;
		color: var(--text-muted);
		font-size: 0.92rem;
		max-width: 86rem;
		margin-inline: auto;
	}

	.theme-mode-switch {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.4rem;
		border: 0;
		border-radius: 999px;
		background: color-mix(in srgb, black 18%, var(--surface-accent));
		color: #f8f4f6;
		font-family: var(--font-ui, "Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif);
		box-shadow: none;
		backdrop-filter: none;
	}

	.theme-mode-switch__label {
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(255,255,255,0.88);
		padding-inline-start: 0.55rem;
	}

	.theme-mode-switch__options {
		display: inline-flex;
		gap: 0.25rem;
		padding: 0.15rem;
		border-radius: 999px;
		background: rgba(255,255,255,0.14);
	}

	.theme-mode-switch__button {
		appearance: none;
		border: 0;
		padding: 0.45rem 0.8rem;
		border-radius: 999px;
		background: transparent;
		color: rgba(255,255,255,0.82);
		font: inherit;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: -0.01em;
		cursor: pointer;
		transition:
			transform var(--motion-fast, 180ms) ease,
			background var(--motion-fast, 180ms) ease,
			color var(--motion-fast, 180ms) ease,
			box-shadow var(--motion-fast, 180ms) ease;
	}

	.theme-mode-switch__button:hover {
		transform: translateY(-1px);
		color: #ffffff;
	}

	.theme-mode-switch__button[data-active="true"],
	.theme-mode-switch__button[aria-pressed="true"] {
		background:
			linear-gradient(180deg, color-mix(in srgb, white 36%, transparent), transparent 75%),
			color-mix(in srgb, var(--surface-accent) 26%, var(--surface-panel));
		color: var(--text-primary);
		box-shadow: none;
	}

	html[data-theme-mode="dark"] .theme-mode-switch__button[data-active="true"],
	html[data-theme-mode="dark"] .theme-mode-switch__button[aria-pressed="true"] {
		background:
			linear-gradient(180deg, color-mix(in srgb, white 10%, transparent), transparent 80%),
			color-mix(in srgb, var(--surface-accent) 20%, var(--surface-panel));
	}

	html[data-theme-mode="dark"] .app-shell__header {
		border-bottom: 1px solid #333;
		background: #18181a;
		color: #f8f4f6;
		box-shadow: 0 3px 12px rgba(0, 0, 0, 0.3);
	}

	html[data-theme-mode="dark"] .app-shell__nav a {
		color: #f6f2f4;
	}

	html[data-theme-mode="dark"] .app-shell__nav a:hover {
		background: color-mix(in srgb, var(--surface-accent) 14%, #161617);
	}

	@media (max-width: 720px) {
		.app-shell {
			padding:
				0
				0
				var(--spacing-xl, 2rem);
		}

		.app-shell__header {
			padding: 0;
		}

		.app-shell__brand,
		.app-shell__nav,
		.app-shell__actions {
			inline-size: 100%;
		}

		.app-shell__actions {
			margin-left: 0;
			position: static;
		}

		.app-shell__nav {
			gap: var(--spacing-xs, 0.25rem);
		}

		.app-shell__nav a {
			flex: 1 1 10rem;
			text-align: center;
		}

		.app-shell section {
			padding: var(--spacing-md, 1rem);
		}

		.theme-mode-switch {
			inline-size: 100%;
			justify-content: space-between;
			flex-wrap: wrap;
			gap: var(--spacing-sm, 0.75rem);
		}

		.theme-mode-switch__options {
			inline-size: 100%;
			justify-content: stretch;
		}

		.theme-mode-switch__button {
			flex: 1 1 0;
			text-align: center;
		}
	}

	@media (max-width: 480px) {
		.app-shell__name {
			font-size: 1.05rem;
		}

		.app-shell__eyebrow,
		.theme-mode-switch__label {
			font-size: 0.68rem;
		}

		.app-shell__footer {
			margin-top: var(--spacing-lg, 1.5rem);
		}
	}
`;

export const dwHeaderStyles = `
	/* Reset default app-shell header for D&W layout */
	.app-shell__header {
		display: flex;
		flex-direction: column;
		gap: 0;
		padding: 0;
		margin-bottom: 0;
		border: 1px solid #d8d6d6;
		border-radius: 0;
		background: #ffffff;
		box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
		backdrop-filter: none;
	}

	/* Utility bar */
	.dw-header__utility {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem;
		width: 100vw;
		margin-left: calc(50% - 50vw);
		padding: 14px 26px;
		background: #b51b46;
		color: #fff;
	}

	.dw-header__pickup {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.8rem 1.2rem;
		border-radius: 999px;
		background: rgba(137, 17, 53, 0.45);
		color: #fff;
		font: 700 0.92rem/1.2 var(--font-ui, "Avenir Next", "Segoe UI", sans-serif);
		text-decoration: none;
		white-space: nowrap;
	}

	.dw-header__pickup:hover {
		background: rgba(137, 17, 53, 0.65);
		color: #fff;
	}

	.dw-header__search {
		display: flex;
		flex: 1 1 16rem;
		max-width: 28rem;
		margin-left: auto;
		border-radius: 999px;
		overflow: hidden;
		background: #fff;
	}

	.dw-header__search input {
		flex: 1;
		border: 0;
		padding: 0.75rem 1.2rem;
		font: 400 0.92rem/1.2 var(--font-ui, "Avenir Next", "Segoe UI", sans-serif);
		color: #333;
		outline: none;
		background: transparent;
	}

	.dw-header__search input::placeholder {
		color: #999;
	}

	.dw-header__search button {
		display: grid;
		place-items: center;
		width: 2.8rem;
		border: 0;
		background: transparent;
		color: #666;
		cursor: pointer;
	}

	.dw-header__search button:hover {
		color: #b51b46;
	}

	.dw-header__auth {
		margin-left: auto;
		font: 700 0.92rem/1.2 var(--font-ui, "Avenir Next", "Segoe UI", sans-serif);
		color: #fff;
		text-decoration: none;
		white-space: nowrap;
	}

	.dw-header__auth:hover {
		text-decoration: underline;
		color: #fff;
	}

	/* Main header row */
	.dw-header__main {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1.5rem;
		padding: 18px 26px;
	}

	.dw-header__logo {
		display: flex;
		flex-direction: column;
		text-decoration: none;
		color: #1a1a1a;
		line-height: 1;
	}

	.dw-header__logo strong {
		font-size: 2.6rem;
		font-weight: 900;
		font-family: Georgia, "Times New Roman", serif;
		letter-spacing: -0.04em;
	}

	.dw-header__logo span {
		font-size: 0.82rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: #555;
		font-family: var(--font-ui, "Avenir Next", "Segoe UI", sans-serif);
	}

	.dw-header__nav {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.25rem;
		margin-left: auto;
	}

	.dw-header__nav a {
		padding: 0.5rem 0.85rem;
		font: 600 0.95rem/1.2 var(--font-ui, "Avenir Next", "Segoe UI", sans-serif);
		color: #1a1a1a;
		text-decoration: none;
		border-radius: 0.4rem;
		transition: background 180ms ease;
	}

	.dw-header__nav a:hover {
		background: rgba(181, 27, 70, 0.08);
		color: #b51b46;
	}

	.dw-header__cart {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.6rem 1.2rem;
		border-radius: 999px;
		background: #b51b46;
		color: #fff;
		font: 700 0.92rem/1.2 var(--font-ui, "Avenir Next", "Segoe UI", sans-serif);
		text-decoration: none;
		white-space: nowrap;
		transition: background 180ms ease;
	}

	.dw-header__cart:hover {
		background: #9a1740;
		color: #fff;
	}

	.dw-header__cart-count {
		display: inline-grid;
		place-items: center;
		min-width: 1.4em;
		height: 1.4em;
		padding: 0 0.3em;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.25);
		font-size: 0.82em;
		font-weight: 700;
		line-height: 1;
	}

	/* Subnav */
	.dw-header__subnav {
		display: flex;
		flex-wrap: nowrap;
		gap: 0;
		padding: 0 26px;
		border-top: 1px solid #e8e4e6;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: thin;
		scrollbar-color: rgba(0,0,0,0.18) transparent;
	}

	.dw-header__subnav::-webkit-scrollbar {
		height: 5px;
	}

	.dw-header__subnav::-webkit-scrollbar-thumb {
		background: rgba(0,0,0,0.18);
		border-radius: 999px;
	}

	.dw-header__subnav::-webkit-scrollbar-track {
		background: transparent;
	}

	.dw-header__subnav a {
		flex: 0 0 auto;
		padding: 0.7rem 1rem;
		font: 500 0.85rem/1.2 var(--font-ui, "Avenir Next", "Segoe UI", sans-serif);
		color: #444;
		text-decoration: none;
		white-space: nowrap;
		border-bottom: 2px solid transparent;
		transition: color 180ms ease, border-color 180ms ease;
	}

	.dw-header__subnav a:hover {
		color: #b51b46;
		border-bottom-color: #b51b46;
	}

	/* Dark mode overrides */
	html[data-theme-mode="dark"] .app-shell__header {
		background: #18181a;
		border-color: #333;
		box-shadow: 0 3px 12px rgba(0, 0, 0, 0.3);
	}

	html[data-theme-mode="dark"] .dw-header__main {
		border-bottom-color: #333;
	}

	html[data-theme-mode="dark"] .dw-header__logo {
		color: #f6f2f4;
	}

	html[data-theme-mode="dark"] .dw-header__logo span {
		color: #aaa;
	}

	html[data-theme-mode="dark"] .dw-header__nav a {
		color: #f6f2f4;
	}

	html[data-theme-mode="dark"] .dw-header__nav a:hover {
		background: rgba(215, 50, 104, 0.14);
	}

	html[data-theme-mode="dark"] .dw-header__subnav {
		border-top-color: #333;
	}

	html[data-theme-mode="dark"] .dw-header__subnav a {
		color: #ccc;
	}

	html[data-theme-mode="dark"] .dw-header__search {
		background: #2a2a2e;
	}

	html[data-theme-mode="dark"] .dw-header__search input {
		color: #f6f2f4;
	}

	html[data-theme-mode="dark"] .dw-header__search button {
		color: #aaa;
	}
`;

export const createDocumentStyles = (...styles) => [
	{ id: 'app-base', cssText: documentStyles },
	{ id: 'app-shell', cssText: shellStyles },
	{ id: 'dw-header', cssText: dwHeaderStyles },
	...styles.map((cssText, index) => ({
		id: `app-extra-${index + 1}`,
		cssText,
	})),
];

export const createAppThemeFeatures = (theme, { allowAuto = false } = {}) => [
	createDomainThemeFeature({
		resolveTheme() {
			return theme;
		},
	}),
	createThemeModeFeature({
		allowedModes: ['light', 'dark'],
		allowAuto,
		defaultPreference: allowAuto ? 'auto' : 'light',
		fallbackMode: 'light',
		themeColors: {
			light: theme?.themeColor,
			dark: theme?.modes?.dark?.themeColor,
		},
	}),
];
