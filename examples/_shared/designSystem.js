import { createDomainThemeFeature, createThemeModeFeature, defineThemes } from 'react-islands-runtime/ssr';

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

	.demo-shell__actions {
		display: flex;
		align-items: center;
		margin-left: auto;
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

	.demo-theme-switch {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 8px 10px 8px 14px;
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-pill, 999px);
		background: color-mix(in srgb, var(--surface-panel) 78%, white);
		box-shadow:
			0 10px 24px color-mix(in srgb, var(--surface-shadow) 10%, transparent),
			inset 0 1px 0 color-mix(in srgb, white 54%, transparent);
		backdrop-filter: blur(14px) saturate(1.06);
	}

	.demo-theme-switch__label {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.demo-theme-switch__options {
		display: inline-flex;
		gap: 6px;
		padding: 4px;
		border-radius: var(--radius-pill, 999px);
		background: color-mix(in srgb, var(--surface-canvas) 62%, white);
	}

	.demo-theme-switch__button {
		appearance: none;
		border: 0;
		padding: 9px 13px;
		border-radius: var(--radius-pill, 999px);
		background: transparent;
		color: var(--text-muted);
		font: inherit;
		font-size: 0.86rem;
		font-weight: 700;
		letter-spacing: -0.01em;
		cursor: pointer;
		transition:
			transform 180ms ease,
			background 180ms ease,
			color 180ms ease,
			box-shadow 180ms ease;
	}

	.demo-theme-switch__button:hover {
		transform: translateY(-1px);
		color: var(--text-primary);
	}

	.demo-theme-switch__button[data-active="true"],
	.demo-theme-switch__button[aria-pressed="true"] {
		background:
			linear-gradient(180deg, color-mix(in srgb, white 36%, transparent), transparent 75%),
			color-mix(in srgb, var(--surface-accent) 26%, var(--surface-panel));
		color: var(--text-primary);
		box-shadow:
			0 8px 16px color-mix(in srgb, var(--surface-shadow) 12%, transparent),
			inset 0 1px 0 color-mix(in srgb, white 58%, transparent);
	}

	html[data-theme-mode="dark"] .demo-theme-switch__button[data-active="true"],
	html[data-theme-mode="dark"] .demo-theme-switch__button[aria-pressed="true"] {
		background:
			linear-gradient(180deg, color-mix(in srgb, white 10%, transparent), transparent 80%),
			color-mix(in srgb, var(--surface-accent) 20%, var(--surface-panel));
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

	.demo-carousel {
		display: grid;
		gap: 16px;
		container-type: inline-size;
	}

	.demo-carousel__header {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		align-items: center;
		justify-content: space-between;
	}

	.demo-carousel__title {
		margin: 0;
		font-size: 1.3rem;
	}

	.demo-carousel__controls,
	.demo-carousel__dots {
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}

	.demo-carousel__control,
	.demo-carousel__dot {
		appearance: none;
		border: 0;
		cursor: pointer;
	}

	.demo-carousel__control {
		inline-size: 2.75rem;
		block-size: 2.75rem;
		display: inline-grid;
		place-items: center;
		border-radius: var(--radius-pill, 999px);
		background: color-mix(in srgb, var(--surface-panel) 76%, white);
		border: 1px solid var(--border-subtle);
		color: var(--text-primary);
		font: inherit;
		font-size: 1.3rem;
		font-weight: 700;
		line-height: 1;
		box-shadow:
			0 12px 26px color-mix(in srgb, var(--surface-shadow) 12%, transparent),
			inset 0 1px 0 color-mix(in srgb, white 58%, transparent);
		transition: transform 180ms ease, background 180ms ease, box-shadow 180ms ease;
	}

	.demo-carousel__control:hover {
		transform: translateY(-1px);
	}

	.demo-carousel__viewport {
		position: relative;
		overflow: clip;
		padding: 0;
	}

	.demo-carousel__layout {
		display: grid;
		gap: 18px;
	}

	.demo-carousel__layout--pinned {
		grid-template-columns: minmax(280px, 0.82fr) minmax(0, 1.18fr);
	}

	.demo-carousel__pinned {
		position: sticky;
		inset-block-start: 0;
		align-self: start;
	}

	.demo-carousel__scroller {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: minmax(min(84cqi, 22rem), 1fr);
		gap: 18px;
		padding: 0;
		overflow-x: auto;
		overflow-y: clip;
		overscroll-behavior-inline: contain;
		scroll-snap-type: inline mandatory;
		scroll-padding-inline: 0;
		scroll-behavior: smooth;
		scrollbar-width: none;
		scrollbar-gutter: stable;
		align-items: start;
	}

	.demo-carousel__scroller::-webkit-scrollbar {
		display: none;
	}

	.demo-carousel__scroller--spotlight {
		grid-auto-columns: 100%;
	}

	.demo-carousel__scroller--rail {
		grid-auto-columns: minmax(260px, 0.8fr);
		align-items: stretch;
	}

	.demo-carousel__slide {
		position: relative;
		overflow: clip;
		display: grid;
		gap: 16px;
		padding: 16px;
		border-radius: var(--radius-card, 24px);
		border: 1px solid var(--border-subtle);
		background:
			linear-gradient(180deg, color-mix(in srgb, white 20%, transparent), transparent 38%),
			color-mix(in srgb, var(--surface-panel) 78%, white);
		box-shadow:
			0 18px 36px color-mix(in srgb, var(--surface-shadow) 12%, transparent),
			inset 0 1px 0 color-mix(in srgb, white 54%, transparent);
		min-height: 100%;
		scroll-snap-align: start;
		scroll-snap-stop: always;
	}

	.demo-carousel__slide--pinned {
		min-block-size: 100%;
	}

	.demo-carousel__media {
		overflow: clip;
		border-radius: calc(var(--radius-card, 24px) - 8px);
		aspect-ratio: 16 / 10;
		isolation: isolate;
	}

	.demo-carousel__media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.demo-carousel__copy {
		display: grid;
		gap: 8px;
	}

	.demo-carousel__eyebrow {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.demo-carousel__slide-title {
		margin: 0;
		font-size: 1.12rem;
	}

	.demo-carousel__slide-body {
		margin: 0;
		color: var(--text-muted);
		line-height: 1.6;
	}

	.demo-carousel__dot {
		width: 11px;
		height: 11px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--border-subtle) 90%, transparent);
		border: 1px solid color-mix(in srgb, var(--surface-panel) 65%, white);
		transition: transform 180ms ease, background 180ms ease, box-shadow 180ms ease;
	}

	.demo-carousel__dot[data-active="true"] {
		transform: scale(1.18);
		background: var(--surface-accent);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--surface-accent) 18%, transparent);
	}

	.demo-carousel--peek-strip .demo-carousel__scroller {
		grid-auto-columns: minmax(280px, 1fr);
	}

	.demo-carousel--editorial-stack .demo-carousel__slide {
		grid-template-columns: minmax(220px, 0.95fr) minmax(0, 1.05fr);
		align-items: center;
	}

	.demo-carousel--floating-cards .demo-carousel__scroller {
		grid-auto-columns: minmax(260px, 1fr);
		align-items: stretch;
	}

	.demo-carousel--floating-cards .demo-carousel__slide:nth-child(2n) {
		transform: translateY(10px);
	}

	.demo-carousel--spotlight-dots .demo-carousel__slide {
		grid-template-columns: minmax(220px, 0.9fr) minmax(0, 1.1fr);
		align-items: center;
		min-height: 320px;
	}

	.demo-carousel--spotlight-dots .demo-carousel__dots {
		justify-content: center;
	}

	.demo-carousel__accent {
		position: absolute;
		inset-inline-end: 18px;
		inset-block-start: 18px;
		z-index: 2;
		width: 56px;
		height: 56px;
		padding: 6px;
		border-radius: 20px;
		background: color-mix(in oklab, var(--surface-panel) 70%, white);
		box-shadow:
			0 14px 28px color-mix(in oklab, var(--surface-shadow) 18%, transparent),
			inset 0 1px 0 color-mix(in oklab, white 54%, transparent);
		backdrop-filter: blur(14px) saturate(1.12);
	}

	.demo-carousel__accent img {
		width: 100%;
		height: 100%;
		display: block;
	}

	.test-data-carousel-card {
		padding: 6px;
	}

	[data-demo-theme="test-data"] .test-data-carousel-card {
		padding: 6px;
	}

	[data-demo-theme="test-data"] .demo-carousel__slide,
	[data-demo-theme="test-data"] .demo-carousel__control {
		background:
			linear-gradient(180deg, color-mix(in oklab, white 20%, transparent), transparent 38%),
			color-mix(in oklab, var(--surface-panel) 74%, white);
		border-color: color-mix(in oklab, var(--border-subtle) 78%, white);
		box-shadow:
			0 18px 38px color-mix(in oklab, var(--surface-shadow) 14%, transparent),
			inset 0 1px 0 color-mix(in oklab, white 54%, transparent);
	}

	[data-demo-theme="test-data"] .demo-carousel__dot {
		background: color-mix(in oklab, var(--border-subtle) 82%, transparent);
		border-color: color-mix(in oklab, white 42%, transparent);
	}

	html[data-demo-theme="test-data"][data-theme-mode="dark"] .demo-carousel__slide,
	html[data-demo-theme="test-data"][data-theme-mode="dark"] .demo-carousel__control,
	html[data-demo-theme="test-data"][data-theme-mode="dark"] .demo-carousel__accent {
		box-shadow:
			0 18px 40px color-mix(in oklab, black 28%, transparent),
			inset 0 1px 0 color-mix(in oklab, white 10%, transparent);
	}

	[data-demo-theme="test-data"] .demo-carousel__layout--pinned {
		grid-template-columns: minmax(280px, 0.92fr) minmax(0, 1.08fr);
		gap: 16px;
	}

	[data-demo-theme="test-data"] .demo-carousel__scroller--rail {
		grid-auto-columns: minmax(300px, 0.86fr);
	}

	[data-demo-theme="test-data"] .demo-carousel__slide--pinned {
		background:
			linear-gradient(160deg, color-mix(in oklab, white 24%, transparent), transparent 52%),
			color-mix(in oklab, var(--surface-panel) 76%, white);
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

	html[data-demo-theme="test-data"][data-theme-mode="dark"] .test-data-hero {
		background:
			linear-gradient(145deg, oklab(0.34 -0.03 -0.05), oklab(0.46 -0.032 0.005) 48%, oklab(0.56 -0.01 0.02)),
			color-mix(in oklab, var(--surface-panel) 88%, black);
		border-color: color-mix(in oklab, var(--border-subtle) 62%, transparent);
		box-shadow:
			0 28px 70px color-mix(in oklab, black 40%, transparent),
			inset 0 1px 0 color-mix(in oklab, white 12%, transparent),
			inset 0 -28px 48px color-mix(in oklab, var(--surface-accent) 10%, transparent);
	}

	html[data-demo-theme="test-data"][data-theme-mode="dark"] .test-data-hero::before {
		background:
			radial-gradient(circle at 18% 18%, oklab(0.72 -0.02 -0.04 / 0.22), transparent 30%),
			radial-gradient(circle at 80% 12%, oklab(0.7 -0.012 0.06 / 0.16), transparent 26%),
			linear-gradient(180deg, color-mix(in oklab, white 8%, transparent), transparent 36%);
	}

	html[data-demo-theme="test-data"][data-theme-mode="dark"] .test-data-product-card,
	html[data-demo-theme="test-data"][data-theme-mode="dark"] .demo-shell section,
	html[data-demo-theme="test-data"][data-theme-mode="dark"] .demo-theme-switch {
		box-shadow:
			0 18px 36px color-mix(in oklab, black 28%, transparent),
			inset 0 1px 0 color-mix(in oklab, white 10%, transparent);
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

		.demo-shell__actions {
			width: 100%;
			justify-content: flex-start;
			margin-left: 0;
		}

		.demo-theme-switch {
			width: 100%;
			justify-content: space-between;
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

		.demo-carousel__layout--pinned,
		.demo-carousel--editorial-stack .demo-carousel__slide,
		.demo-carousel--spotlight-dots .demo-carousel__slide {
			grid-template-columns: 1fr;
		}

		.demo-carousel__scroller,
		.demo-carousel__scroller--rail,
		.demo-carousel--peek-strip .demo-carousel__scroller,
		.demo-carousel--floating-cards .demo-carousel__scroller {
			grid-auto-columns: minmax(84cqi, 1fr);
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

export const createDemoThemeModeFeature = (name) => {
	const key = mapDemoNameToThemeKey(name);
	const theme = themes[key];
	const allowAuto = key === 'test-data';
	const themeColors = {
		light: theme?.themeColor,
		dark: theme?.modes?.dark?.themeColor,
	};

	return createThemeModeFeature({
		allowedModes: ['light', 'dark'],
		allowAuto,
		defaultPreference: allowAuto ? 'auto' : 'light',
		fallbackMode: 'light',
		themeColors,
	});
};
