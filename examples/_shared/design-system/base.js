import { createDomainThemeFeature, createThemeModeFeature } from 'react-islands-runtime/ssr';

export const sharedDocumentStyles = `
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

export const sharedShellStyles = `
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

	.demo-feature {
		display: grid;
		grid-template-columns: minmax(0, 0.92fr) minmax(18rem, 1.08fr);
		gap: 22px;
		align-items: center;
		overflow: clip;
	}

	.demo-feature--reverse {
		grid-template-columns: minmax(18rem, 1.08fr) minmax(0, 0.92fr);
	}

	.demo-feature--reverse .demo-feature__content {
		order: 2;
	}

	.demo-feature--reverse .demo-feature__visual {
		order: 1;
	}

	.demo-feature__content,
	.demo-feature__lead-copy,
	.demo-feature__support-copy {
		display: grid;
		gap: 10px;
	}

	.demo-feature__eyebrow,
	.demo-feature__product-kicker {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.demo-feature__title {
		margin: 0;
		font-size: clamp(1.55rem, 3vw, 2.25rem);
	}

	.demo-feature__body,
	.demo-feature__support-body {
		margin: 0;
		line-height: 1.65;
		color: var(--text-muted);
	}

	.demo-feature__chips {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 4px;
	}

	.demo-feature__chip {
		padding: 9px 13px;
		border-radius: var(--radius-pill, 999px);
		background: color-mix(in srgb, var(--surface-accent) 16%, var(--surface-panel));
		border: 1px solid color-mix(in srgb, var(--border-subtle) 74%, white);
		font-size: 0.88rem;
	}

	.demo-feature__visual {
		display: grid;
		grid-template-columns: minmax(0, 1.12fr) minmax(12rem, 0.88fr);
		gap: 16px;
		align-items: stretch;
		min-width: 0;
		padding: 4px;
	}

	.demo-feature__lead-card,
	.demo-feature__support-card {
		display: grid;
		gap: 14px;
		padding: 14px;
		border-radius: calc(var(--radius-card, 22px) - 2px);
		border: 1px solid color-mix(in srgb, var(--border-subtle) 86%, white);
		background:
			linear-gradient(180deg, color-mix(in srgb, white 18%, transparent), transparent 42%),
			color-mix(in srgb, var(--surface-panel) 84%, white);
		box-shadow:
			0 18px 36px color-mix(in srgb, var(--surface-shadow) 14%, transparent),
			inset 0 1px 0 color-mix(in srgb, white 56%, transparent);
		min-width: 0;
	}

	.demo-feature__lead-media,
	.demo-feature__support-media {
		width: 100%;
		border-radius: calc(var(--radius-card, 22px) - 8px);
		overflow: clip;
		display: block;
	}

	.demo-feature__lead-media {
		aspect-ratio: 4 / 5;
	}

	.demo-feature__support-media {
		aspect-ratio: 16 / 11;
		object-fit: cover;
	}

	.demo-feature__lead-media img {
		width: 100%;
		height: 100%;
		display: block;
		object-fit: cover;
	}

	.demo-feature__supporting {
		display: grid;
		gap: 14px;
		align-content: center;
		min-width: 0;
	}

	.demo-feature__product-name {
		font-family: "Avenir Next", "Segoe UI", sans-serif;
		font-size: 1.05rem;
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.demo-feature__product-price {
		color: color-mix(in srgb, var(--text-primary) 82%, white);
		font-size: 0.94rem;
	}

	.demo-feature__thumbs {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 8px;
		margin-top: 6px;
		min-width: 0;
	}

	.demo-feature__thumb {
		width: 100%;
		aspect-ratio: 1;
		display: block;
		object-fit: cover;
		border-radius: 12px;
		border: 1px solid color-mix(in srgb, var(--border-subtle) 76%, white);
		background: color-mix(in srgb, var(--surface-panel) 86%, white);
		box-shadow: inset 0 1px 0 color-mix(in srgb, white 54%, transparent);
	}

	.grid-items {
		display: grid;
		gap: 18px;
	}

	.grid-items__header {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
	}

	.grid-items__title {
		margin: 0;
		font-size: clamp(1.25rem, 2vw, 1.7rem);
	}

	.grid-items__link {
		text-decoration: none;
		font-size: 0.92rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.grid-items__layout {
		display: grid;
		grid-template-columns: repeat(12, minmax(0, 1fr));
		gap: 16px;
	}

	.grid-items__card {
		position: relative;
		display: grid;
		gap: 12px;
		min-width: 0;
		padding: 14px;
		border-radius: calc(var(--radius-card, 22px) - 2px);
		border: 1px solid var(--border-subtle);
		background:
			linear-gradient(180deg, color-mix(in srgb, white 18%, transparent), transparent 45%),
			color-mix(in srgb, var(--surface-panel) 82%, white);
		color: var(--text-primary);
		text-decoration: none;
		box-shadow:
			0 14px 28px color-mix(in srgb, var(--surface-shadow) 10%, transparent),
			inset 0 1px 0 color-mix(in srgb, white 54%, transparent);
	}

	.grid-items[data-grid-items-layout="even"] .grid-items__card {
		grid-column: span 3;
	}

	.grid-items__card--feature {
		grid-column: span 6;
		grid-row: span 2;
		min-height: 28rem;
	}

	.grid-items__card--supporting {
		grid-column: span 3;
	}

	.grid-items__media {
		overflow: clip;
		border-radius: calc(var(--radius-card, 22px) - 8px);
		background: color-mix(in srgb, var(--surface-muted) 72%, white);
	}

	.grid-items__media img {
		width: 100%;
		height: 100%;
		display: block;
		object-fit: cover;
	}

	.grid-items__content {
		display: grid;
		gap: 8px;
		min-width: 0;
		align-content: start;
	}

	.grid-items__eyebrow {
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.grid-items__price {
		justify-self: start;
		padding: 0.35rem 0.7rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--surface-accent) 14%, var(--surface-panel));
		border: 1px solid color-mix(in srgb, var(--border-subtle) 78%, white);
		font-size: 0.84rem;
		font-weight: 800;
		line-height: 1;
	}

	.grid-items__item-title {
		margin: 0;
		font-size: 1.05rem;
		line-height: 1.08;
		letter-spacing: -0.025em;
		word-break: break-word;
	}

	.grid-items__meta {
		display: grid;
		gap: 4px;
	}

	.grid-items__meta-line {
		font-size: 0.9rem;
		line-height: 1.4;
		color: var(--text-muted);
	}

	.plp-products {
		display: grid;
		gap: 18px;
	}

	.plp-products__header {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
	}

	.plp-products__title {
		margin: 0;
		font-size: clamp(1.25rem, 2vw, 1.7rem);
	}

	.plp-products__link {
		text-decoration: none;
		font-size: 0.92rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.plp-products__layout {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
		gap: 14px;
		align-items: stretch;
	}

	.plp-products__card {
		display: flex;
		align-items: stretch;
		gap: 10px;
		min-height: 168px;
		min-width: 0;
		padding: 12px;
		border-radius: calc(var(--radius-card, 22px) - 4px);
		border: 1px solid var(--border-subtle);
		background:
			linear-gradient(180deg, color-mix(in srgb, white 18%, transparent), transparent 45%),
			color-mix(in srgb, var(--surface-panel) 82%, white);
		color: var(--text-primary);
		text-decoration: none;
		box-shadow:
			0 12px 24px color-mix(in srgb, var(--surface-shadow) 8%, transparent),
			inset 0 1px 0 color-mix(in srgb, white 54%, transparent);
	}

	.plp-products__media {
		flex: 0 0 68px;
		inline-size: 68px;
		block-size: 156px;
		overflow: clip;
		border-radius: 14px;
		background: color-mix(in srgb, var(--surface-muted) 72%, white);
	}

	.plp-products__media img {
		width: 100%;
		height: 100%;
		display: block;
		object-fit: cover;
	}

	.plp-products__content {
		flex: 1 1 auto;
		display: grid;
		gap: 5px;
		min-width: 0;
		align-content: center;
	}

	.plp-products__eyebrow {
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.plp-products__price {
		justify-self: start;
		padding: 0.3rem 0.58rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--surface-accent) 14%, var(--surface-panel));
		border: 1px solid color-mix(in srgb, var(--border-subtle) 78%, white);
		font-size: 0.78rem;
		font-weight: 800;
		line-height: 1;
	}

	.plp-products__item-title {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.08;
		letter-spacing: -0.02em;
		word-break: break-word;
	}

	.plp-products__description {
		font-size: 0.8rem;
		line-height: 1.35;
		color: var(--text-muted);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.product-detail {
		display: grid;
	}

	.product-detail__layout {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(22rem, 1fr));
		gap: 24px;
		align-items: start;
	}

	.product-detail__media-column {
		display: grid;
	}

	.product-detail__media-frame {
		display: grid;
		place-items: center;
		min-height: 28rem;
		border-radius: calc(var(--radius-card, 22px) + 2px);
		border: 1px solid color-mix(in srgb, var(--border-subtle) 84%, white);
		background:
			linear-gradient(180deg, color-mix(in srgb, white 18%, transparent), transparent 50%),
			color-mix(in srgb, var(--surface-panel) 86%, white);
		box-shadow:
			0 18px 36px color-mix(in srgb, var(--surface-shadow) 10%, transparent),
			inset 0 1px 0 color-mix(in srgb, white 58%, transparent);
		overflow: clip;
	}

	.product-detail__image {
		width: 100%;
		height: 100%;
		display: block;
		object-fit: cover;
	}

	.product-detail__empty {
		display: grid;
		place-items: center;
		width: 100%;
		height: 100%;
		padding: 24px;
		color: color-mix(in srgb, var(--text-muted) 76%, white);
		font-size: clamp(1.4rem, 2.2vw, 2.2rem);
	}

	.product-detail__content {
		display: grid;
		align-content: start;
		gap: 16px;
		padding-top: 8px;
	}

	.product-detail__title {
		margin: 0;
		font-size: clamp(2.25rem, 4.4vw, 4.1rem);
		line-height: 0.96;
		letter-spacing: -0.05em;
		font-family: "Avenir Next", "Segoe UI", sans-serif;
	}

	.product-detail__sku {
		font-size: 1rem;
		line-height: 1.4;
		color: var(--text-muted);
	}

	.product-detail__subtitle,
	.product-detail__description {
		margin: 0;
		font-size: 1rem;
		line-height: 1.65;
		color: color-mix(in srgb, var(--text-primary) 82%, white);
	}

	.product-detail__price {
		font-size: clamp(1.85rem, 3vw, 2.7rem);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.04em;
		font-family: "Avenir Next", "Segoe UI", sans-serif;
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

	.demo-carousel__control:disabled {
		cursor: default;
		opacity: 0.46;
		transform: none;
		box-shadow:
			0 8px 18px color-mix(in srgb, var(--surface-shadow) 8%, transparent),
			inset 0 1px 0 color-mix(in srgb, white 50%, transparent);
	}

	.demo-carousel__viewport {
		position: relative;
		overflow: hidden;
		padding: 6px 18px 24px;
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
		grid-auto-columns: clamp(18rem, 84cqi, 22rem);
		grid-auto-rows: max-content;
		gap: 18px;
		padding: 0;
		overflow-x: auto;
		overflow-y: hidden;
		overscroll-behavior-inline: contain;
		scroll-snap-type: inline mandatory;
		scroll-padding-inline: 0;
		scroll-behavior: smooth;
		scrollbar-width: thin;
		scrollbar-color: color-mix(in oklab, var(--surface-accent) 74%, white) color-mix(
			in oklab,
			var(--surface-muted) 84%,
			transparent
		);
		scrollbar-gutter: stable;
		align-items: start;
		cursor: grab;
		touch-action: pan-x;
		user-select: none;
	}

	.demo-carousel__scroller.is-dragging {
		cursor: grabbing;
	}

	.demo-carousel__scroller::-webkit-scrollbar {
		height: 14px;
	}

	.demo-carousel__scroller::-webkit-scrollbar-track {
		border-radius: 999px;
		background:
			linear-gradient(180deg, color-mix(in oklab, white 42%, transparent), transparent),
			color-mix(in oklab, var(--surface-muted) 78%, transparent);
		box-shadow:
			inset 0 1px 0 color-mix(in oklab, white 58%, transparent),
			inset 0 0 0 1px color-mix(in oklab, var(--border-subtle) 72%, transparent);
	}

	.demo-carousel__scroller::-webkit-scrollbar-thumb {
		border: 3px solid transparent;
		border-radius: 999px;
		background:
			linear-gradient(135deg, color-mix(in oklab, white 28%, transparent), transparent 52%) padding-box,
			linear-gradient(
					90deg,
					color-mix(in oklab, var(--surface-accent) 82%, white),
					color-mix(in oklab, var(--surface-accent) 48%, var(--text-primary))
				)
				border-box;
		box-shadow:
			0 8px 16px color-mix(in oklab, var(--surface-shadow) 18%, transparent),
			inset 0 1px 0 color-mix(in oklab, white 48%, transparent);
	}

	.demo-carousel__scroller::-webkit-scrollbar-thumb:hover {
		background:
			linear-gradient(135deg, color-mix(in oklab, white 34%, transparent), transparent 52%) padding-box,
			linear-gradient(
					90deg,
					color-mix(in oklab, var(--surface-accent) 88%, white),
					color-mix(in oklab, var(--surface-accent) 56%, var(--text-primary))
				)
				border-box;
	}

	.demo-carousel__scroller--spotlight {
		grid-auto-columns: 100%;
	}

	.demo-carousel__scroller--rail {
		grid-auto-columns: clamp(16rem, 72cqi, 20rem);
		align-items: start;
	}

	.demo-carousel__scroller--rail .demo-carousel__slide {
		min-height: auto;
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
		min-height: 0;
		align-self: start;
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
		-webkit-user-drag: none;
		user-select: none;
		pointer-events: none;
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
		grid-auto-columns: clamp(17rem, 29vw, 20rem);
	}

	.demo-carousel--peek-strip .demo-carousel__slide {
		gap: 12px;
		padding: 12px;
	}

	.demo-carousel--peek-strip .demo-carousel__media {
		aspect-ratio: 16 / 8.5;
	}

	.demo-carousel--peek-strip .demo-carousel__copy {
		gap: 6px;
	}

	.demo-carousel--peek-strip .demo-carousel__slide-body {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.demo-carousel--editorial-stack .demo-carousel__slide {
		grid-template-columns: minmax(220px, 0.95fr) minmax(0, 1.05fr);
		align-items: center;
	}

	.demo-carousel--floating-cards .demo-carousel__scroller {
		grid-auto-columns: clamp(15.5rem, 28vw, 19rem);
		align-items: stretch;
	}

	.demo-carousel--floating-cards .demo-carousel__slide:nth-child(2n) {
		transform: translateY(6px);
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

	@media (min-width: 960px) {
		.demo-carousel--peek-strip .demo-carousel__scroller {
			grid-auto-columns: calc((100% - 36px) / 3);
		}

		.demo-carousel--floating-cards .demo-carousel__scroller {
			grid-auto-columns: calc((100% - 36px) / 3);
		}

		.demo-carousel--editorial-stack .demo-carousel__scroller {
			grid-auto-columns: 100%;
		}
	}

	@media (max-width: 720px) {
		.demo-feature,
		.demo-feature--reverse,
		.demo-feature__visual {
			grid-template-columns: 1fr;
		}

		.demo-feature__thumbs {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.demo-feature--reverse .demo-feature__content,
		.demo-feature--reverse .demo-feature__visual {
			order: initial;
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

export const createSharedStyles = (...styles) => [
	{ id: 'demo-base', cssText: sharedDocumentStyles },
	{ id: 'demo-shell', cssText: sharedShellStyles },
	...styles.map((cssText, index) => ({
		id: `demo-extra-${index + 1}`,
		cssText,
	})),
];

export const createAppThemeFeature = (theme) =>
	createDomainThemeFeature({
		resolveTheme() {
			return theme;
		},
	});

export const createAppThemeModeFeature = (theme, { allowAuto = false } = {}) =>
	createThemeModeFeature({
		allowedModes: ['light', 'dark'],
		allowAuto,
		defaultPreference: allowAuto ? 'auto' : 'light',
		fallbackMode: 'light',
		themeColors: {
			light: theme?.themeColor,
			dark: theme?.modes?.dark?.themeColor,
		},
	});
