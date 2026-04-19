export const carouselStyles = `
	.carousel {
		--carousel-gap: 18px;
		--carousel-scrollbar-size: 10px;
		--carousel-scrollbar-thumb: color-mix(in oklab, var(--surface-shadow) 22%, transparent);
		--carousel-scrollbar-thumb-hover: color-mix(in oklab, var(--surface-shadow) 34%, transparent);
		--carousel-scrollbar-track: color-mix(in oklab, var(--surface-muted) 55%, transparent);
		--carousel-control-bg: var(--surface-panel);
		--carousel-control-border: var(--border-subtle);
		--carousel-control-shadow: color-mix(in oklab, var(--surface-shadow) 12%, transparent);
		--carousel-control-shadow-disabled: color-mix(in oklab, var(--surface-shadow) 6%, transparent);
		--carousel-card-bg: var(--surface-panel);
		--carousel-card-border: var(--border-subtle);
		--carousel-card-shadow: color-mix(in oklab, var(--surface-shadow) 10%, transparent);
		--carousel-dot-bg: color-mix(in oklab, var(--border-subtle) 90%, transparent);
		--carousel-dot-border: var(--surface-panel);
		--carousel-dot-active-ring: color-mix(in oklab, var(--surface-accent) 18%, transparent);
		--carousel-focus-ring: var(--surface-accent);
		--carousel-viewport-bg: var(--surface-panel);
		--carousel-viewport-border: var(--border-subtle);
		--carousel-accent-bg: var(--surface-panel);
		--carousel-accent-shadow: color-mix(in oklab, var(--surface-shadow) 18%, transparent);
		--carousel-viewport-bottom-padding: var(--spacing-lg, 24px);
		--carousel-scrollbar-padding-bottom: var(--spacing-sm, 12px);
		--carousel-card-padding: var(--spacing-md, 16px);
		--carousel-marquee-viewport-top: var(--spacing-md, 16px);
		--carousel-marquee-viewport-inline: var(--spacing-md, 16px);
		--carousel-accent-padding: var(--spacing-xs, 4px);
		display: grid;
		gap: 16px;
		container-type: inline-size;
	}

	.carousel__header {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		align-items: center;
		justify-content: space-between;
	}

	.carousel__title {
		margin: 0;
		font-size: 1.3rem;
	}

	.carousel__controls,
	.carousel__dots {
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}

	.carousel__controls--bottom {
		justify-content: flex-end;
	}

	.carousel__control,
	.carousel__dot {
		appearance: none;
		border: 0;
		cursor: pointer;
	}

	.carousel__control {
		inline-size: 2.75rem;
		block-size: 2.75rem;
		display: inline-grid;
		place-items: center;
		border-radius: var(--radius-surface, 24px);
		background: var(--carousel-control-bg);
		border: 1px solid var(--carousel-control-border);
		color: var(--text-primary);
		font: inherit;
		font-size: 1.3rem;
		font-weight: 700;
		line-height: 1;
		box-shadow: 0 12px 26px var(--carousel-control-shadow);
		transition: transform 180ms ease, background 180ms ease, box-shadow 180ms ease;
	}

	.carousel__control:hover {
		transform: translateY(-1px);
	}

	.carousel__control:focus-visible,
	.carousel__scroller:focus-visible,
	.carousel__dot:focus-visible {
		outline: 2px solid var(--carousel-focus-ring);
		outline-offset: 2px;
	}

	.carousel__control:disabled {
		cursor: not-allowed;
		opacity: 0.45;
		transform: none;
		box-shadow: 0 6px 14px var(--carousel-control-shadow-disabled);
	}

	.carousel__viewport {
		position: relative;
		overflow: clip;
		padding: 0 0 var(--carousel-viewport-bottom-padding);
	}

	.carousel[data-carousel-arrow-position="outer-sides"] .carousel__viewport {
		padding-inline: calc(2.75rem + var(--spacing-md, 16px));
	}

	.carousel__controls--outer-sides {
		position: absolute;
		inset-inline: 0;
		inset-block-start: 50%;
		transform: translateY(-50%);
		justify-content: space-between;
		padding-inline: var(--spacing-xs, 4px);
		pointer-events: none;
		z-index: 3;
	}

	.carousel__controls--outer-sides .carousel__control {
		pointer-events: auto;
	}

	.carousel__layout {
		display: grid;
		gap: 18px;
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
		grid-auto-columns: minmax(min(84cqi, 22rem), 1fr);
		gap: var(--carousel-gap);
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
	}

	@supports (scrollbar-width: thin) {
		.carousel__scroller {
			scrollbar-width: thin;
			scrollbar-color: transparent transparent;
		}

		.carousel__scroller:hover,
		.carousel__scroller:focus-visible,
		.carousel__scroller:focus-within {
			scrollbar-color: var(--carousel-scrollbar-thumb) var(--carousel-scrollbar-track);
		}
	}

	@supports selector(::-webkit-scrollbar) {
		.carousel__scroller::-webkit-scrollbar {
			max-inline-size: var(--carousel-scrollbar-size);
			max-block-size: var(--carousel-scrollbar-size);
		}

		.carousel__scroller::-webkit-scrollbar-track {
			background: transparent;
			border-radius: 999px;
		}

		.carousel__scroller::-webkit-scrollbar-thumb {
			background: transparent;
			border: 2px solid transparent;
			border-radius: 999px;
			background-clip: padding-box;
		}

		.carousel__scroller:hover::-webkit-scrollbar-track,
		.carousel__scroller:focus-visible::-webkit-scrollbar-track,
		.carousel__scroller:focus-within::-webkit-scrollbar-track {
			background: var(--carousel-scrollbar-track);
		}

		.carousel__scroller:hover::-webkit-scrollbar-thumb,
		.carousel__scroller:focus-visible::-webkit-scrollbar-thumb,
		.carousel__scroller:focus-within::-webkit-scrollbar-thumb {
			background: var(--carousel-scrollbar-thumb);
		}

		.carousel__scroller:hover::-webkit-scrollbar-thumb:hover,
		.carousel__scroller:focus-visible::-webkit-scrollbar-thumb:hover,
		.carousel__scroller:focus-within::-webkit-scrollbar-thumb:hover {
			background: var(--carousel-scrollbar-thumb-hover);
		}

		.carousel__scroller:hover,
		.carousel__scroller:focus-visible,
		.carousel__scroller:focus-within {
			--carousel-scrollbar-repaint-fix: ;
		}
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
		gap: 16px;
		padding: var(--carousel-card-padding);
		border-radius: var(--radius-surface, 24px);
		border: 1px solid var(--carousel-card-border);
		background: var(--carousel-card-bg);
		box-shadow: 0 10px 24px var(--carousel-card-shadow);
		min-height: 100%;
		scroll-snap-align: start;
		scroll-snap-stop: always;
	}

	.carousel__slide--pinned {
		min-block-size: 100%;
	}

	.carousel__media {
		overflow: clip;
		border-radius: var(--radius-image, 16px);
		aspect-ratio: 16 / 10;
		isolation: isolate;
		min-block-size: 0;
	}

	.carousel__media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.carousel__copy {
		display: grid;
		gap: 8px;
		min-block-size: 0;
	}

	.carousel__eyebrow {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.carousel__slide-title {
		margin: 0;
		font-size: 1.12rem;
	}

	.carousel__slide-body {
		margin: 0;
		color: var(--text-muted);
		line-height: 1.6;
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
		background: var(--surface-accent);
		box-shadow: 0 0 0 4px var(--carousel-dot-active-ring);
	}

	.carousel__footer {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
	}

	.carousel__footer--has-play-pause {
		justify-content: center;
		position: relative;
	}

	.carousel__footer--play-only {
		justify-content: flex-end;
	}

	.carousel__footer--has-play-pause .carousel__play-pause {
		position: absolute;
		right: 0;
	}

	.carousel__play-pause {
		appearance: none;
		border: 1px solid var(--carousel-dot-border);
		background: var(--carousel-dot-bg);
		color: var(--text-primary);
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

	.carousel--pin-first-marquee .carousel__accent {
		inset-inline-end: 34px;
		inset-block-start: 34px;
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

	.carousel--pin-first-marquee .carousel__eyebrow {
		font-size: clamp(0.58rem, 0.95cqi, 0.72rem);
		letter-spacing: clamp(0.08em, 0.22cqi, 0.14em);
	}

	.carousel--pin-first-marquee .carousel__slide-title {
		font-size: clamp(0.95rem, 2.5cqi, 1.45rem);
		line-height: 1.16;
		padding-block-end: 0.08em;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		text-wrap: balance;
	}

	.carousel--pin-first-marquee .carousel__slide-body {
		font-size: clamp(0.78rem, 1.65cqi, 1rem);
		line-height: 1.5;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 4;
		overflow: hidden;
		text-wrap: pretty;
	}

	.carousel--editorial-stack .carousel__slide {
		grid-template-columns: minmax(15rem, 0.92fr) minmax(16rem, 1.08fr);
		align-items: center;
		min-height: 20rem;
	}

	.carousel--editorial-stack .carousel__scroller {
		grid-auto-columns: minmax(34rem, 1fr);
	}

	.carousel--editorial-stack .carousel__copy {
		gap: var(--spacing-sm, 0.75rem);
	}

	.carousel--editorial-stack .carousel__slide-title {
		font-size: clamp(1.35rem, 1.5vw, 1.9rem);
		line-height: 1.14;
		text-wrap: balance;
	}

	.carousel--editorial-stack .carousel__slide-body {
		font-size: clamp(1rem, 1.1vw, 1.2rem);
		line-height: 1.55;
		text-wrap: pretty;
	}

	.carousel--floating-cards .carousel__scroller {
		grid-auto-columns: minmax(260px, 1fr);
		align-items: stretch;
	}

	.carousel--floating-cards .carousel__slide:nth-child(2n) {
		transform: translateY(10px);
	}

	.carousel--spotlight-dots .carousel__slide {
		grid-template-columns: minmax(220px, 0.9fr) minmax(0, 1.1fr);
		align-items: center;
		min-height: 320px;
	}

	.carousel--spotlight-dots .carousel__dots {
		justify-content: center;
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

export const productSearchStyles = `
	.search-island__root {
		--search-field-bg: var(--surface-panel);
		--search-field-border: var(--border-subtle);
		--search-focus-ring: color-mix(in oklab, var(--surface-accent) 18%, transparent);
		--search-action-bg: var(--interactive-link);
		--search-action-bg-hover: var(--interactive-link-hover);
		--search-action-border: var(--interactive-link);
		--search-dropdown-bg: var(--surface-panel);
		--search-dropdown-border: var(--border-subtle);
		--search-dropdown-shadow: color-mix(in oklab, var(--surface-shadow) 16%, transparent);
		--search-item-hover: var(--surface-muted);
		--search-thumb-bg: var(--surface-muted);
		--search-badge-bg: var(--surface-muted);
		--search-badge-text: var(--text-muted);
		--search-highlight-bg: color-mix(in oklab, var(--surface-accent) 24%, white);
		position: relative;
		width: 100%;
	}

	.search-island {
		display: block;
	}

	.search-island__dropdown-shell {
		position: absolute;
		inset-inline: 0;
		inset-block-start: calc(100% + var(--spacing-xs, 0.25rem));
		z-index: 20;
	}

	.search-island__input-wrapper {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: var(--spacing-xs, 0.25rem);
		padding: var(--spacing-xs, 0.25rem);
		padding-inline-start: var(--spacing-sm, 0.75rem);
		min-block-size: calc(var(--spacing-xl, 2rem) + var(--spacing-md, 1rem));
		background: var(--search-field-bg);
		border: 1px solid var(--search-field-border);
		border-radius: var(--radius-pill, 999px);
		transition: border-color 0.2s, box-shadow 0.2s;
	}

	.search-island__input-wrapper:focus-within {
		border-color: var(--interactive-link);
		box-shadow: 0 0 0 3px var(--search-focus-ring);
	}

	.search-island__input {
		flex: 1;
		min-inline-size: 0;
		padding: 0 var(--spacing-sm, 0.75rem) 0 0;
		border: none;
		background: transparent;
		font-size: 1rem;
		line-height: 1.35;
		color: var(--text-primary);
		outline: none;
	}

	.search-island__input::placeholder {
		color: var(--text-muted);
	}

	.search-island__spinner {
		position: absolute;
		inset: 0;
		margin: auto;
		inline-size: 1rem;
		block-size: 1rem;
		border: 2px solid var(--search-field-border);
		border-top-color: var(--interactive-link);
		border-radius: 50%;
		opacity: 0;
		pointer-events: none;
		animation: search-island-spin 0.8s linear infinite;
	}

	.search-island__spinner[data-visible="true"] {
		opacity: 1;
	}

	@keyframes search-island-spin {
		to {
			transform: rotate(360deg);
		}
	}

	.search-island__actions {
		display: inline-flex;
		align-items: center;
	}

	.search-island__btn {
		appearance: none;
		position: relative;
		display: grid;
		place-items: center;
		align-self: center;
		flex-shrink: 0;
		inline-size: calc(var(--spacing-xl, 2rem) + var(--spacing-sm, 0.75rem));
		block-size: calc(var(--spacing-xl, 2rem) + var(--spacing-sm, 0.75rem));
		padding: 0;
		font: inherit;
		line-height: 1;
		background: var(--search-action-bg);
		color: white;
		border: 1px solid var(--search-action-border);
		border-radius: var(--radius-pill, 999px);
		cursor: pointer;
	}

	.search-island__btn-icon {
		display: grid;
		place-items: center;
		opacity: 1;
		transition: opacity 120ms ease;
	}

	.search-island__btn[data-loading="true"] .search-island__btn-icon {
		opacity: 0;
	}

	.search-island__btn svg {
		display: block;
		flex-shrink: 0;
		inline-size: 1.25rem;
		block-size: 1.25rem;
	}

	.search-island__btn:hover {
		background: var(--search-action-bg-hover);
	}

	.search-island__dropdown {
		position: relative;
		inline-size: 100%;
		max-block-size: min(24rem, 60vh);
		overflow-y: auto;
		background: var(--search-dropdown-bg);
		border: 1px solid var(--search-dropdown-border);
		border-radius: var(--radius-surface, 24px);
		box-shadow: 0 4px 12px var(--search-dropdown-shadow);
	}

	.search-island__tabs {
		display: flex;
		border-bottom: 1px solid var(--search-field-border);
	}

	.search-island__tab {
		flex: 1;
		padding: var(--spacing-sm, 0.75rem);
		background: none;
		border: none;
		font-size: 0.875rem;
		color: var(--text-muted);
		cursor: pointer;
	}

	.search-island__tab:hover {
		background: var(--search-item-hover);
	}

	.search-island__tab--active {
		color: var(--interactive-link);
		font-weight: 600;
		box-shadow: inset 0 -2px 0 var(--interactive-link);
	}

	.search-island__list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.search-island__item {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm, 0.75rem);
		padding: var(--spacing-sm, 0.75rem) var(--spacing-md, 1rem);
		cursor: pointer;
	}

	.search-island__item:hover,
	.search-island__item--selected {
		background: var(--search-item-hover);
	}

	.search-island__item-img {
		inline-size: 2.75rem;
		block-size: 2.75rem;
		object-fit: cover;
		background: var(--search-thumb-bg);
		border-radius: var(--radius-image, 16px);
	}

	.search-island__item-content {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.search-island__item-text {
		font-weight: 500;
		color: var(--text-primary);
	}

	.search-island__item-badge {
		display: inline-block;
		width: fit-content;
		margin-top: var(--spacing-xxs, 0.125rem);
		padding: var(--spacing-xxs, 0.125rem) var(--spacing-xs, 0.25rem);
		font-size: 0.7rem;
		font-weight: 600;
		color: var(--search-badge-text);
		background: var(--search-badge-bg);
		border-radius: var(--radius-pill, 999px);
	}

	.search-island__item-price {
		margin-top: var(--spacing-xxs, 0.125rem);
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--interactive-link);
	}

	.search-island__item-icon {
		color: var(--text-muted);
		flex-shrink: 0;
	}

	.search-island__recent-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-sm, 0.75rem) var(--spacing-md, 1rem);
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-muted);
		text-transform: uppercase;
		border-bottom: 1px solid color-mix(in oklab, var(--search-field-border) 72%, transparent);
	}

	.search-island__clear-btn {
		background: none;
		border: none;
		font-size: 0.75rem;
		color: var(--interactive-link);
		cursor: pointer;
		text-transform: none;
	}

	.search-island__clear-btn:hover {
		text-decoration: underline;
	}

	.search-island__empty {
		padding: var(--spacing-lg, 1.5rem) var(--spacing-md, 1rem);
		text-align: center;
		color: var(--text-muted);
	}

	.search-highlight {
		padding-inline: var(--spacing-xxs, 0.125rem);
		background: var(--search-highlight-bg);
		border-radius: var(--radius-pill, 999px);
	}

	@media (max-width: 640px) {
		.search-island__dropdown-shell {
			position: relative;
			inset: auto;
			margin-top: var(--spacing-xs, 0.25rem);
		}

		.search-island__input-wrapper {
			padding-inline-start: var(--spacing-xs, 0.25rem);
			min-block-size: calc(var(--spacing-xl, 2rem) + var(--spacing-sm, 0.75rem));
		}

		.search-island__btn {
			inline-size: calc(var(--spacing-xl, 2rem) + var(--spacing-xs, 0.25rem));
			block-size: calc(var(--spacing-xl, 2rem) + var(--spacing-xs, 0.25rem));
		}

		.search-island__item {
			align-items: flex-start;
		}

		.search-island__recent-header {
			gap: var(--spacing-xs, 0.25rem);
			flex-wrap: wrap;
		}
	}
`;
