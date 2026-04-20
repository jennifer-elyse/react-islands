import React from 'react';
import { Island, resolveIslandModule } from 'react-islands-runtime/ssr';

import {
	CarouselBlock,
	CartSSR,
	FeatureSplitBlock,
	GridItemsBlock,
	ProductSearchSSR,
} from 'react-islands-ui';
import { getCarouselBlock, getCarouselSlidesFromProducts } from '../../../../_shared/carousels.js';
import {
	ensureBlock,
	moveBlockAfter,
	moveBlockToFront,
	normalizeHomepageBlocks,
} from '../../../../_shared/homepageBlocks.js';
import { demoComponentDesignSystem } from '../../../server/designSystem.js';
import { getLandingPage, getHeroBanners } from '../../../models/contentstack.model.js';
import { getLocalProductFallbackImage, getPreferredProductImage } from '../../../models/localImages.js';
import { listProducts } from '../../../models/product.model.js';

const buildHomepageProducts = (products = []) =>
	(Array.isArray(products) ? products : []).filter(Boolean).map((product, index) => {
		const localFallbackImage = getLocalProductFallbackImage(product || index);
		const preferredImage = getPreferredProductImage({
			...product,
			localFallbackImage,
		});
		const sourceImages = Array.isArray(product?.images) ? product.images.filter(Boolean) : [];

		return {
			...product,
			imageUrl: preferredImage,
			images: sourceImages.length ? sourceImages : [preferredImage].filter(Boolean),
			localFallbackImage,
		};
	});

const getProductHref = (product) => `/products/${product?.slug || product?.sku || product?.id}`;

const getProductPrice = (product) => product?.price?.display || '$3.99';

const getProductImage = (product, index = 0) =>
	product?.imageUrl ||
	product?.images?.[0] ||
	getPreferredProductImage({ ...product, localFallbackImage: getLocalProductFallbackImage(product || index) });

const RetailSectionFrame = ({
	title,
	href = '/products',
	label = 'View all',
	children,
	bodyClassName = '',
	className = '',
}) => (
	<section className={`retail-frame ${className}`.trim()}>
		<div className="retail-frame__header">
			<h2>{title}</h2>
			<a href={href}>{label}</a>
		</div>
		<div className={`retail-frame__body ${bodyClassName}`.trim()}>{children}</div>
	</section>
);

const RetailProductCard = ({ product, eyebrow, badge, compact = false, featured = false }) => (
	<a
		className={`retail-product-card${compact ? ' retail-product-card--compact' : ''}${featured ? ' retail-product-card--featured' : ''}`}
		href={getProductHref(product)}
	>
		<div className="retail-product-card__media">
			{badge ? <span className="retail-product-card__badge">{badge}</span> : null}
			<img src={getProductImage(product)} alt={product?.name || 'Product'} />
		</div>
		<div className="retail-product-card__body">
			{eyebrow ? <div className="retail-product-card__eyebrow">{eyebrow}</div> : null}
			<h3 className="retail-product-card__title">{product?.name || 'Fresh pick'}</h3>
			<div className="retail-product-card__price">{getProductPrice(product)}</div>
			<p className="retail-product-card__meta">{product?.description || 'Fresh market picks for the week.'}</p>
			<span className="retail-product-card__cta">Add to cart</span>
		</div>
	</a>
);

const RetailOfferCard = ({ title, body, href = '/products', tone = 'berry' }) => (
	<a className={`retail-offer-card retail-offer-card--${tone}`} href={href}>
		<div className="retail-offer-card__eyebrow">Fresh Picks</div>
		<h3>{title}</h3>
		<p>{body}</p>
		<span>Shop now</span>
	</a>
);

const RetailReward = ({ label, amount, progress = 0.76 }) => (
	<article className="retail-reward">
		<div className="retail-reward__ring" style={{ '--retail-reward-progress': `${Math.round(progress * 360)}deg` }}>
			<div className="retail-reward__center">${amount}</div>
		</div>
		<h3>{label}</h3>
		<p>Earn points on every order and unlock extra savings on your next visit.</p>
	</article>
);

const RetailExploreIcon = ({ product, label }) => (
	<a className="retail-explore__item" href={getProductHref(product)}>
		<span className="retail-explore__image">
			<img src={getProductImage(product)} alt={label} />
		</span>
		<span className="retail-explore__label">{label}</span>
	</a>
);

const createGridItemsBlock = ({
	title = 'Featured Product Grid',
	href = '/products',
	hrefLabel = 'View all',
	products = [],
	limit = 5,
}) => {
	const items = (Array.isArray(products) ? products : [])
		.filter(Boolean)
		.slice(0, limit)
		.map((product, index) => {
			const fallbackImage = getLocalProductFallbackImage(product || index);

			return {
				title: product?.name,
				image: getPreferredProductImage({ ...product, localFallbackImage: fallbackImage }),
				fallbackImage,
				imageAlt: product?.name,
				href: `/products/${product?.slug || product?.sku || product?.id}`,
				eyebrow: product?.tags?.[0] || product?.categories?.[0] || 'Featured pick',
				meta: [product?.price?.display || null, product?.description || null],
			};
		});

	if (!items.length) return null;

	return {
		type: 'grid_items',
		title,
		href,
		hrefLabel,
		items,
	};
};

const createRetailCarouselBlock = ({ title, products = [], start = 0, limit = 5, href = '/products' }) => {
	const slides = (Array.isArray(products) ? products : [])
		.slice(start, start + limit)
		.filter(Boolean)
		.map((product) => ({
			eyebrow: product?.tags?.[0] || product?.categories?.[0] || 'Featured',
			title: product?.name || 'Featured pick',
			body: product?.description || '',
			image:
				product?.imageUrl ||
				product?.images?.[0] ||
				getPreferredProductImage({ ...product, localFallbackImage: getLocalProductFallbackImage(product) }),
		}))
		.filter((slide) => slide.image);

	if (!slides.length) return null;

	return {
		type: 'carousel',
		title,
		href,
		variant: 'peek-strip',
		options: {
			showDots: false,
			showArrows: true,
			autoPlayMs: 0,
			pauseOnHover: true,
		},
		slides,
	};
};

const createRetailGridBlock = ({ title, products = [], start = 0, limit = 5, href = '/products' }) => {
	const items = (Array.isArray(products) ? products : [])
		.slice(start, start + limit)
		.filter(Boolean)
		.map((product, index) => {
			const fallbackImage = getLocalProductFallbackImage(product || index);
			return {
				title: product?.name,
				image: getPreferredProductImage({ ...product, localFallbackImage: fallbackImage }),
				fallbackImage,
				imageAlt: product?.name,
				href: `/products/${product?.slug || product?.sku || product?.id}`,
				eyebrow: product?.tags?.[0] || product?.categories?.[0] || 'Fresh pick',
				meta: [product?.price?.display || null, product?.description || null],
			};
		});

	if (!items.length) return null;

	return {
		type: 'grid_items',
		title,
		href,
		hrefLabel: 'View all',
		items,
	};
};

const insertBlockAfterLastType = (blocks, anchorType, blockToInsert) => {
	if (!blockToInsert) return blocks;
	if (blocks.some((block) => block.type === blockToInsert.type)) return blocks;

	const next = [...blocks];
	let anchorIndex = -1;
	for (let index = 0; index < next.length; index += 1) {
		if (next[index]?.type === anchorType) anchorIndex = index;
	}

	if (anchorIndex === -1) {
		const carouselIndex = next.findIndex((block) => block.type === 'carousel');
		if (carouselIndex === -1) {
			next.push(blockToInsert);
			return next;
		}

		next.splice(carouselIndex + 1, 0, blockToInsert);
		return next;
	}

	next.splice(anchorIndex + 1, 0, blockToInsert);
	return next;
};

export const loader = async () => {
	const page = await getLandingPage('home');
	const rawBlocks = Array.isArray(page?.blocks) ? page.blocks : [];
	const productResult = await listProducts({ limit: 18 });
	const featuredProducts = buildHomepageProducts(productResult?.products || []);
	const gridItemsBlock = createGridItemsBlock({ products: featuredProducts, limit: 5 });

	let heroBlocks = [];
	if (!rawBlocks.some((b) => b.type === 'hero')) {
		const heroes = await getHeroBanners();
		heroBlocks = (heroes || []).map((hero) => ({
			type: 'hero',
			title: hero?.title || hero?.heading || hero?.name || 'Weekly Ad',
			subtitle: hero?.subtitle || hero?.tagline || hero?.description || '',
		}));
	}

	const normalizedBlocks = normalizeHomepageBlocks([...rawBlocks, ...heroBlocks], 'contentstack-commercetools', {
		products: featuredProducts,
	});
	const blocks = insertBlockAfterLastType(normalizedBlocks, 'promo', gridItemsBlock);

	return {
		page: {
			title: page?.title || 'Contentstack + Commercetools',
			blocks,
			featuredProducts,
			isFallback: Boolean(page?.isFallback),
			hero: rawBlocks.find((block) => block?.type === 'hero') || heroBlocks[0] || null,
		},
	};
};

export const head = (props) => ({ title: props.page?.title || 'Contentstack + Commercetools' });

export const Page = ({ page }) => {
	if (page?.isFallback) {
		const featured = page?.featuredProducts || [];
		const promoRail = createRetailCarouselBlock({
			title: 'Featured Deals',
			products: featured,
			start: 0,
			limit: 5,
		});
		const topDealsGrid = createRetailGridBlock({
			title: 'Top Deals Products',
			products: featured,
			start: 2,
			limit: 5,
		});
		const seasonalRail = createRetailCarouselBlock({
			title: 'Seasonal Offers',
			products: featured,
			start: 5,
			limit: 5,
		});
		const couponRail = createRetailCarouselBlock({
			title: 'Available Coupons',
			products: featured,
			start: 8,
			limit: 5,
		});
		const topDealProducts = featured.slice(0, 4);
		const valueProducts = featured.slice(4, 7);
		const exploreProducts = featured.slice(0, 6);
		const rewardItems = [
			{ label: 'Muffin', amount: '4.84', progress: 0.82 },
			{ label: 'Artisan Bread', amount: '6.12', progress: 0.74 },
			{ label: 'Donut', amount: '3.81', progress: 0.68 },
			{ label: 'Coffee', amount: '7.42', progress: 0.88 },
		];

		return (
			<main className="retail-home">
				<section className="retail-hero">
					<div className="retail-hero__content">
						<div className="retail-hero__eyebrow">1 for $10 with</div>
						<h1 className="retail-hero__title">{page?.hero?.title || 'Mix & Match'}</h1>
						<p className="retail-hero__body">
							Build a grocery-first fallback homepage with the same shared components and design system
							hooks.
						</p>
						<a className="retail-hero__cta" href={page?.hero?.href || '/products'}>
							{page?.hero?.ctaLabel || 'Shop now'}
						</a>
					</div>
					<div className="retail-hero__visual">
						<img
							src={page?.hero?.image || '/app-images/fruit-basket.png'}
							alt={page?.hero?.title || 'Featured hero'}
						/>
					</div>
				</section>

				{promoRail ? <CarouselBlock block={promoRail} designSystem={demoComponentDesignSystem} /> : null}

				<RetailSectionFrame title="Top Deals Products" bodyClassName="retail-frame__body--compact">
					<div className="retail-top-deals__grid">
						<RetailOfferCard
							title="Fresh Picks"
							body="Just-picked produce and pantry favorites curated for this week's meal plan."
							tone="gold"
						/>
						{topDealProducts.map((product, index) => (
							<RetailProductCard
								key={product?.sku || product?.id || index}
								product={product}
								eyebrow={index === 1 ? 'Save $1.00' : product?.tags?.[0] || 'Fresh value'}
								badge={index === 2 ? 'Buy 5, save $5' : null}
								compact
							/>
						))}
					</div>
				</RetailSectionFrame>

				{topDealsGrid ? <GridItemsBlock block={topDealsGrid} designSystem={demoComponentDesignSystem} /> : null}

				<RetailSectionFrame title="Winter Comfort Recipes" label="View recipes">
					<div className="retail-recipes__grid">
						<article className="retail-recipes__lead">
							<img src="/app-images/grill.png" alt="Weekly recipe highlight" />
							<div className="retail-recipes__overlay">
								<div className="retail-recipes__kicker">Truffle Meatloaf</div>
								<div className="retail-recipes__meta">1 hr 15m · 14 ingredients</div>
							</div>
						</article>
						<article className="retail-recipes__card">
							<img src="/app-images/fruit-basket.png" alt="Fresh produce inspiration" />
							<div className="retail-recipes__overlay">
								<div className="retail-recipes__kicker">Grilled Chicken & Vegetables</div>
								<div className="retail-recipes__meta">41 min · 13 ingredients</div>
							</div>
						</article>
						<article className="retail-recipes__card">
							<img src="/app-images/bouquet.png" alt="Seasonal dinner inspiration" />
							<div className="retail-recipes__overlay">
								<div className="retail-recipes__kicker">Chocolate Fondant</div>
								<div className="retail-recipes__meta">37 min · 8 ingredients</div>
							</div>
						</article>
					</div>
				</RetailSectionFrame>

				{seasonalRail ? <CarouselBlock block={seasonalRail} designSystem={demoComponentDesignSystem} /> : null}

				<RetailSectionFrame title="Kitchen & Pantry Specials" label="View all savings">
					<div className="retail-promo-tiles">
						<article className="retail-promo-tiles__tile retail-promo-tiles__tile--berry">
							<h3>Soup Season</h3>
							<a href="/products">Shop now</a>
						</article>
						<article className="retail-promo-tiles__tile retail-promo-tiles__tile--peach">
							<h3>Cozy Cupful</h3>
							<a href="/products">Shop now</a>
						</article>
						<article className="retail-promo-tiles__tile retail-promo-tiles__tile--teal">
							<h3>Crockpot Creations</h3>
							<a href="/products">Shop now</a>
						</article>
					</div>
				</RetailSectionFrame>

				<RetailSectionFrame title="Monthly Rewards" label="See all rewards">
					<div className="retail-rewards__grid">
						{rewardItems.map((reward) => (
							<RetailReward key={reward.label} {...reward} />
						))}
					</div>
				</RetailSectionFrame>

				{couponRail ? <CarouselBlock block={couponRail} designSystem={demoComponentDesignSystem} /> : null}

				<RetailSectionFrame title="Unlock Your Best Deals" label="Browse savings">
					<div className="retail-banner">
						<div className="retail-banner__copy">
							<h3>
								Layer a loyalty banner, promotional rail, and discover modules into one grocery-style
								homepage.
							</h3>
							<p>Promotional storytelling, quick actions, and savings hooks all in one shelf.</p>
						</div>
						<div className="retail-banner__actions">
							<a href="/products">Shop</a>
							<a href="/products">Browse savings</a>
						</div>
					</div>
				</RetailSectionFrame>

				<RetailSectionFrame title="Explore D&W" label="Browse all">
					<div className="retail-explore__grid">
						{exploreProducts.map((product, index) => (
							<RetailExploreIcon
								key={product?.sku || product?.id || index}
								product={product}
								label={product?.tags?.[0] || product?.name || 'Fresh'}
							/>
						))}
					</div>
				</RetailSectionFrame>

				<RetailSectionFrame title="Value Props" label="Learn more">
					<div className="retail-value-props__grid">
						{valueProducts.map((product, index) => (
							<article
								key={product?.sku || product?.id || index}
								className={`retail-value-props__card retail-value-props__card--${index === 0 ? 'berry' : index === 1 ? 'rose' : 'plum'}`}
							>
								<div className="retail-value-props__copy">
									<div className="retail-value-props__eyebrow">Seasonal value</div>
									<h3>
										{index === 0
											? 'Save more. Eat better.'
											: index === 1
												? 'Get back every time.'
												: 'Save 25% on staples.'}
									</h3>
								</div>
								<img src={getProductImage(product, index)} alt={product?.name || 'Value prop'} />
							</article>
						))}
					</div>
				</RetailSectionFrame>
			</main>
		);
	}

	let featureIndex = 0;
	return (
		<main>
			{(page?.blocks || []).map((b, i) => {
				if (b.type === 'hero') {
					return (
						<section key={i} style={{ marginBottom: 24 }}>
							<h1 style={{ margin: 0 }}>{b.title}</h1>
							<p style={{ marginTop: 8 }}>{b.subtitle}</p>
						</section>
					);
				}

				if (b.type === 'promo') {
					const node = (
						<FeatureSplitBlock
							key={i}
							block={b}
							layoutIndex={featureIndex}
							products={page?.featuredProducts || []}
							designSystem={demoComponentDesignSystem}
						/>
					);
					featureIndex += 1;
					return node;
				}

				if (b.type === 'grid_items') {
					return (
						<GridItemsBlock
							key={i}
							block={b}
							style={{ marginBottom: 24 }}
							designSystem={demoComponentDesignSystem}
						/>
					);
				}

				if (b.type === 'carousel') {
					return (
						<CarouselBlock
							key={i}
							block={b}
							style={{ marginBottom: 24 }}
							designSystem={demoComponentDesignSystem}
						/>
					);
				}

				if (b.type === 'product_search') {
					return (
						<section key={i} style={{ marginBottom: 24 }}>
							<h2>Search</h2>
							<ProductSearchSSR
								placeholder="Search products..."
								searchPageUrl="/products"
								designSystem={demoComponentDesignSystem}
							/>
						</section>
					);
				}

				if (b.type === 'cart_mini') {
					return (
						<section key={i} style={{ marginBottom: 24 }}>
							<h2>Cart</h2>
							<Island
								islandKey={b.islandKey}
								hydrate={b.hydrate || 'immediate'}
								props={{}}
								resolveIslandModule={resolveIslandModule}
							>
								<CartSSR />
							</Island>
						</section>
					);
				}

				return null;
			})}
		</main>
	);
};
