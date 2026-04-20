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
	.shell {
		--shell-max-width: 1040px;
		--shell-padding-block-start: 32px;
		--shell-padding-inline: 20px;
		--shell-padding-block-end: 56px;
		--shell-header-gap: 16px;
		--shell-header-margin-bottom: 28px;
		--shell-header-padding-block: 18px;
		--shell-header-padding-inline: 22px;
		--shell-section-padding: 22px;
		--shell-section-gap: 20px;
		--shell-title-font: var(--font-heading, "Avenir Next", "Segoe UI", sans-serif);
		--shell-title-tracking: -0.03em;
		max-width: var(--shell-max-width);
		margin: 0 auto;
		padding:
			var(--shell-padding-block-start)
			var(--shell-padding-inline)
			var(--shell-padding-block-end);
	}

	.shell__header {
		display: flex;
		flex-wrap: wrap;
		gap: var(--shell-header-gap);
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--shell-header-margin-bottom);
		padding: var(--shell-header-padding-block) var(--shell-header-padding-inline);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-shell, 24px);
		background: color-mix(in srgb, var(--surface-panel) 88%, white);
		box-shadow: 0 16px 40px color-mix(in srgb, var(--surface-shadow) 16%, transparent);
		backdrop-filter: blur(14px);
	}

	.shell__brand {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.shell__eyebrow {
		font-size: var(--shell-eyebrow-size, 0.72rem);
		letter-spacing: var(--shell-eyebrow-tracking, 0.14em);
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.shell__name {
		font-size: var(--shell-name-size, 1.2rem);
		font-weight: var(--shell-name-weight, 700);
		font-family: var(--shell-brand-font, var(--font-heading, inherit));
		letter-spacing: var(--shell-name-tracking, normal);
	}

	.shell__nav {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.shell__actions {
		display: flex;
		align-items: center;
		margin-left: auto;
	}

	.shell__nav a {
		padding: var(--shell-nav-padding-block, 10px) var(--shell-nav-padding-inline, 14px);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-pill, 999px);
		background: color-mix(in srgb, var(--surface-canvas) 72%, white);
		text-decoration: none;
		font-size: var(--shell-nav-size, 0.95rem);
		font-family: var(--shell-nav-font, var(--font-ui, inherit));
		transition: transform 180ms ease, background 180ms ease, border-color 180ms ease;
	}

	.shell__nav a:hover {
		transform: translateY(-1px);
	}

	.shell__main {
		display: grid;
		gap: var(--shell-section-gap);
	}

	.shell section {
		padding: var(--shell-section-padding);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-card, 22px);
		background: color-mix(in srgb, var(--surface-panel) 92%, white);
		box-shadow: 0 10px 30px color-mix(in srgb, var(--surface-shadow) 10%, transparent);
	}

	.shell h1,
	.shell h2 {
		font-family: var(--shell-title-font);
		letter-spacing: var(--shell-title-tracking);
	}

	.feature {
		--feature-gap: 22px;
		--feature-content-gap: 10px;
		--feature-title-size: clamp(1.55rem, 3vw, 2.25rem);
		--feature-body-size: 1rem;
		--feature-chip-padding-block: 9px;
		--feature-chip-padding-inline: 13px;
		--feature-visual-gap: 16px;
		--feature-visual-padding: 4px;
		--feature-card-gap: 14px;
		--feature-card-padding: 14px;
		display: flex;
		flex-wrap: wrap;
		gap: var(--feature-gap);
		align-items: center;
		overflow: clip;
	}

	.feature--reverse {
		flex-direction: row-reverse;
	}

	.feature--reverse .feature__content {
		order: 2;
	}

	.feature--reverse .feature__visual {
		order: 1;
	}

	.feature__content {
		flex: 1 1 18rem;
	}

	.feature__visual {
		flex: 1.08 1 18rem;
	}

	.feature__content,
	.feature__lead-copy,
	.feature__support-copy {
		display: grid;
		gap: var(--feature-content-gap);
	}

	.feature__eyebrow,
	.feature__product-kicker {
		font-size: var(--feature-eyebrow-size, 0.72rem);
		font-weight: var(--feature-eyebrow-weight, 700);
		letter-spacing: var(--feature-eyebrow-tracking, 0.14em);
		text-transform: uppercase;
		color: var(--text-muted);
		font-family: var(--feature-eyebrow-font, var(--font-ui, inherit));
	}

	.feature__title {
		margin: 0;
		font-size: var(--feature-title-size);
		line-height: var(--feature-title-line-height, 1);
		letter-spacing: var(--feature-title-tracking, inherit);
		font-family: var(--feature-title-font, var(--font-heading, inherit));
	}

	.feature__body,
	.feature__support-body {
		margin: 0;
		font-size: var(--feature-body-size);
		line-height: var(--feature-body-line-height, 1.65);
		color: var(--text-muted);
		font-family: var(--feature-body-font, var(--font-body, inherit));
	}

	.feature__chips {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 4px;
	}

	.feature__chip {
		padding: var(--feature-chip-padding-block) var(--feature-chip-padding-inline);
		border-radius: var(--radius-pill, 999px);
		background: color-mix(in srgb, var(--surface-accent) 16%, var(--surface-panel));
		border: 1px solid color-mix(in srgb, var(--border-subtle) 74%, white);
		font-size: var(--feature-chip-size, 0.88rem);
		font-family: var(--feature-chip-font, var(--font-ui, inherit));
	}

	.feature__visual {
		display: grid;
		grid-template-columns: minmax(0, 1.12fr) minmax(12rem, 0.88fr);
		gap: var(--feature-visual-gap);
		align-items: stretch;
		min-width: 0;
		padding: var(--feature-visual-padding);
	}

	.feature__lead-card,
	.feature__support-card {
		display: grid;
		gap: var(--feature-card-gap);
		padding: var(--feature-card-padding);
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

	.feature__lead-media,
	.feature__support-media {
		width: 100%;
		border-radius: calc(var(--radius-card, 22px) - 8px);
		overflow: clip;
		display: block;
	}

	.feature__lead-media {
		aspect-ratio: 4 / 5;
	}

	.feature__support-media {
		aspect-ratio: 16 / 11;
		object-fit: cover;
	}

	.feature__lead-media img {
		width: 100%;
		height: 100%;
		display: block;
		object-fit: cover;
	}

	.feature__supporting {
		display: grid;
		gap: 14px;
		align-content: center;
		min-width: 0;
	}

	.feature__product-name {
		font-family: "Avenir Next", "Segoe UI", sans-serif;
		font-size: 1.05rem;
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.feature__product-price {
		color: color-mix(in srgb, var(--text-primary) 82%, white);
		font-size: 0.94rem;
	}

	.feature__thumbs {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 8px;
		margin-top: 6px;
		min-width: 0;
	}

	.feature__thumb {
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
		--grid-items-gap: 18px;
		--grid-items-layout-gap: 16px;
		--grid-items-card-gap: 12px;
		--grid-items-card-padding: 14px;
		--grid-items-card-radius: calc(var(--radius-card, 22px) - 2px);
		--grid-items-card-border: var(--border-subtle);
		--grid-items-card-background:
			linear-gradient(180deg, color-mix(in srgb, white 18%, transparent), transparent 45%),
			color-mix(in srgb, var(--surface-panel) 82%, white);
		--grid-items-card-shadow:
			0 14px 28px color-mix(in srgb, var(--surface-shadow) 10%, transparent),
			inset 0 1px 0 color-mix(in srgb, white 54%, transparent);
		--grid-items-header-gap: 12px;
		--grid-items-title-size: clamp(1.25rem, 2vw, 1.7rem);
		--grid-items-link-size: 0.92rem;
		--grid-items-link-tracking: 0.04em;
		--grid-items-feature-span: 6;
		--grid-items-supporting-span: 3;
		--grid-items-even-span: 3;
		--grid-items-feature-min-height: 28rem;
		--grid-items-media-radius: calc(var(--radius-card, 22px) - 8px);
		--grid-items-content-gap: 8px;
		--grid-items-eyebrow-size: 0.7rem;
		--grid-items-eyebrow-tracking: 0.12em;
		--grid-items-price-padding-block: 0.35rem;
		--grid-items-price-padding-inline: 0.7rem;
		--grid-items-price-size: 0.84rem;
		--grid-items-item-title-size: 1.05rem;
		--grid-items-item-title-line-height: 1.08;
		--grid-items-item-title-tracking: -0.025em;
		--grid-items-meta-gap: 4px;
		--grid-items-meta-size: 0.9rem;
		--grid-items-meta-line-height: 1.4;
		display: grid;
		gap: var(--grid-items-gap);
	}

	.grid-items__header {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--grid-items-header-gap);
	}

	.grid-items__title {
		margin: 0;
		font-size: var(--grid-items-title-size);
		font-family: var(--grid-items-title-font, var(--font-heading, inherit));
		letter-spacing: var(--grid-items-title-tracking, inherit);
	}

	.grid-items__link {
		text-decoration: none;
		font-size: var(--grid-items-link-size);
		font-weight: 700;
		letter-spacing: var(--grid-items-link-tracking);
		text-transform: uppercase;
		font-family: var(--grid-items-link-font, var(--font-ui, inherit));
	}

	.grid-items__layout {
		display: grid;
		grid-template-columns: repeat(12, minmax(0, 1fr));
		gap: var(--grid-items-layout-gap);
	}

	.grid-items__card {
		position: relative;
		display: grid;
		gap: var(--grid-items-card-gap);
		min-width: 0;
		padding: var(--grid-items-card-padding);
		border-radius: var(--grid-items-card-radius);
		border: 1px solid var(--grid-items-card-border);
		background: var(--grid-items-card-background);
		color: var(--text-primary);
		text-decoration: none;
		box-shadow: var(--grid-items-card-shadow);
	}

	.grid-items[data-grid-items-layout="even"] .grid-items__card {
		grid-column: span var(--grid-items-even-span);
	}

	.grid-items__card--feature {
		grid-column: span var(--grid-items-feature-span);
		grid-row: span 2;
		min-height: var(--grid-items-feature-min-height);
	}

	.grid-items__card--supporting {
		grid-column: span var(--grid-items-supporting-span);
	}

	.grid-items__media {
		overflow: clip;
		border-radius: var(--grid-items-media-radius);
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
		gap: var(--grid-items-content-gap);
		min-width: 0;
		align-content: start;
	}

	.grid-items__eyebrow {
		font-size: var(--grid-items-eyebrow-size);
		font-weight: 700;
		letter-spacing: var(--grid-items-eyebrow-tracking);
		text-transform: uppercase;
		color: var(--text-muted);
		font-family: var(--grid-items-eyebrow-font, var(--font-ui, inherit));
	}

	.grid-items__price {
		justify-self: start;
		padding: var(--grid-items-price-padding-block) var(--grid-items-price-padding-inline);
		border-radius: 999px;
		background: color-mix(in srgb, var(--surface-accent) 14%, var(--surface-panel));
		border: 1px solid color-mix(in srgb, var(--border-subtle) 78%, white);
		font-size: var(--grid-items-price-size);
		font-weight: 800;
		line-height: 1;
		font-family: var(--grid-items-price-font, var(--font-ui, inherit));
	}

	.grid-items__item-title {
		margin: 0;
		font-size: var(--grid-items-item-title-size);
		line-height: var(--grid-items-item-title-line-height);
		letter-spacing: var(--grid-items-item-title-tracking);
		word-break: break-word;
		font-family: var(--grid-items-item-title-font, var(--font-heading, inherit));
	}

	.grid-items__meta {
		display: grid;
		gap: var(--grid-items-meta-gap);
	}

	.grid-items__meta-line {
		font-size: var(--grid-items-meta-size);
		line-height: var(--grid-items-meta-line-height);
		color: var(--text-muted);
		font-family: var(--grid-items-meta-font, var(--font-body, inherit));
	}

	.plp-products {
		--plp-products-gap: 18px;
		--plp-products-header-gap: 12px;
		--plp-products-title-size: clamp(1.25rem, 2vw, 1.7rem);
		--plp-products-link-size: 0.92rem;
		--plp-products-layout-min: 13.75rem;
		--plp-products-layout-gap: 14px;
		--plp-products-card-gap: 12px;
		--plp-products-card-min-height: 168px;
		--plp-products-card-padding: 12px;
		--plp-products-card-radius: calc(var(--radius-card, 22px) - 4px);
		--plp-products-card-border: var(--border-subtle);
		--plp-products-card-background:
			linear-gradient(180deg, color-mix(in srgb, white 18%, transparent), transparent 45%),
			color-mix(in srgb, var(--surface-panel) 82%, white);
		--plp-products-card-shadow:
			0 12px 24px color-mix(in srgb, var(--surface-shadow) 8%, transparent),
			inset 0 1px 0 color-mix(in srgb, white 54%, transparent);
		--plp-products-media-width: 112px;
		--plp-products-media-height: 156px;
		--plp-products-media-radius: 14px;
		--plp-products-content-gap: 5px;
		--plp-products-content-gap-compact: 4px;
		--plp-products-eyebrow-size: 0.62rem;
		--plp-products-price-padding-block: 0.3rem;
		--plp-products-price-padding-inline: 0.58rem;
		--plp-products-price-size: 0.78rem;
		--plp-products-item-title-size: 0.92rem;
		--plp-products-item-title-line-height: 1.08;
		--plp-products-description-size: 0.8rem;
		--plp-products-description-line-height: 1.35;
		display: grid;
		gap: var(--plp-products-gap);
	}

	.plp-products__header {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--plp-products-header-gap);
	}

	.plp-products__title {
		margin: 0;
		font-size: var(--plp-products-title-size);
		font-family: var(--plp-products-title-font, var(--font-heading, inherit));
	}

	.plp-products__link {
		text-decoration: none;
		font-size: var(--plp-products-link-size);
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		font-family: var(--plp-products-link-font, var(--font-ui, inherit));
	}

	.plp-products__layout {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(var(--plp-products-layout-min), 1fr));
		gap: var(--plp-products-layout-gap);
		align-items: stretch;
	}

	.plp-products__card {
		display: flex;
		align-items: stretch;
		gap: var(--plp-products-card-gap);
		min-height: var(--plp-products-card-min-height);
		min-width: 0;
		padding: var(--plp-products-card-padding);
		border-radius: var(--plp-products-card-radius);
		border: 1px solid var(--plp-products-card-border);
		background: var(--plp-products-card-background);
		color: var(--text-primary);
		text-decoration: none;
		box-shadow: var(--plp-products-card-shadow);
	}

	.plp-products__media {
		flex: 0 0 var(--plp-products-media-width);
		inline-size: var(--plp-products-media-width);
		block-size: var(--plp-products-media-height);
		overflow: clip;
		border-radius: var(--plp-products-media-radius);
		background: color-mix(in srgb, var(--surface-muted) 72%, white);
	}

	.plp-products__media img {
		width: 100%;
		height: 100%;
		display: block;
		object-fit: cover;
		backface-visibility: hidden;
		transform: translateZ(0);
	}

	.plp-products__content {
		flex: 1 1 auto;
		display: grid;
		gap: var(--plp-products-content-gap);
		min-width: 0;
		align-content: center;
	}

	.plp-products__content--compact {
		gap: var(--plp-products-content-gap-compact);
	}

	.plp-products__eyebrow {
		font-size: var(--plp-products-eyebrow-size);
		font-weight: 700;
		letter-spacing: 0.12em;
		line-height: 1.18;
		text-transform: uppercase;
		color: var(--text-muted);
		font-family: var(--plp-products-eyebrow-font, var(--font-ui, inherit));
		overflow-wrap: anywhere;
		word-break: break-word;
		hyphens: auto;
	}

	.plp-products__price {
		justify-self: start;
		padding: var(--plp-products-price-padding-block) var(--plp-products-price-padding-inline);
		border-radius: 999px;
		background: color-mix(in srgb, var(--surface-accent) 14%, var(--surface-panel));
		border: 1px solid color-mix(in srgb, var(--border-subtle) 78%, white);
		font-size: var(--plp-products-price-size);
		font-weight: 800;
		line-height: 1;
		font-family: var(--plp-products-price-font, var(--font-ui, inherit));
	}

	.plp-products__item-title {
		margin: 0;
		font-size: var(--plp-products-item-title-size);
		line-height: var(--plp-products-item-title-line-height);
		letter-spacing: var(--plp-products-item-title-tracking, -0.02em);
		font-family: var(--plp-products-item-title-font, var(--font-heading, inherit));
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}

	.plp-products__title-link {
		color: inherit;
		text-decoration: none;
		overflow-wrap: anywhere;
		word-break: break-word;
	}

	.plp-products__title-link:hover {
		text-decoration: underline;
	}

	.plp-products__description {
		font-size: var(--plp-products-description-size);
		line-height: var(--plp-products-description-line-height);
		color: var(--text-muted);
		font-family: var(--plp-products-description-font, var(--font-body, inherit));
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		overflow-wrap: anywhere;
		word-break: break-word;
	}

	.plp-products__actions {
		display: flex;
		align-items: center;
		margin-top: 2px;
	}

	.plp-products__more {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: var(--plp-products-more-padding-block, 0.34rem) var(--plp-products-more-padding-inline, 0.62rem);
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--border-subtle) 84%, white);
		background: color-mix(in srgb, var(--surface-panel) 88%, white);
		color: inherit;
		font-size: var(--plp-products-more-size, 0.72rem);
		font-weight: 700;
		line-height: 1;
		text-decoration: none;
		font-family: var(--plp-products-more-font, var(--font-ui, inherit));
		box-shadow: inset 0 1px 0 color-mix(in srgb, white 54%, transparent);
	}

	.plp-products__more:hover {
		background: color-mix(in srgb, var(--surface-accent) 12%, var(--surface-panel));
	}

	.product-detail {
		--product-detail-gap: 24px;
		--product-detail-media-min-height: 28rem;
		--product-detail-media-radius: calc(var(--radius-card, 22px) + 2px);
		--product-detail-content-gap: 16px;
		--product-detail-content-padding-top: 8px;
		--product-detail-title-size: clamp(2.25rem, 4.4vw, 4.1rem);
		--product-detail-title-line-height: 0.96;
		--product-detail-title-tracking: -0.05em;
		--product-detail-sku-size: 1rem;
		--product-detail-body-size: 1rem;
		--product-detail-body-line-height: 1.65;
		--product-detail-price-size: clamp(1.85rem, 3vw, 2.7rem);
		--product-detail-price-tracking: -0.04em;
		display: grid;
	}

	.product-detail__layout {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(22rem, 1fr));
		gap: var(--product-detail-gap);
		align-items: start;
	}

	.product-detail__media-column {
		display: grid;
	}

	.product-detail__media-frame {
		display: grid;
		place-items: center;
		min-height: var(--product-detail-media-min-height);
		border-radius: var(--product-detail-media-radius);
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
		gap: var(--product-detail-content-gap);
		padding-top: var(--product-detail-content-padding-top);
	}

	.product-detail__title {
		margin: 0;
		font-size: var(--product-detail-title-size);
		line-height: var(--product-detail-title-line-height);
		letter-spacing: var(--product-detail-title-tracking);
		font-family: var(--product-detail-title-font, var(--font-heading, "Avenir Next", "Segoe UI", sans-serif));
	}

	.product-detail__sku {
		font-size: var(--product-detail-sku-size);
		line-height: 1.4;
		color: var(--text-muted);
		font-family: var(--product-detail-sku-font, var(--font-ui, inherit));
	}

	.product-detail__subtitle,
	.product-detail__description {
		margin: 0;
		font-size: var(--product-detail-body-size);
		line-height: var(--product-detail-body-line-height);
		color: color-mix(in srgb, var(--text-primary) 82%, white);
		font-family: var(--product-detail-body-font, var(--font-body, inherit));
	}

	.product-detail__price {
		font-size: var(--product-detail-price-size);
		font-weight: 800;
		line-height: 1;
		letter-spacing: var(--product-detail-price-tracking);
		font-family: var(--product-detail-price-font, var(--font-heading, "Avenir Next", "Segoe UI", sans-serif));
	}

	.shell__footer {
		margin-top: 28px;
		padding: 16px 4px 0;
		color: var(--text-muted);
		font-size: 0.92rem;
	}

	.theme-switch {
		--theme-switch-gap: 10px;
		--theme-switch-padding-block: 8px;
		--theme-switch-padding-inline-end: 10px;
		--theme-switch-padding-inline-start: 14px;
		--theme-switch-label-size: 0.72rem;
		--theme-switch-label-tracking: 0.12em;
		--theme-switch-option-gap: 6px;
		--theme-switch-option-padding: 4px;
		--theme-switch-button-padding-block: 9px;
		--theme-switch-button-padding-inline: 13px;
		--theme-switch-button-size: 0.86rem;
		display: inline-flex;
		align-items: center;
		gap: var(--theme-switch-gap);
		padding:
			var(--theme-switch-padding-block)
			var(--theme-switch-padding-inline-end)
			var(--theme-switch-padding-block)
			var(--theme-switch-padding-inline-start);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-pill, 999px);
		background: color-mix(in srgb, var(--surface-panel) 78%, white);
		box-shadow:
			0 10px 24px color-mix(in srgb, var(--surface-shadow) 10%, transparent),
			inset 0 1px 0 color-mix(in srgb, white 54%, transparent);
		backdrop-filter: blur(14px) saturate(1.06);
	}

	.theme-switch__label {
		font-size: var(--theme-switch-label-size);
		font-weight: 700;
		letter-spacing: var(--theme-switch-label-tracking);
		text-transform: uppercase;
		color: var(--text-muted);
		font-family: var(--theme-switch-label-font, var(--font-ui, inherit));
	}

	.theme-switch__options {
		display: inline-flex;
		gap: var(--theme-switch-option-gap);
		padding: var(--theme-switch-option-padding);
		border-radius: var(--radius-pill, 999px);
		background: color-mix(in srgb, var(--surface-canvas) 62%, white);
	}

	.theme-switch__button {
		appearance: none;
		border: 0;
		padding: var(--theme-switch-button-padding-block) var(--theme-switch-button-padding-inline);
		border-radius: var(--radius-pill, 999px);
		background: transparent;
		color: var(--text-muted);
		font: inherit;
		font-size: var(--theme-switch-button-size);
		font-weight: 700;
		letter-spacing: -0.01em;
		font-family: var(--theme-switch-button-font, var(--font-ui, inherit));
		cursor: pointer;
		transition:
			transform 180ms ease,
			background 180ms ease,
			color 180ms ease,
			box-shadow 180ms ease;
	}

	.theme-switch__button:hover {
		transform: translateY(-1px);
		color: var(--text-primary);
	}

	.theme-switch__button[data-active="true"],
	.theme-switch__button[aria-pressed="true"] {
		background:
			linear-gradient(180deg, color-mix(in srgb, white 36%, transparent), transparent 75%),
			color-mix(in srgb, var(--surface-accent) 26%, var(--surface-panel));
		color: var(--text-primary);
		box-shadow:
			0 8px 16px color-mix(in srgb, var(--surface-shadow) 12%, transparent),
			inset 0 1px 0 color-mix(in srgb, white 58%, transparent);
	}

	html[data-theme-mode="dark"] .theme-switch__button[data-active="true"],
	html[data-theme-mode="dark"] .theme-switch__button[aria-pressed="true"] {
		background:
			linear-gradient(180deg, color-mix(in srgb, white 10%, transparent), transparent 80%),
			color-mix(in srgb, var(--surface-accent) 20%, var(--surface-panel));
	}

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
			color-mix(in srgb, var(--surface-panel) 78%, white);
		--carousel-slide-shadow:
			0 18px 36px color-mix(in srgb, var(--surface-shadow) 12%, transparent),
			inset 0 1px 0 color-mix(in srgb, white 54%, transparent);
		--carousel-media-radius: calc(var(--carousel-slide-radius) - 8px);
		--carousel-copy-gap: 8px;
		--carousel-eyebrow-size: 0.72rem;
		--carousel-eyebrow-tracking: 0.14em;
		--carousel-slide-title-size: 1.12rem;
		--carousel-slide-body-line-height: 1.6;
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
		background: color-mix(in srgb, var(--surface-panel) 76%, white);
		border: 1px solid var(--border-subtle);
		color: var(--text-primary);
		font: inherit;
		font-size: var(--carousel-control-font-size);
		font-weight: 700;
		line-height: 1;
		box-shadow:
			0 12px 26px color-mix(in srgb, var(--surface-shadow) 12%, transparent),
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
			0 8px 18px color-mix(in srgb, var(--surface-shadow) 8%, transparent),
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

	.carousel__layout {
		display: grid;
		gap: var(--carousel-layout-gap);
	}

	.carousel__layout--pinned {
		grid-template-columns: minmax(280px, 0.82fr) minmax(0, 1.18fr);
	}

	.carousel__pinned {
		position: sticky;
		inset-block-start: 0;
		align-self: start;
	}

	.carousel__scroller {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: var(--carousel-scroller-column-width);
		grid-auto-rows: max-content;
		gap: var(--carousel-scroller-gap);
		padding: 0;
		overflow-x: auto;
		overflow-y: hidden;
		overscroll-behavior-inline: contain;
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

	.carousel__scroller.is-dragging {
		cursor: grabbing;
	}

	.carousel__scroller::-webkit-scrollbar {
		height: 14px;
	}

	.carousel__scroller::-webkit-scrollbar-track {
		border-radius: 999px;
		background:
			linear-gradient(180deg, color-mix(in oklab, white 42%, transparent), transparent),
			color-mix(in oklab, var(--surface-muted) 78%, transparent);
		box-shadow:
			inset 0 1px 0 color-mix(in oklab, white 58%, transparent),
			inset 0 0 0 1px color-mix(in oklab, var(--border-subtle) 72%, transparent);
	}

	.carousel__scroller::-webkit-scrollbar-thumb {
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

	.carousel__scroller::-webkit-scrollbar-thumb:hover {
		background:
			linear-gradient(135deg, color-mix(in oklab, white 34%, transparent), transparent 52%) padding-box,
			linear-gradient(
					90deg,
					color-mix(in oklab, var(--surface-accent) 88%, white),
					color-mix(in oklab, var(--surface-accent) 56%, var(--text-primary))
				)
				border-box;
	}

	.carousel__scroller--spotlight {
		grid-auto-columns: 100%;
	}

	.carousel__scroller--rail {
		grid-auto-columns: var(--carousel-rail-column-width, clamp(16rem, 72cqi, 20rem));
		align-items: start;
	}

	.carousel__scroller--rail .carousel__slide {
		min-height: auto;
	}

	.carousel__slide {
		position: relative;
		overflow: clip;
		display: grid;
		gap: var(--carousel-slide-gap);
		padding: var(--carousel-slide-padding);
		border-radius: var(--carousel-slide-radius);
		border: 1px solid var(--border-subtle);
		background: var(--carousel-slide-background);
		box-shadow: var(--carousel-slide-shadow);
		min-height: 0;
		align-self: start;
	}

	.carousel__slide--pinned {
		min-block-size: 100%;
	}

	.carousel__media {
		overflow: clip;
		border-radius: var(--carousel-media-radius);
		aspect-ratio: var(--carousel-media-aspect-ratio, 16 / 10);
		isolation: isolate;
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
	}

	.carousel__eyebrow {
		font-size: var(--carousel-eyebrow-size);
		font-weight: 700;
		letter-spacing: var(--carousel-eyebrow-tracking);
		text-transform: uppercase;
		color: var(--text-muted);
		font-family: var(--carousel-eyebrow-font, var(--font-ui, inherit));
	}

	.carousel__slide-title {
		margin: 0;
		font-size: var(--carousel-slide-title-size);
		font-family: var(--carousel-slide-title-font, var(--font-heading, inherit));
	}

	.carousel__slide-body {
		margin: 0;
		color: var(--text-muted);
		line-height: var(--carousel-slide-body-line-height);
		font-family: var(--carousel-slide-body-font, var(--font-body, inherit));
	}

	.carousel__dot {
		width: 11px;
		height: 11px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--border-subtle) 90%, transparent);
		border: 1px solid color-mix(in srgb, var(--surface-panel) 65%, white);
		transition: transform 180ms ease, background 180ms ease, box-shadow 180ms ease;
	}

	.carousel__dot[data-active="true"] {
		transform: scale(1.18);
		background: var(--surface-accent);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--surface-accent) 18%, transparent);
	}

	.carousel--peek-strip .carousel__scroller {
		grid-auto-columns: var(--carousel-peek-column-width, clamp(17rem, 29vw, 20rem));
	}

	.carousel--peek-strip .carousel__slide {
		gap: var(--carousel-peek-slide-gap, 12px);
		padding: var(--carousel-peek-slide-padding, 12px);
	}

	.carousel--peek-strip .carousel__media {
		aspect-ratio: var(--carousel-peek-media-aspect-ratio, 16 / 8.5);
	}

	.carousel--peek-strip .carousel__copy {
		gap: var(--carousel-peek-copy-gap, 6px);
	}

	.carousel--peek-strip .carousel__slide-body {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.carousel--editorial-stack .carousel__slide {
		grid-template-columns: minmax(220px, 0.95fr) minmax(0, 1.05fr);
		align-items: center;
	}

	.carousel--floating-cards .carousel__scroller {
		grid-auto-columns: var(--carousel-floating-column-width, clamp(15.5rem, 28vw, 19rem));
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

	.carousel__accent {
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

	.carousel__accent img {
		width: 100%;
		height: 100%;
		display: block;
	}

	.carousel--editorial-stack .carousel__scroller {
		grid-auto-columns: 100%;
	}
`;

export const createSharedStyles = (...styles) => [
	{ id: 'base', cssText: sharedDocumentStyles },
	{ id: 'shell', cssText: sharedShellStyles },
	...styles.map((cssText, index) => ({
		id: `extra-${index + 1}`,
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
