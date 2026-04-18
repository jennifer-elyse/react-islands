import React from 'react';
import { Island, resolveIslandModule } from 'react-islands-runtime/ssr';

import CartSSR from '../../../../_shared/runtime/src/islands/Cart.ssr.jsx';
import { getCarouselSlidesFromProducts, getDemoCarouselBlock } from '../../../../_shared/carousels.js';
import { CarouselBlock, FeatureSplitBlock, GridItemsBlock, ProductSearchSSR } from 'react-islands';
import { normalizeHomepageBlocks } from '../../../../_shared/homepageBlocks.js';
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
	const productResult = await listProducts({ limit: 6 });
	const featuredProducts = buildHomepageProducts(productResult?.products || []);
	const carouselSlides = getCarouselSlidesFromProducts(featuredProducts, { limit: 3 });
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

	const normalizedBlocks = normalizeHomepageBlocks(
		[...rawBlocks, ...heroBlocks],
		'contentstack-commercetools-demo',
	).map((block) =>
		block?.type === 'carousel'
			? getDemoCarouselBlock('contentstack-commercetools-demo', {
					slides: carouselSlides.length ? carouselSlides : undefined,
				})
			: block,
	);
	const blocks = insertBlockAfterLastType(normalizedBlocks, 'promo', gridItemsBlock);

	return {
		page: {
			title: page?.title || 'Contentstack + Commercetools',
			blocks,
			featuredProducts,
		},
	};
};

export const head = (props) => ({ title: props.page?.title || 'Contentstack + Commercetools' });

export const Page = ({ page }) => {
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
						/>
					);
					featureIndex += 1;
					return node;
				}

				if (b.type === 'grid_items') {
					return <GridItemsBlock key={i} block={b} style={{ marginBottom: 24 }} />;
				}

				if (b.type === 'carousel') {
					return <CarouselBlock key={i} block={b} style={{ marginBottom: 24 }} />;
				}

				if (b.type === 'product_search') {
					return (
						<section key={i} style={{ marginBottom: 24 }}>
							<h2>Search</h2>
							<ProductSearchSSR placeholder="Search products..." searchPageUrl="/products" />
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
