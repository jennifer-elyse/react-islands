import React from 'react';
import { Island, resolveIslandModule } from 'react-islands-runtime/ssr';

<<<<<<< Updated upstream
import CartSSR from '../../../../_shared/runtime/src/islands/Cart.ssr.jsx';
import { CarouselBlock, FeatureSplitBlock, ProductSearchSSR } from 'react-islands';
import { listSurfProducts } from '../../../../_shared/data/surf-shop.js';
import { normalizeHomepageBlocks } from '../../../../_shared/homepageBlocks.js';
import { demoComponentDesignSystem } from '../../../server/designSystem.js';
=======
import { CartSSR, ProductSearchSSR } from 'react-islands-ui';
import { getCarouselBlock } from '../../../../_shared/carousels.js';
import { CarouselBlock } from '../../../../_shared/components/CarouselBlock.jsx';
import { ensureBlock, moveBlockAfter, moveBlockToFront } from '../../../../_shared/homepageBlocks.js';
>>>>>>> Stashed changes
import { getLandingPage, getHeroBanners } from '../../../models/contentstack.model.js';

export const loader = async () => {
	const page = await getLandingPage('home');
	const rawBlocks = Array.isArray(page?.blocks) ? page.blocks : [];

	let heroBlocks = [];
	if (!rawBlocks.some((b) => b.type === 'hero')) {
		const heroes = await getHeroBanners();
		heroBlocks = (heroes || []).map((hero) => ({
			type: 'hero',
			title: hero?.title || hero?.heading || hero?.name || 'Weekly Ad',
			subtitle: hero?.subtitle || hero?.tagline || hero?.description || '',
		}));
	}

	const featuredProducts = listSurfProducts({ limit: 6 }).products;
	const blocks = normalizeHomepageBlocks([...rawBlocks, ...heroBlocks], 'contentstack', {
		products: featuredProducts,
	});

	return {
		page: {
			title: page?.title || 'Contentstack ',
			blocks,
			featuredProducts,
		},
	};
};

export const head = (props) => ({ title: props.page?.title || 'Contentstack ' });

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
							designSystem={demoComponentDesignSystem}
						/>
					);
					featureIndex += 1;
					return node;
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
