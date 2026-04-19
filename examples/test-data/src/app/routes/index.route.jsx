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
import { getLandingPage, getHeroBanners } from '../../../models/content.model.js';

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
	const blocks = normalizeHomepageBlocks([...rawBlocks, ...heroBlocks], 'test-data', { products: featuredProducts });

	return {
		page: {
			title: page?.title || 'Test Data ',
			blocks,
			featuredProducts,
		},
	};
};

export const head = (props) => ({ title: props.page?.title || 'Test Data ' });

export const Page = ({ page }) => {
	let featureIndex = 0;
	return (
		<main className="test-data-page">
			{(page?.blocks || []).map((b, i) => {
				if (b.type === 'hero') {
					return (
						<section key={i} className="test-data-hero">
							<div className="test-data-hero__content">
								<span className="test-data-hero__eyebrow">{b.eyebrow || 'Test Data '}</span>
								<h1 className="test-data-hero__title">{b.title}</h1>
								<p className="test-data-hero__subtitle">{b.subtitle}</p>
								<ul className="test-data-hero__meta">
									<li>OKLab palette</li>
									<li>liquid glass surfaces</li>
									<li>local CMS + catalog fixtures</li>
								</ul>
							</div>
							<div className="test-data-hero__visual">
								<img src={b.image || '/images/liquid-glass-board.jpg'} alt={b.title} />
								<div className="test-data-hero__swash">liquid glass line</div>
							</div>
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
							className="test-data-carousel-card"
							designSystem={demoComponentDesignSystem}
						/>
					);
				}

				if (b.type === 'product_search') {
					return (
						<section key={i} className="test-data-search-card">
							<h2 className="test-data-card-title">Search Local Surf Gear</h2>
							<p className="test-data-card-copy">
								Type anything from “glass” to “fins” for live suggestions, then submit into the
								server-rendered PLP.
							</p>
							<ProductSearchSSR
								placeholder="Search local test products..."
								searchPageUrl="/products"
								designSystem={demoComponentDesignSystem}
							/>
						</section>
					);
				}

				if (b.type === 'cart_mini') {
					return (
						<section key={i} className="test-data-cart-card">
							<h2 className="test-data-card-title">Mini Cart</h2>
							<p className="test-data-card-copy">
								A simple fixture-backed cart shell for island hydration checks.
							</p>
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
