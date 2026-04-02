import React from 'react';
import { Island, resolveIslandModule } from 'react-islands-runtime/ssr';

import CartSSR from '../../../../_shared/runtime/src/islands/Cart.ssr.jsx';
import ProductSearchSSR from '../../../../_shared/runtime/src/islands/ProductSearch.ssr.jsx';

import { getLandingPage, getHeroBanners } from '../../../models/content.model.js';

const normalizeBlocks = (blocks = []) => {
	const hasSearch = blocks.some((b) => b.type === 'product_search');
	const hasCart = blocks.some((b) => b.type === 'cart_mini');

	const next = [...blocks];
	if (!hasSearch) next.push({ type: 'product_search', islandKey: 'product_search', hydrate: 'immediate' });
	if (!hasCart) next.push({ type: 'cart_mini', islandKey: 'cart', hydrate: 'immediate' });

	const searchIndex = next.findIndex((b) => b.type === 'product_search');
	const heroIndex = next.findIndex((b) => b.type === 'hero');

	if (searchIndex !== -1 && heroIndex !== -1 && searchIndex !== heroIndex + 1) {
		const [searchBlock] = next.splice(searchIndex, 1);
		next.splice(heroIndex + 1, 0, searchBlock);
	}

	return next;
};

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

	const blocks = normalizeBlocks([...rawBlocks, ...heroBlocks]);

	return {
		page: {
			title: page?.title || 'Test Data Demo',
			blocks,
		},
	};
};

export const head = (props) => ({ title: props.page?.title || 'Test Data Demo' });

export const Page = ({ page }) => {
	return (
		<main className="test-data-page">
			{(page?.blocks || []).map((b, i) => {
				if (b.type === 'hero') {
					return (
						<section key={i} className="test-data-hero">
							<div className="test-data-hero__content">
								<span className="test-data-hero__eyebrow">{b.eyebrow || 'Test Data Demo'}</span>
								<h1 className="test-data-hero__title">{b.title}</h1>
								<p className="test-data-hero__subtitle">{b.subtitle}</p>
								<ul className="test-data-hero__meta">
									<li>OKLab palette</li>
									<li>liquid glass surfaces</li>
									<li>local CMS + catalog fixtures</li>
								</ul>
							</div>
							<div className="test-data-hero__visual">
								<img src={b.image || '/demo-images/liquid-glass-board.jpg'} alt={b.title} />
								<div className="test-data-hero__swash">liquid glass line</div>
							</div>
						</section>
					);
				}

				if (b.type === 'promo') {
					return (
						<section key={i} className="test-data-promo">
							<div className="test-data-promo__title">{b.title}</div>
							<p className="test-data-promo__body">{b.body}</p>
						</section>
					);
				}

				if (b.type === 'product_search') {
					return (
						<section key={i} className="test-data-search-card">
							<h2 className="test-data-card-title">Search Local Surf Gear</h2>
							<p className="test-data-card-copy">
								Type anything from “glass” to “fins” and the island will query the checked-in product fixtures.
							</p>
							<Island
								islandKey={b.islandKey}
								hydrate={b.hydrate || 'immediate'}
								props={{ placeholder: 'Search local test products...' }}
								resolveIslandModule={resolveIslandModule}
							>
								<ProductSearchSSR placeholder="Search local test products..." />
							</Island>
						</section>
					);
				}

				if (b.type === 'cart_mini') {
					return (
						<section key={i} className="test-data-cart-card">
							<h2 className="test-data-card-title">Mini Cart</h2>
							<p className="test-data-card-copy">A simple fixture-backed cart shell for island hydration checks.</p>
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
