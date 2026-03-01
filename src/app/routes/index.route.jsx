import React from 'react';
import { Island } from '../../server/islands/Island.jsx';
import { resolveIslandModule } from '../../server/islands/resolveIslandModule.js';

import CartSSR from '../islands/Cart.ssr.jsx';
import ProductSearchSSR from '../islands/ProductSearch.ssr.jsx';

export const loader = async ({ req }) => {
	if (req.cms) {
		try {
			const page = await req.cms.getPageBySlug({ slug: 'home' });
			return { page };
		} catch {
			// fallback below
		}
	}

	return {
		page: {
			title: 'Home',
			blocks: [
				{ type: 'hero', title: 'Weekly Deals', subtitle: 'SSR-first content' },
				{
					type: 'product_search',
					islandKey: 'product_search',
					hydrate: 'immediate',
				},
				{ type: 'cart_mini', islandKey: 'cart', hydrate: 'immediate' },
			],
		},
	};
};

export const head = (props) => ({ title: props.page?.title || 'Home' });

export const Page = ({ page }) => {
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

				if (b.type === 'product_search') {
					return (
						<section key={i} style={{ marginBottom: 24 }}>
							<h2>Search</h2>

							<Island
								islandKey={b.islandKey}
								hydrate={b.hydrate || 'immediate'}
								props={{ placeholder: 'Search products…' }}
								resolveIslandModule={resolveIslandModule}
							>
								<ProductSearchSSR placeholder="Search products…" />
							</Island>
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
