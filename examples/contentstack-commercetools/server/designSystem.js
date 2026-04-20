import { createDesignSystem, defineTheme } from 'react-islands-runtime/ssr';

import { createSharedStyles } from './baseStyles.js';
import { carouselStyles, productSearchStyles } from './componentStyles.js';
import { createExampleComponentDesignSystem } from '../../_shared/design-system/componentDesignSystem.js';

const contentstackCommercetoolsStyles = `
	[data-theme="contentstack-commercetools"] {
		--font-body: "Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
		--font-heading: "Avenir Next Condensed", "Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
		--font-ui: "Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
		--radius-surface: 18px;
		--radius-image: 12px;
		--radius-pill: 999px;
	}

	[data-theme="contentstack-commercetools"] body {
		background: #f7f5f3;
	}

	[data-theme="contentstack-commercetools"] .shell {
		max-width: 1440px;
		padding: 0 0 42px;
	}

	[data-theme="contentstack-commercetools"] .shell__header {
		width: 100%;
		max-width: none;
		margin-bottom: 0;
		padding: 0;
		overflow: hidden;
		background: #ffffff;
		border: 1px solid #d8d6d6;
		border-radius: 0;
		box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
	}

	[data-theme="contentstack-commercetools"] .shell__header::before {
		display: none;
	}

	[data-theme="contentstack-commercetools"] .shell__main {
		gap: 20px;
		padding: 12px 22px 0;
	}

	[data-theme="contentstack-commercetools"] .shell__footer {
		border: 0;
		background: transparent;
		box-shadow: none;
		color: #5c5458;
	}

	[data-theme="contentstack-commercetools"] .dw-header__utility {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem;
		width: 100vw;
		margin-left: calc(50% - 50vw);
		padding: 16px 26px;
		background: #b51b46;
		color: #fff;
	}

	[data-theme="contentstack-commercetools"] .dw-header__pickup {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.9rem 1.2rem;
		border-radius: 999px;
		background: rgba(137, 17, 53, 0.45);
		color: #fff;
		font: 700 0.98rem/1 var(--font-ui);
		text-decoration: none;
		white-space: nowrap;
	}

	[data-theme="contentstack-commercetools"] .dw-header__pickup-icon {
		display: inline-grid;
		place-items: center;
		inline-size: 1.35rem;
		block-size: 1.35rem;
		border: 1.5px solid currentColor;
		border-radius: 999px;
		font-size: 0.85rem;
		line-height: 1;
	}

	[data-theme="contentstack-commercetools"] .dw-header__search .search {
		background: transparent;
	}

	[data-theme="contentstack-commercetools"] .dw-header__account {
		justify-self: end;
		color: #fff;
		font: 700 0.98rem/1 var(--font-ui);
		text-decoration: none;
		white-space: nowrap;
	}

	[data-theme="contentstack-commercetools"] .dw-header__main {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 2rem;
		padding: 12px 26px;
		background: #ffffff;
		border-bottom: 1px solid #e4e1e2;
	}

	[data-theme="contentstack-commercetools"] .dw-header__logo {
		display: inline-flex;
		flex-direction: column;
		gap: 0.1rem;
		color: #1f171a;
		text-decoration: none;
	}

	[data-theme="contentstack-commercetools"] .dw-header__logo-mark {
		font-family: Georgia, "Times New Roman", serif;
		font-size: 3.2rem;
		font-weight: 700;
		letter-spacing: -0.08em;
		line-height: 0.9;
	}

	[data-theme="contentstack-commercetools"] .dw-header__logo-mark span {
		color: #b51b46;
		font-size: 0.55em;
		vertical-align: middle;
		margin-inline: 0.08em;
	}

	[data-theme="contentstack-commercetools"] .dw-header__logo-copy {
		font: 700 0.78rem/1.1 var(--font-ui);
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: #45393f;
	}

	[data-theme="contentstack-commercetools"] .dw-header__nav {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1.75rem;
	}

	[data-theme="contentstack-commercetools"] .dw-header__nav a {
		color: #241d20;
		font: 600 1rem/1 var(--font-ui);
		text-decoration: none;
	}

	[data-theme="contentstack-commercetools"] .dw-header__actions {
		display: inline-flex;
		align-items: center;
		gap: 0.8rem;
	}

	[data-theme="contentstack-commercetools"] .dw-header__cart {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		padding: 0.85rem 1.2rem;
		border-radius: 999px;
		background: #b51b46;
		color: #fff;
		font: 700 0.98rem/1 var(--font-ui);
		text-decoration: none;
	}

	[data-theme="contentstack-commercetools"] .dw-header__cart strong {
		display: inline-grid;
		place-items: center;
		inline-size: 1.5rem;
		block-size: 1.5rem;
		border-radius: 999px;
		background: #fff;
		color: #7f1635;
		font-size: 0.82rem;
	}

	[data-theme="contentstack-commercetools"] .dw-header__theme {
		display: none;
	}

	[data-theme="contentstack-commercetools"] .dw-header__subnav {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		gap: 0.55rem;
		padding: 10px 26px 12px;
		background: #ffffff;
		overflow-x: auto;
		overflow-y: hidden;
		scrollbar-width: thin;
		scrollbar-color: color-mix(in srgb, #b51b46 55%, #e4d8dc) #f2eeef;
	}

	[data-theme="contentstack-commercetools"] .dw-header__subnav::-webkit-scrollbar {
		height: 6px;
	}

	[data-theme="contentstack-commercetools"] .dw-header__subnav::-webkit-scrollbar-track {
		background: #f2eeef;
		border-radius: 999px;
	}

	[data-theme="contentstack-commercetools"] .dw-header__subnav::-webkit-scrollbar-thumb {
		background: linear-gradient(90deg, #c4436a, #9b163f);
		border-radius: 999px;
	}

	[data-theme="contentstack-commercetools"] .dw-header__subnav::-webkit-scrollbar-thumb:hover {
		background: linear-gradient(90deg, #d04e76, #b51b46);
	}

	[data-theme="contentstack-commercetools"] .dw-header__subnav a {
		padding: 0.5rem 0.75rem;
		border-radius: 6px;
		background: #f7f4f5;
		color: #30272b;
		font: 600 0.78rem/1 var(--font-ui);
		text-decoration: none;
		white-space: nowrap;
	}

	[data-theme="contentstack-commercetools"] .shell section {
		border-radius: 0;
		border: 0;
		background: transparent;
		box-shadow: none;
	}

	[data-theme="contentstack-commercetools"] .feature {
		padding: 0;
		overflow: hidden;
		background:
			radial-gradient(circle at top left, rgba(255, 255, 255, 0.45), transparent 34%),
			linear-gradient(90deg, #f7e5dc 0%, #fff4ef 38%, #fff 100%);
		border-color: #ead9d3;
		box-shadow: 0 10px 28px color-mix(in srgb, var(--surface-shadow) 8%, transparent);
	}

	[data-theme="contentstack-commercetools"] .feature__content {
		flex: 0.82 1 18rem;
		padding: 2.25rem 2rem;
		align-content: center;
	}

	[data-theme="contentstack-commercetools"] .feature__eyebrow {
		display: inline-block;
		padding: 0;
		background: none;
		border: 0;
		box-shadow: none;
		color: #8f5b4d;
	}

	[data-theme="contentstack-commercetools"] .feature__title {
		font-size: clamp(2.4rem, 4vw, 4rem);
		line-height: 0.94;
		letter-spacing: -0.055em;
		color: #1f4a34;
		max-width: 12ch;
	}

	[data-theme="contentstack-commercetools"] .feature__body {
		color: #725d61;
		max-width: 32rem;
	}

	[data-theme="contentstack-commercetools"] .feature__chips {
		margin-top: 10px;
	}

	[data-theme="contentstack-commercetools"] .feature__chip {
		background: #fff;
		border-color: #eadadd;
		box-shadow: none;
		color: #644b53;
	}

	[data-theme="contentstack-commercetools"] .feature__visual {
		flex: 1.18 1 18rem;
		padding: 1.1rem;
		grid-template-columns: minmax(0, 1fr);
	}

	[data-theme="contentstack-commercetools"] .feature__lead-card {
		background: #fff;
		border-radius: 14px;
		box-shadow: 0 8px 22px rgba(79, 45, 58, 0.08);
	}

	[data-theme="contentstack-commercetools"] .feature__support-card {
		background: #fff;
		border-radius: 14px;
		box-shadow: 0 8px 18px rgba(79, 45, 58, 0.06);
	}

	[data-theme="contentstack-commercetools"] .feature__supporting {
		grid-template-columns: repeat(2, minmax(0, 1fr));
		display: grid;
	}

	[data-theme="contentstack-commercetools"] .feature__product-name {
		color: #2f2830;
	}

	[data-theme="contentstack-commercetools"] .feature__product-price {
		color: #9b163f;
		font-weight: 700;
	}

	[data-theme="contentstack-commercetools"] .carousel__viewport {
		padding: 0;
		border-radius: 0;
		background: transparent;
		box-shadow: none;
	}

	[data-theme="contentstack-commercetools"] .carousel__header {
		margin-bottom: 0.8rem;
	}

	[data-theme="contentstack-commercetools"] .carousel__title {
		font-size: 1.22rem;
		letter-spacing: -0.03em;
		color: #2d2428;
	}

	[data-theme="contentstack-commercetools"] .carousel--spotlight-dots .carousel__slide {
		background: #fff;
	}

	[data-theme="contentstack-commercetools"] .carousel__slide {
		border-radius: 12px;
		border: 1px solid #e4dadd;
		background: #fff;
		box-shadow: 0 5px 14px rgba(66, 43, 52, 0.07);
	}

	[data-theme="contentstack-commercetools"] .carousel__media {
		aspect-ratio: 4 / 3;
		border-radius: 12px 12px 0 0;
	}

	[data-theme="contentstack-commercetools"] .carousel__copy {
		padding: 0.95rem 1rem 1.05rem;
	}

	[data-theme="contentstack-commercetools"] .carousel__slide-title {
		font-size: 1.02rem;
		line-height: 1.08;
		color: #31282d;
	}

	[data-theme="contentstack-commercetools"] .carousel__slide-body {
		font-size: 0.84rem;
		line-height: 1.45;
		color: #6d5e66;
	}

	[data-theme="contentstack-commercetools"] .carousel__eyebrow {
		color: #8f6d75;
	}

	[data-theme="contentstack-commercetools"] .carousel__control {
		inline-size: 2rem;
		block-size: 2rem;
		border-radius: 999px;
		background: #fff;
		border-color: #e4d8dc;
		box-shadow: none;
		color: #7f5b67;
	}

	[data-theme="contentstack-commercetools"] .carousel__dot[data-active="true"] {
		background: var(--surface-accent);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--surface-accent) 14%, transparent);
	}

	[data-theme="contentstack-commercetools"] .grid-items {
		--grid-items-card-bg: #fff;
		--grid-items-card-text: var(--text-primary);
		--grid-items-card-muted: #6b5d64;
		--grid-items-price-bg: #fff7cc;
		--grid-items-price-border: #f0cf4d;
		--grid-items-price-text: #553b08;
		--grid-items-card-shadow: rgba(67, 45, 53, 0.08);
		--grid-items-image-overlay-top: transparent;
		--grid-items-image-overlay-bottom: transparent;
		--grid-items-image-overlay-mid: transparent;
		--grid-items-card-radius: 14px;
		--grid-items-card-border: #e3dade;
		--grid-items-card-gap: 0.95rem;
		--grid-items-card-padding: 1rem;
		--grid-items-title-size: clamp(1.2rem, 1.8vw, 1.5rem);
		--grid-items-item-title-size: 1rem;
		--grid-items-meta-size: 0.82rem;
		--grid-items-link-size: 0.78rem;
		--grid-items-min-height: 18rem;
		--grid-items-feature-height: 24rem;
		display: grid;
		gap: 1rem;
	}

	[data-theme="contentstack-commercetools"] .grid-items__header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
	}

	[data-theme="contentstack-commercetools"] .grid-items__title {
		margin: 0;
		font-size: var(--grid-items-title-size);
		line-height: 1.05;
		letter-spacing: -0.04em;
		font-family: var(--font-heading);
	}

	[data-theme="contentstack-commercetools"] .grid-items__link {
		font-family: var(--font-ui);
		font-size: var(--grid-items-link-size);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		text-decoration: none;
	}

	[data-theme="contentstack-commercetools"] .grid-items__layout {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(16rem, 100%), 1fr));
		gap: var(--grid-items-card-gap);
	}

	[data-theme="contentstack-commercetools"] .grid-items__card {
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

	[data-theme="contentstack-commercetools"] .grid-items[data-grid-items-layout="even"] .grid-items__card {
		grid-column: auto;
	}

	[data-theme="contentstack-commercetools"] .grid-items__card--feature {
		grid-column: auto;
		min-height: var(--grid-items-feature-height);
	}

	[data-theme="contentstack-commercetools"] .grid-items__card--supporting {
		grid-column: auto;
	}

	[data-theme="contentstack-commercetools"] .grid-items__media {
		position: relative;
		inset: auto;
		aspect-ratio: 1 / 1;
	}

	[data-theme="contentstack-commercetools"] .grid-items__media::after {
		display: none;
	}

	[data-theme="contentstack-commercetools"] .grid-items__media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	[data-theme="contentstack-commercetools"] .grid-items__content {
		position: relative;
		display: grid;
		gap: 0.35rem;
		padding: var(--grid-items-card-padding);
	}

	[data-theme="contentstack-commercetools"] .grid-items__eyebrow {
		font-family: var(--font-ui);
		font-size: 0.74rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--grid-items-card-text) 82%, transparent);
	}

	[data-theme="contentstack-commercetools"] .grid-items__price {
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
		box-shadow: none;
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
	}

	[data-theme="contentstack-commercetools"] .grid-items__item-title {
		margin: 0;
		font-size: var(--grid-items-item-title-size);
		line-height: 1.02;
		letter-spacing: -0.04em;
		font-family: var(--font-heading);
	}

	[data-theme="contentstack-commercetools"] .grid-items__meta {
		display: grid;
		gap: 0.15rem;
		margin-top: 0.25rem;
	}

	[data-theme="contentstack-commercetools"] .grid-items__meta-line {
		font-family: var(--font-ui);
		font-size: var(--grid-items-meta-size);
		color: var(--grid-items-card-muted);
	}

	[data-theme="contentstack-commercetools"] .plp-products__layout {
		grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
		gap: 14px;
	}

	[data-theme="contentstack-commercetools"] .plp-products__card {
		display: flex;
		align-items: stretch;
		min-height: 182px;
		padding: 12px;
		background: #fff;
		border-radius: 14px;
		box-shadow: 0 6px 16px rgba(68, 46, 55, 0.06);
	}

	[data-theme="contentstack-commercetools"] .plp-products__media {
		flex: 0 0 108px;
		inline-size: 108px;
		block-size: 152px;
		border-radius: 14px;
		box-shadow: inset 0 1px 0 color-mix(in srgb, white 42%, transparent);
	}

	[data-theme="contentstack-commercetools"] .plp-products__content {
		align-content: center;
	}

	[data-theme="contentstack-commercetools"] .plp-products__content--compact {
		gap: 4px;
	}

	[data-theme="contentstack-commercetools"] .plp-products__price {
		border: 1px solid #ead7de;
		background: #fff;
		color: #9b163f;
		box-shadow: none;
	}

	[data-theme="contentstack-commercetools"] .plp-products__item-title {
		font-size: 0.91rem;
		line-height: 1.08;
		font-family: var(--font-heading);
	}

	[data-theme="contentstack-commercetools"] .plp-products__description {
		font-family: var(--font-ui);
		font-size: 0.8rem;
		line-height: 1.35;
		color: var(--grid-items-card-muted);
	}

	[data-theme="contentstack-commercetools"] .plp-products__more {
		border-color: #d7c4cb;
		background: #faf6f7;
		color: #7d1c3f;
		box-shadow: none;
	}

	[data-theme="contentstack-commercetools"] .product-detail__layout {
		grid-template-columns: minmax(18rem, 0.9fr) minmax(0, 1.55fr);
		gap: 28px;
	}

	[data-theme="contentstack-commercetools"] .product-detail__media-frame {
		min-height: 29rem;
		border-radius: 16px;
		border: 1px solid #e3dade;
		background: #fff;
		box-shadow: 0 10px 24px rgba(66, 43, 52, 0.07);
	}

	[data-theme="contentstack-commercetools"] .product-detail__empty {
		font-family: var(--font-body);
		font-size: clamp(1.25rem, 2.4vw, 1.95rem);
		color: color-mix(in srgb, var(--text-muted) 76%, white);
	}

	[data-theme="contentstack-commercetools"] .product-detail__content {
		padding-top: 14px;
		gap: 18px;
	}

	[data-theme="contentstack-commercetools"] .product-detail__title {
		font-family: var(--font-heading);
		font-size: clamp(2.4rem, 4.6vw, 4.15rem);
		line-height: 0.94;
		letter-spacing: -0.055em;
	}

	[data-theme="contentstack-commercetools"] .product-detail__sku {
		font-family: var(--font-body);
		font-size: 1rem;
	}

	[data-theme="contentstack-commercetools"] .product-detail__subtitle,
	[data-theme="contentstack-commercetools"] .product-detail__description {
		font-family: var(--font-body);
		font-size: 1rem;
		line-height: 1.6;
		color: color-mix(in srgb, var(--text-primary) 88%, white);
	}

	[data-theme="contentstack-commercetools"] .product-detail__price {
		font-family: var(--font-heading);
		font-size: clamp(2rem, 3vw, 2.8rem);
		letter-spacing: -0.045em;
		color: #9b163f;
	}

	[data-theme="contentstack-commercetools"] .retail-home {
		display: grid;
		gap: 1.15rem;
	}

	[data-theme="contentstack-commercetools"] .retail-hero {
		display: flex;
		flex-wrap: wrap;
		gap: 0;
		overflow: hidden;
		padding: 0;
		border: 1px solid #ead8d0;
		border-radius: 10px;
		background: linear-gradient(90deg, #f6dfcf 0%, #faeee5 42%, #fff5f0 100%);
		box-shadow: 0 2px 8px rgba(61, 35, 44, 0.05);
	}

	[data-theme="contentstack-commercetools"] .retail-hero__content {
		flex: 0.92 1 16rem;
		display: grid;
		align-content: center;
		gap: 0.85rem;
		padding: 2.3rem 2.2rem;
	}

	[data-theme="contentstack-commercetools"] .retail-hero__eyebrow {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #905f53;
		font-family: var(--font-ui);
	}

	[data-theme="contentstack-commercetools"] .retail-hero__title {
		margin: 0;
		max-width: 7ch;
		font-family: var(--font-heading);
		font-size: clamp(3rem, 6vw, 5rem);
		line-height: 0.88;
		letter-spacing: -0.065em;
		color: #144233;
		text-transform: uppercase;
	}

	[data-theme="contentstack-commercetools"] .retail-hero__body {
		margin: 0;
		max-width: 30rem;
		font-size: 1rem;
		line-height: 1.55;
		color: #6b5960;
		font-family: var(--font-body);
	}

	[data-theme="contentstack-commercetools"] .retail-hero__cta {
		display: inline-flex;
		justify-self: start;
		align-items: center;
		padding: 0.7rem 1rem;
		border-radius: 8px;
		background: #bf214c;
		color: #fff;
		text-decoration: none;
		font-size: 0.84rem;
		font-weight: 700;
		font-family: var(--font-ui);
	}

	[data-theme="contentstack-commercetools"] .retail-hero__visual {
		flex: 1.08 1 16rem;
		min-height: 320px;
	}

	[data-theme="contentstack-commercetools"] .retail-hero__visual img {
		width: 100%;
		height: 100%;
		display: block;
		object-fit: cover;
	}

	[data-theme="contentstack-commercetools"] .retail-category-bar {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
		padding: 0;
		margin: 0 0 0.2rem;
	}

	[data-theme="contentstack-commercetools"] .retail-category-bar a {
		display: inline-flex;
		align-items: center;
		padding: 0.5rem 0.85rem;
		border-radius: 999px;
		border: 1px solid #e4d9dc;
		background: #fff;
		color: #59484f;
		font-size: 0.76rem;
		text-decoration: none;
		font-family: var(--font-ui);
	}

	[data-theme="contentstack-commercetools"] .retail-search {
		padding: 0;
		background: transparent;
		border: 0;
		box-shadow: none;
	}

	[data-theme="contentstack-commercetools"] .retail-section-heading {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.8rem;
		margin-bottom: 0.9rem;
	}

	[data-theme="contentstack-commercetools"] .retail-section-heading h2 {
		margin: 0;
		font-family: var(--font-heading);
		font-size: 1.08rem;
		letter-spacing: -0.03em;
	}

	[data-theme="contentstack-commercetools"] .retail-section-heading a {
		font-size: 0.76rem;
		font-weight: 700;
		color: #5d474f;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		text-decoration: none;
	}

	[data-theme="contentstack-commercetools"] .retail-top-deals,
	[data-theme="contentstack-commercetools"] .retail-rewards,
	[data-theme="contentstack-commercetools"] .retail-explore,
	[data-theme="contentstack-commercetools"] .retail-value-props {
		padding: 0;
	}

	[data-theme="contentstack-commercetools"] .retail-top-deals__grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(14rem, 100%), 1fr));
		gap: 0.8rem;
	}

	[data-theme="contentstack-commercetools"] .retail-offer-card,
	[data-theme="contentstack-commercetools"] .retail-product-card {
		display: grid;
		align-content: start;
		background: #fff;
		border: 1px solid #e7dde0;
		border-radius: 8px;
		text-decoration: none;
		color: #241d20;
		overflow: hidden;
		box-shadow: 0 1px 4px rgba(61, 35, 44, 0.05);
	}

	[data-theme="contentstack-commercetools"] .retail-offer-card {
		padding: 1.25rem 1rem 1rem;
		background: linear-gradient(180deg, #ffec67 0%, #ffd94e 100%);
	}

	[data-theme="contentstack-commercetools"] .retail-offer-card__eyebrow {
		font: 700 0.68rem/1 var(--font-ui);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #5a4614;
	}

	[data-theme="contentstack-commercetools"] .retail-offer-card h3 {
		margin: 0.45rem 0 0;
		font-family: var(--font-heading);
		font-size: 1.7rem;
		line-height: 0.94;
		letter-spacing: -0.05em;
	}

	[data-theme="contentstack-commercetools"] .retail-offer-card p {
		margin: 0.55rem 0 0;
		font: 500 0.82rem/1.45 var(--font-ui);
		color: #4d3c22;
	}

	[data-theme="contentstack-commercetools"] .retail-offer-card span {
		display: inline-flex;
		justify-self: start;
		margin-top: 1rem;
		padding: 0.55rem 0.85rem;
		border-radius: 6px;
		background: #b71d47;
		color: #fff;
		font: 700 0.74rem/1 var(--font-ui);
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	[data-theme="contentstack-commercetools"] .retail-product-card__media {
		position: relative;
		aspect-ratio: 1 / 1;
		background: #fbf8f7;
	}

	[data-theme="contentstack-commercetools"] .retail-product-card__media img {
		width: 100%;
		height: 100%;
		display: block;
		object-fit: contain;
		padding: 0.85rem;
	}

	[data-theme="contentstack-commercetools"] .retail-product-card__badge {
		position: absolute;
		top: 0.5rem;
		left: 0.5rem;
		z-index: 1;
		padding: 0.28rem 0.52rem;
		border-radius: 999px;
		background: #ffe055;
		color: #533d06;
		font: 800 0.64rem/1 var(--font-ui);
	}

	[data-theme="contentstack-commercetools"] .retail-product-card__body {
		display: grid;
		gap: 0.35rem;
		padding: 0.85rem 0.85rem 0.95rem;
	}

	[data-theme="contentstack-commercetools"] .retail-product-card__eyebrow {
		font: 700 0.66rem/1.2 var(--font-ui);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #b21d47;
	}

	[data-theme="contentstack-commercetools"] .retail-product-card__title {
		margin: 0;
		font-family: var(--font-ui);
		font-size: 0.98rem;
		line-height: 1.16;
		letter-spacing: -0.02em;
	}

	[data-theme="contentstack-commercetools"] .retail-product-card__price {
		font: 800 0.96rem/1 var(--font-ui);
		color: #251d20;
	}

	[data-theme="contentstack-commercetools"] .retail-product-card__meta {
		margin: 0;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		font: 500 0.74rem/1.45 var(--font-ui);
		color: #65585e;
	}

	[data-theme="contentstack-commercetools"] .retail-product-card__cta {
		display: inline-flex;
		justify-self: start;
		align-items: center;
		margin-top: 0.35rem;
		padding: 0.55rem 0.8rem;
		border-radius: 6px;
		background: #b71d47;
		color: #fff;
		font: 700 0.72rem/1 var(--font-ui);
	}

	[data-theme="contentstack-commercetools"] .retail-product-card--compact .retail-product-card__media {
		aspect-ratio: 0.9 / 1;
	}

	[data-theme="contentstack-commercetools"] .retail-recipes {
		padding: 1rem;
	}

	[data-theme="contentstack-commercetools"] .retail-recipes__grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(16rem, 100%), 1fr));
		gap: 0.8rem;
	}

	[data-theme="contentstack-commercetools"] .retail-recipes__lead,
	[data-theme="contentstack-commercetools"] .retail-recipes__card {
		position: relative;
		overflow: hidden;
		min-height: 250px;
		border-radius: 10px;
		background: #e9e3df;
	}

	[data-theme="contentstack-commercetools"] .retail-recipes__lead img,
	[data-theme="contentstack-commercetools"] .retail-recipes__card img {
		width: 100%;
		height: 100%;
		display: block;
		object-fit: cover;
	}

	[data-theme="contentstack-commercetools"] .retail-recipes__overlay {
		position: absolute;
		inset: auto 0 0;
		display: grid;
		gap: 0.2rem;
		padding: 1rem;
		background: linear-gradient(180deg, transparent, rgba(20, 17, 19, 0.78));
		color: #fff;
	}

	[data-theme="contentstack-commercetools"] .retail-recipes__kicker {
		font-size: 1.15rem;
		font-weight: 700;
		letter-spacing: -0.03em;
		font-family: var(--font-heading);
	}

	[data-theme="contentstack-commercetools"] .retail-recipes__meta {
		font-size: 0.78rem;
		font-family: var(--font-ui);
		color: rgba(255, 255, 255, 0.88);
	}

	[data-theme="contentstack-commercetools"] .retail-promo-tiles {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(16rem, 100%), 1fr));
		gap: 0.8rem;
	}

	[data-theme="contentstack-commercetools"] .retail-promo-tiles__tile {
		display: grid;
		align-content: end;
		gap: 0.8rem;
		min-height: 220px;
		padding: 1.25rem;
		border-radius: 8px;
		color: #fff;
	}

	[data-theme="contentstack-commercetools"] .retail-promo-tiles__tile h3 {
		margin: 0;
		max-width: 7ch;
		font-family: var(--font-heading);
		font-size: 2rem;
		line-height: 0.92;
		letter-spacing: -0.05em;
		text-transform: uppercase;
	}

	[data-theme="contentstack-commercetools"] .retail-promo-tiles__tile a {
		display: inline-flex;
		justify-self: start;
		align-items: center;
		padding: 0.55rem 0.85rem;
		border-radius: 6px;
		background: #fff;
		color: #2c2025;
		text-decoration: none;
		font-size: 0.76rem;
		font-weight: 700;
		font-family: var(--font-ui);
	}

	[data-theme="contentstack-commercetools"] .retail-promo-tiles__tile--berry {
		background: linear-gradient(140deg, #9e183f, #b31e4a 60%, #741532);
	}

	[data-theme="contentstack-commercetools"] .retail-promo-tiles__tile--peach {
		background: linear-gradient(140deg, #f47d59, #e56546 58%, #cb503d);
	}

	[data-theme="contentstack-commercetools"] .retail-promo-tiles__tile--teal {
		background: linear-gradient(140deg, #4f9d97, #438a88 58%, #387775);
	}

	[data-theme="contentstack-commercetools"] .retail-banner {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.2rem 1.4rem;
		border-radius: 10px;
		background: linear-gradient(90deg, #8d153a, #b41f4b 52%, #8c1539);
		color: #fff;
	}

	[data-theme="contentstack-commercetools"] .retail-banner__copy {
		display: grid;
		gap: 0.3rem;
	}

	[data-theme="contentstack-commercetools"] .retail-banner__copy h2 {
		margin: 0;
		font-family: var(--font-heading);
		font-size: 1.3rem;
		letter-spacing: -0.03em;
	}

	[data-theme="contentstack-commercetools"] .retail-banner__copy p {
		margin: 0;
		font-family: var(--font-body);
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.88);
	}

	[data-theme="contentstack-commercetools"] .retail-banner__actions {
		display: inline-flex;
		flex-wrap: wrap;
		gap: 0.65rem;
	}

	[data-theme="contentstack-commercetools"] .retail-banner__actions a {
		display: inline-flex;
		align-items: center;
		padding: 0.65rem 0.95rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.14);
		color: #fff;
		text-decoration: none;
		font-size: 0.78rem;
		font-weight: 700;
		font-family: var(--font-ui);
		border: 1px solid rgba(255, 255, 255, 0.22);
	}

	[data-theme="contentstack-commercetools"] .retail-rewards__grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(10rem, 100%), 1fr));
		gap: 1rem;
	}

	[data-theme="contentstack-commercetools"] .retail-reward {
		display: grid;
		justify-items: center;
		gap: 0.55rem;
		padding: 0.6rem 0.5rem;
		text-align: center;
	}

	[data-theme="contentstack-commercetools"] .retail-reward__ring {
		--retail-reward-track: #ebdfdf;
		--retail-reward-fill: #b51b46;
		display: grid;
		place-items: center;
		inline-size: 108px;
		block-size: 108px;
		border-radius: 999px;
		background:
			radial-gradient(circle at center, #fff 56%, transparent 57%),
			conic-gradient(var(--retail-reward-fill) 0deg var(--retail-reward-progress), var(--retail-reward-track) var(--retail-reward-progress) 360deg);
	}

	[data-theme="contentstack-commercetools"] .retail-reward__center {
		font: 800 0.94rem/1 var(--font-ui);
		color: #392a30;
	}

	[data-theme="contentstack-commercetools"] .retail-reward h3 {
		margin: 0;
		font: 700 0.86rem/1.2 var(--font-ui);
		color: #241d20;
	}

	[data-theme="contentstack-commercetools"] .retail-reward p {
		margin: 0;
		max-width: 20ch;
		font: 500 0.72rem/1.45 var(--font-ui);
		color: #685b61;
	}

	[data-theme="contentstack-commercetools"] .retail-explore__grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(6rem, 100%), 1fr));
		gap: 0.9rem;
	}

	[data-theme="contentstack-commercetools"] .retail-explore__item {
		display: grid;
		justify-items: center;
		gap: 0.6rem;
		text-decoration: none;
		color: #2b2226;
	}

	[data-theme="contentstack-commercetools"] .retail-explore__image {
		display: grid;
		place-items: center;
		inline-size: 88px;
		block-size: 88px;
		border-radius: 999px;
		background: #fff;
		border: 1px solid #e7dde0;
		overflow: hidden;
	}

	[data-theme="contentstack-commercetools"] .retail-explore__image img {
		width: 100%;
		height: 100%;
		display: block;
		object-fit: contain;
		padding: 0.7rem;
	}

	[data-theme="contentstack-commercetools"] .retail-explore__label {
		font: 600 0.74rem/1.2 var(--font-ui);
		text-align: center;
	}

	[data-theme="contentstack-commercetools"] .retail-value-props__grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(18rem, 100%), 1fr));
		gap: 0.8rem;
	}

	[data-theme="contentstack-commercetools"] .retail-value-props__card {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 132px;
		align-items: stretch;
		overflow: hidden;
		border-radius: 8px;
		min-height: 160px;
		color: #fff;
	}

	[data-theme="contentstack-commercetools"] .retail-value-props__card--berry {
		background: linear-gradient(135deg, #98173f, #b41f4a);
	}

	[data-theme="contentstack-commercetools"] .retail-value-props__card--rose {
		background: linear-gradient(135deg, #b3214d, #842348);
	}

	[data-theme="contentstack-commercetools"] .retail-value-props__card--plum {
		background: linear-gradient(135deg, #8f1740, #5f1f45);
	}

	[data-theme="contentstack-commercetools"] .retail-value-props__copy {
		display: grid;
		align-content: end;
		gap: 0.5rem;
		padding: 1rem;
	}

	[data-theme="contentstack-commercetools"] .retail-value-props__eyebrow {
		font: 700 0.68rem/1 var(--font-ui);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.78);
	}

	[data-theme="contentstack-commercetools"] .retail-value-props__card h3 {
		margin: 0;
		max-width: 12ch;
		font-family: var(--font-heading);
		font-size: 1.55rem;
		line-height: 0.96;
		letter-spacing: -0.04em;
	}

	[data-theme="contentstack-commercetools"] .retail-value-props__card img {
		width: 100%;
		height: 100%;
		display: block;
		object-fit: cover;
	}

`;

const theme = defineTheme({
	name: 'contentstack-commercetools',
	colorScheme: 'light',
	themeColor: '#f5f1ed',
	tokens: {
		surface: {
			canvas: '#f5f1ed',
			muted: '#efe8e4',
			panel: '#ffffff',
			accent: '#a71d44',
			shadow: '#4c3941',
		},
		text: {
			primary: '#2d2228',
			muted: '#6d6166',
		},
		border: {
			subtle: '#ddd2d6',
		},
		interactive: {
			link: '#9d183f',
			linkHover: '#72112e',
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
			contentMax: '78rem',
			shellPaddingBlockStart: '1rem',
			shellPaddingInline: '1rem',
			shellPaddingBlockEnd: '2rem',
			headerGap: '1rem',
			stackGap: '1.4rem',
			sectionPadding: '1rem',
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
		htmlAttrs: { 'data-theme': 'contentstack-commercetools' },
		styles: createSharedStyles(contentstackCommercetoolsStyles, carouselStyles, productSearchStyles),
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

export const demoComponentDesignSystem = createExampleComponentDesignSystem('contentstack-commercetools', {
	components: {
		all: {
			vars: {
				'font-body': '"Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
				'font-heading':
					'"Avenir Next Condensed", "Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
				'font-ui': '"Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
			},
		},
		featureSplitBlock: {
			vars: {
				'feature-gap': '0',
				'feature-content-gap': '0.9rem',
				'feature-title-size': 'clamp(2.8rem, 5vw, 4.9rem)',
				'feature-title-line-height': '0.88',
				'feature-title-tracking': '-0.065em',
				'feature-title-font': 'var(--font-heading)',
				'feature-body-size': '1rem',
				'feature-body-line-height': '1.55',
				'feature-body-font': 'var(--font-body)',
				'feature-eyebrow-size': '0.72rem',
				'feature-eyebrow-tracking': '0.16em',
				'feature-chip-size': '0.78rem',
				'feature-chip-padding-block': '0.65rem',
				'feature-chip-padding-inline': '0.95rem',
				'feature-visual-gap': '0.85rem',
				'feature-visual-padding': '1rem',
				'feature-card-gap': '0.85rem',
				'feature-card-padding': '1rem',
				'radius-card': '12px',
			},
		},
		gridItemsBlock: {
			vars: {
				'grid-items-gap': '1rem',
				'grid-items-layout-gap': '0.9rem',
				'grid-items-card-gap': '0',
				'grid-items-card-padding': '0',
				'grid-items-card-radius': '10px',
				'grid-items-card-border': '#e6dde0',
				'grid-items-card-background': '#fff',
				'grid-items-card-shadow': '0 2px 8px rgba(72, 43, 53, 0.06)',
				'grid-items-title-size': '1.08rem',
				'grid-items-title-tracking': '-0.03em',
				'grid-items-link-size': '0.74rem',
				'grid-items-link-tracking': '0.08em',
				'grid-items-feature-span': '4',
				'grid-items-supporting-span': '2',
				'grid-items-even-span': '2',
				'grid-items-feature-min-height': '23rem',
				'grid-items-media-radius': '0',
				'grid-items-content-gap': '0.38rem',
				'grid-items-eyebrow-size': '0.7rem',
				'grid-items-price-size': '0.95rem',
				'grid-items-item-title-size': '0.98rem',
				'grid-items-item-title-line-height': '1.02',
				'grid-items-item-title-tracking': '-0.04em',
				'grid-items-meta-gap': '0.14rem',
				'grid-items-meta-size': '0.78rem',
			},
		},
		plpProductsBlock: {
			vars: {
				'plp-products-gap': '1rem',
				'plp-products-title-size': '1.12rem',
				'plp-products-link-size': '0.74rem',
				'plp-products-layout-min': '15.5rem',
				'plp-products-layout-gap': '0.95rem',
				'plp-products-card-gap': '0.8rem',
				'plp-products-card-min-height': '196px',
				'plp-products-card-padding': '0.8rem',
				'plp-products-card-radius': '10px',
				'plp-products-card-border': '#e6dde0',
				'plp-products-card-background': '#fff',
				'plp-products-card-shadow': '0 2px 8px rgba(72, 43, 53, 0.06)',
				'plp-products-media-width': '126px',
				'plp-products-media-height': '166px',
				'plp-products-media-radius': '8px',
				'plp-products-content-gap': '0.32rem',
				'plp-products-eyebrow-size': '0.68rem',
				'plp-products-price-size': '0.9rem',
				'plp-products-item-title-size': '0.98rem',
				'plp-products-item-title-line-height': '1.02',
				'plp-products-description-size': '0.8rem',
				'plp-products-description-line-height': '1.32',
				'plp-products-more-size': '0.74rem',
			},
		},
		productDetailBlock: {
			vars: {
				'product-detail-gap': '2rem',
				'product-detail-media-min-height': '30rem',
				'product-detail-media-radius': '12px',
				'product-detail-content-gap': '1rem',
				'product-detail-title-size': 'clamp(2.3rem, 4.4vw, 4.3rem)',
				'product-detail-title-line-height': '0.9',
				'product-detail-title-tracking': '-0.06em',
				'product-detail-price-size': 'clamp(2rem, 3vw, 2.9rem)',
			},
		},
		productSearch: {
			vars: {
				'search-surface-bg': '#ffffff',
				'search-surface-border': '#ffffff',
				'search-surface-radius': '999px',
				'search-surface-padding': '5px 8px 5px 16px',
				'search-focus-border': '#ffffff',
				'search-focus-ring': 'rgba(255, 255, 255, 0.16)',
				'search-input-padding-block': '10px',
				'search-input-padding-inline': '6px',
				'search-input-font-size': '0.96rem',
				'search-button-size': '42px',
				'search-button-radius': '999px',
				'search-button-bg': '#ffffff',
				'search-button-bg-hover': '#f4edf0',
				'search-button-text': '#47363d',
				'search-dropdown-radius': '10px',
				'search-dropdown-shadow': '0 10px 22px rgba(60, 34, 43, 0.1)',
				'search-item-image-size': '48px',
				'search-item-image-radius': '8px',
			},
		},
		themeModeSwitch: {
			vars: {
				'theme-switch-gap': '0.75rem',
				'theme-switch-padding-block': '0.35rem',
				'theme-switch-padding-inline-start': '0.95rem',
				'theme-switch-padding-inline-end': '0.45rem',
				'theme-switch-label-size': '0.72rem',
				'theme-switch-label-tracking': '0.14em',
				'theme-switch-option-gap': '0.25rem',
				'theme-switch-option-padding': '0.2rem',
				'theme-switch-button-padding-block': '0.7rem',
				'theme-switch-button-padding-inline': '1rem',
				'theme-switch-button-size': '0.92rem',
			},
		},
		carouselBlock: {
			vars: {
				'carousel-gap': '0.9rem',
				'carousel-header-gap': '0.8rem',
				'carousel-title-size': '1.08rem',
				'carousel-control-size': '1.95rem',
				'carousel-control-font-size': '1rem',
				'carousel-viewport-padding-block-start': '0',
				'carousel-viewport-padding-inline': '0',
				'carousel-viewport-padding-block-end': '8px',
				'carousel-layout-gap': '0.9rem',
				'carousel-scroller-gap': '0.9rem',
				'carousel-slide-gap': '0',
				'carousel-slide-padding': '0',
				'carousel-slide-radius': '10px',
				'carousel-slide-background': '#fff',
				'carousel-slide-shadow': '0 2px 8px rgba(72, 43, 53, 0.06)',
				'carousel-media-radius': '10px 10px 0 0',
				'carousel-copy-gap': '0.35rem',
				'carousel-eyebrow-size': '0.68rem',
				'carousel-slide-title-size': '0.98rem',
				'carousel-slide-body-line-height': '1.35',
				'carousel-peek-column-width': 'clamp(15rem, 25vw, 17rem)',
				'carousel-peek-slide-gap': '0',
				'carousel-peek-slide-padding': '0',
				'carousel-peek-media-aspect-ratio': '4 / 3',
				'carousel-peek-copy-gap': '0.35rem',
				'carousel-peek-desktop-columns': 'calc((100% - 54px) / 4)',
				'carousel-floating-column-width': 'clamp(14.5rem, 24vw, 17rem)',
				'carousel-floating-desktop-columns': 'calc((100% - 54px) / 4)',
			},
		},
	},
});
export const { features: demoFeatures } = createDesignSystem(theme);
