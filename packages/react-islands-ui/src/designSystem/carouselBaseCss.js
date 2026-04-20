export const carouselBaseCss = `
	.carousel {
		--carousel-gap: 16px;
		--carousel-header-gap: 12px;
		--carousel-title-size: 1.3rem;
		--carousel-control-size: 2.75rem;
		--carousel-control-font-size: 1.3rem;
		--carousel-viewport-padding-block-start: 6px;
		--carousel-viewport-padding-inline: 18px;
		--carousel-viewport-padding-block-end: 24px;
		--carousel-layout-gap: 18px;
		--carousel-scroller-column-width: clamp(18rem, 84cqi, 22rem);
		--carousel-scroller-gap: 18px;
		--carousel-slide-gap: 16px;
		--carousel-slide-padding: 16px;
		--carousel-slide-radius: var(--radius-card, 24px);
		--carousel-slide-background:
			linear-gradient(180deg, color-mix(in srgb, white 20%, transparent), transparent 38%),
			color-mix(in srgb, var(--surface-panel, #f8f3ea) 78%, white);
		--carousel-slide-shadow:
			0 18px 36px color-mix(in srgb, var(--surface-shadow, #1f1408) 12%, transparent),
			inset 0 1px 0 color-mix(in srgb, white 54%, transparent);
		--carousel-media-radius: calc(var(--carousel-slide-radius) - 8px);
		--carousel-copy-gap: 8px;
		--carousel-eyebrow-size: 0.72rem;
		--carousel-eyebrow-tracking: 0.14em;
		--carousel-slide-title-size: 1.12rem;
		--carousel-slide-body-line-height: 1.6;
		--carousel-scrollbar-size: 12px;
		--carousel-scrollbar-padding-bottom: 4px;
		--carousel-dot-bg: color-mix(in srgb, var(--border-subtle, #d9cfc0) 90%, transparent);
		--carousel-dot-border: color-mix(in srgb, var(--surface-panel, #f8f3ea) 65%, white);
		--carousel-dot-active-ring: color-mix(in srgb, var(--surface-accent, #d8b165) 18%, transparent);
		--carousel-card-padding: var(--carousel-slide-padding);
		--carousel-card-border: var(--border-subtle, #d9cfc0);
		--carousel-card-bg: var(--carousel-slide-background);
		--carousel-card-shadow: color-mix(in srgb, var(--surface-shadow, #1f1408) 12%, transparent);
		--carousel-control-shadow: color-mix(in srgb, var(--surface-shadow, #1f1408) 12%, transparent);
		--carousel-accent-padding: 6px;
		--carousel-accent-bg: color-mix(in srgb, var(--surface-panel, #f8f3ea) 70%, white);
		--carousel-accent-shadow: color-mix(in srgb, var(--surface-shadow, #1f1408) 18%, transparent);
		--carousel-focus-ring: color-mix(in srgb, var(--surface-accent, #d8b165) 18%, transparent);
		--carousel-scrollbar-track: color-mix(in srgb, var(--surface-muted, #ece1d2) 78%, transparent);
		--carousel-scrollbar-thumb: color-mix(in srgb, var(--surface-accent, #d8b165) 74%, white);
		--carousel-scrollbar-thumb-hover: color-mix(in srgb, var(--surface-accent, #d8b165) 84%, white);
		--carousel-marquee-viewport-top: 20px;
		--carousel-marquee-viewport-inline: 20px;
		--carousel-viewport-bottom-padding: 28px;
		--carousel-viewport-bg: color-mix(in srgb, var(--surface-panel, #f8f3ea) 88%, white);
		--carousel-viewport-border: color-mix(in srgb, var(--border-subtle, #d9cfc0) 72%, white);
		display: grid;
		gap: var(--carousel-gap);
		container-type: inline-size;
	}

	.carousel__header {
		display: flex;
		flex-wrap: wrap;
		gap: var(--carousel-header-gap);
		align-items: center;
		justify-content: space-between;
	}

	.carousel__title {
		margin: 0;
		font-size: var(--carousel-title-size);
		font-family: var(--carousel-title-font, var(--font-heading, inherit));
	}

	.carousel__controls,
	.carousel__dots {
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}

	.carousel__controls--outer-sides {
		position: absolute;
		inset-inline: 0;
		inset-block-start: 50%;
		transform: translateY(-50%);
		justify-content: space-between;
		padding-inline: 4px;
		pointer-events: none;
		z-index: 3;
	}

	.carousel__controls--outer-sides .carousel__control {
		pointer-events: auto;
	}

	.carousel__control,
	.carousel__dot {
		appearance: none;
		border: 0;
		cursor: pointer;
	}

	.carousel__control {
		inline-size: var(--carousel-control-size);
		block-size: var(--carousel-control-size);
		display: inline-grid;
		place-items: center;
		border-radius: var(--radius-pill, 999px);
		background: color-mix(in srgb, var(--surface-panel, #f8f3ea) 76%, white);
		border: 1px solid var(--border-subtle, #d9cfc0);
		color: var(--text-primary, #23160b);
		font: inherit;
		font-size: var(--carousel-control-font-size);
		font-weight: 700;
		line-height: 1;
		box-shadow:
			0 12px 26px color-mix(in srgb, var(--surface-shadow, #1f1408) 12%, transparent),
			inset 0 1px 0 color-mix(in srgb, white 58%, transparent);
		transition: transform 180ms ease, background 180ms ease, box-shadow 180ms ease;
	}

	.carousel__control:hover {
		transform: translateY(-1px);
	}

	.carousel__control:disabled {
		cursor: default;
		opacity: 0.46;
		transform: none;
		box-shadow:
			0 8px 18px color-mix(in srgb, var(--surface-shadow, #1f1408) 8%, transparent),
			inset 0 1px 0 color-mix(in srgb, white 50%, transparent);
	}

	.carousel__viewport {
		position: relative;
		overflow: hidden;
		padding:
			var(--carousel-viewport-padding-block-start)
			var(--carousel-viewport-padding-inline)
			var(--carousel-viewport-padding-block-end);
	}

	/* Sticky panes require a visible overflow chain to engage correctly. */
	.carousel[data-carousel-has-pinned="true"] .carousel__viewport {
		overflow: visible;
	}

	.carousel__layout {
		display: grid;
		gap: var(--carousel-layout-gap);
		min-block-size: var(--carousel-min-height, auto);
		max-block-size: var(--carousel-max-height, none);
	}

	.carousel__layout--pinned {
		grid-template-columns:
			minmax(280px, var(--carousel-sticky-pane-width, 1fr))
			minmax(0, var(--carousel-scroll-pane-width, 0.92fr));
	}

	.carousel__pinned {
		position: sticky;
		inset-block-start: 0;
		align-self: start;
	}

	.carousel__pinned-stack {
		display: grid;
		gap: 18px;
	}

	.carousel__scroller {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: var(--carousel-scroller-column-width);
		grid-auto-rows: max-content;
		gap: var(--carousel-scroller-gap);
		padding: 0 0 var(--carousel-scrollbar-padding-bottom);
		overflow-x: auto;
		overflow-y: visible;
		-webkit-overflow-scrolling: touch;
		touch-action: pan-x pinch-zoom;
		overscroll-behavior-x: contain;
		overscroll-behavior-inline: contain;
		scroll-snap-type: inline mandatory;
		scroll-padding-inline: 0;
		scroll-behavior: smooth;
		scrollbar-gutter: stable both-edges;
		align-items: start;
		cursor: grab;
		user-select: none;
	}

	@supports (scrollbar-width: thin) {
		.carousel__scroller {
			scrollbar-width: thin;
			scrollbar-color: var(--carousel-scrollbar-thumb) var(--carousel-scrollbar-track);
		}
	}

	.carousel__scroller.is-dragging {
		cursor: grabbing;
	}

	.carousel__scroller::-webkit-scrollbar {
		max-inline-size: var(--carousel-scrollbar-size);
		max-block-size: var(--carousel-scrollbar-size);
	}

	.carousel__scroller::-webkit-scrollbar-track {
		background: var(--carousel-scrollbar-track);
		border-radius: 999px;
	}

	.carousel__scroller::-webkit-scrollbar-thumb {
		background: var(--carousel-scrollbar-thumb);
		border: 2px solid transparent;
		border-radius: 999px;
		background-clip: padding-box;
	}

	.carousel__scroller::-webkit-scrollbar-thumb:hover {
		background: var(--carousel-scrollbar-thumb-hover);
	}

	.carousel__scroller--spotlight {
		grid-auto-columns: 100%;
		scrollbar-gutter: auto;
	}

	.carousel__scroller--rail {
		grid-auto-columns: calc(
			(100% - (var(--carousel-visible-slides, 1) - 1) * var(--carousel-gap)) / var(--carousel-visible-slides, 1)
		);
		align-items: stretch;
	}

	.carousel__slide {
		position: relative;
		overflow: clip;
		box-sizing: border-box;
		display: grid;
		container-type: inline-size;
		gap: var(--carousel-slide-gap);
		padding: var(--carousel-card-padding);
		border-radius: var(--carousel-slide-radius);
		border: 1px solid var(--carousel-card-border);
		background: var(--carousel-card-bg);
		box-shadow: var(--carousel-slide-shadow);
		min-height: 100%;
		align-self: start;
		scroll-snap-align: start;
		scroll-snap-stop: always;
	}

	.carousel__slide--pinned {
		min-block-size: 100%;
	}

	.carousel__media {
		overflow: clip;
		border-radius: var(--carousel-media-radius);
		aspect-ratio: var(--carousel-media-aspect-ratio, 16 / 10);
		isolation: isolate;
		min-block-size: 0;
	}

	.carousel__media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		-webkit-user-drag: none;
		user-select: none;
		pointer-events: none;
	}

	.carousel__copy {
		display: grid;
		gap: var(--carousel-copy-gap);
		min-block-size: 0;
	}

	.carousel__eyebrow {
		font-size: var(--carousel-eyebrow-size);
		font-weight: 700;
		letter-spacing: var(--carousel-eyebrow-tracking);
		text-transform: uppercase;
		color: var(--text-muted, #6f6254);
		font-family: var(--carousel-eyebrow-font, var(--font-ui, inherit));
	}

	.carousel__slide-title {
		margin: 0;
		font-size: var(--carousel-slide-title-size);
		font-family: var(--carousel-slide-title-font, var(--font-heading, inherit));
	}

	.carousel__slide-body {
		margin: 0;
		color: var(--text-muted, #6f6254);
		line-height: var(--carousel-slide-body-line-height);
		font-family: var(--carousel-slide-body-font, var(--font-body, inherit));
	}

	.carousel__dot {
		width: 11px;
		height: 11px;
		border-radius: 999px;
		background: var(--carousel-dot-bg);
		border: 1px solid var(--carousel-dot-border);
		transition: transform 180ms ease, background 180ms ease, box-shadow 180ms ease;
	}

	.carousel__dot[data-active="true"] {
		transform: scale(1.18);
		background: var(--surface-accent, #d8b165);
		box-shadow: 0 0 0 4px var(--carousel-dot-active-ring);
	}

	.carousel__footer {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
	}

	.carousel__footer--has-play-pause {
		position: relative;
	}

	.carousel__footer--play-only {
		justify-content: flex-end;
	}

	.carousel__footer--has-play-pause .carousel__play-pause {
		position: absolute;
		inset-inline-end: 0;
	}

	.carousel__play-pause {
		appearance: none;
		border: 1px solid var(--carousel-dot-border);
		background: var(--carousel-dot-bg);
		color: var(--text-primary, #23160b);
		cursor: pointer;
		display: inline-grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		border-radius: 999px;
		box-shadow: 0 6px 14px var(--carousel-control-shadow);
		transition: transform 180ms ease, background 180ms ease;
	}

	.carousel__play-pause:hover {
		transform: translateY(-1px);
	}

	.carousel__play-pause:focus-visible {
		outline: 2px solid var(--carousel-focus-ring);
		outline-offset: 2px;
	}

	.carousel--peek-strip .carousel__scroller {
		grid-auto-columns: minmax(280px, 1fr);
	}

	.carousel--editorial-stack .carousel__slide {
		grid-template-columns: minmax(220px, 0.95fr) minmax(0, 1.05fr);
		align-items: center;
	}

	.carousel--floating-cards .carousel__scroller {
		grid-auto-columns: minmax(260px, 1fr);
		align-items: stretch;
	}

	.carousel--spotlight-dots .carousel__slide {
		grid-template-columns: minmax(220px, 0.9fr) minmax(0, 1.1fr);
		align-items: center;
		min-height: 320px;
	}

	.carousel--spotlight-dots .carousel__dots {
		justify-content: center;
	}

	.carousel--pin-first-marquee .carousel__layout--pinned {
		align-items: stretch;
	}

	.carousel--pin-first-marquee .carousel__viewport {
		overflow: visible;
		padding:
			var(--carousel-marquee-viewport-top)
			var(--carousel-marquee-viewport-inline)
			var(--carousel-viewport-bottom-padding);
		border-radius: calc(var(--radius-surface, 24px) + 8px);
		background: var(--carousel-viewport-bg);
		border: 1px solid var(--carousel-viewport-border);
	}

	.carousel--pin-first-marquee .carousel__pinned,
	.carousel--pin-first-marquee .carousel__pinned-stack,
	.carousel--pin-first-marquee .carousel__scroller--rail {
		block-size: 100%;
		min-block-size: 0;
	}

	.carousel--pin-first-marquee .carousel__scroller--rail {
		align-items: stretch;
	}

	.carousel--pin-first-marquee .carousel__slide {
		display: flex;
		flex-direction: column;
		block-size: 100%;
		min-block-size: 0;
		gap: clamp(0.75rem, 1.5cqi, 1rem);
	}

	.carousel--pin-first-marquee .carousel__media {
		flex: var(--carousel-slide-media-fr, 3) 1 0;
		aspect-ratio: auto;
		align-self: stretch;
		min-block-size: clamp(10rem, 52%, 15rem);
	}

	.carousel--pin-first-marquee .carousel__copy {
		display: flex;
		flex-direction: column;
		gap: clamp(0.35rem, 1.2cqi, 0.7rem);
		flex: var(--carousel-slide-copy-fr, 2) 0 0;
		justify-content: flex-start;
		min-block-size: clamp(7.5rem, 30%, 11rem);
		overflow: hidden;
	}

	.carousel__accent {
		position: absolute;
		inset-inline-end: 18px;
		inset-block-start: 18px;
		z-index: 2;
		width: 56px;
		height: 56px;
		padding: var(--carousel-accent-padding);
		border-radius: var(--radius-image, 16px);
		background: var(--carousel-accent-bg);
		box-shadow: 0 14px 28px var(--carousel-accent-shadow);
		backdrop-filter: blur(14px) saturate(1.12);
	}

	.carousel__accent img {
		width: 100%;
		height: 100%;
		display: block;
	}

	@media (min-width: 960px) {
		.carousel--peek-strip .carousel__scroller {
			grid-auto-columns: var(--carousel-peek-desktop-columns, calc((100% - 36px) / 3));
		}

		.carousel--floating-cards .carousel__scroller {
			grid-auto-columns: var(--carousel-floating-desktop-columns, calc((100% - 36px) / 3));
		}

		.carousel--editorial-stack .carousel__scroller {
			grid-auto-columns: 100%;
		}
	}

	@media (max-width: 720px) {
		.carousel[data-carousel-arrow-position="outer-sides"] .carousel__viewport {
			padding-inline: 0;
			padding-top: var(--spacing-sm, 12px);
		}

		.carousel__controls--outer-sides {
			position: static;
			transform: none;
			justify-content: flex-end;
			padding-inline: 0;
			margin-bottom: var(--spacing-sm, 12px);
			pointer-events: auto;
		}

		.carousel__layout--pinned,
		.carousel--editorial-stack .carousel__slide,
		.carousel--spotlight-dots .carousel__slide {
			grid-template-columns: 1fr;
		}

		.carousel__pinned {
			position: static;
		}

		.carousel__scroller,
		.carousel__scroller--rail,
		.carousel--peek-strip .carousel__scroller,
		.carousel--floating-cards .carousel__scroller {
			grid-auto-columns: minmax(84cqi, 1fr);
		}

		.carousel__header {
			align-items: flex-start;
		}

		.carousel__controls,
		.carousel__dots {
			flex-wrap: wrap;
		}
	}
`;
