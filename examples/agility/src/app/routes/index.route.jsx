import React from 'react';
import { Island, resolveIslandModule } from 'react-islands-runtime/ssr';

import { CarouselBlock, FeatureSplitBlock, ProductSearchSSR } from 'react-islands-ui';
import { getCarouselBlock } from '../../../../_shared/carousels.js';
import { ensureBlock, moveBlockAfter, moveBlockToFront } from '../../../../_shared/homepageBlocks.js';
import { demoComponentDesignSystem } from '../../../server/designSystem.js';
import { getLandingPage } from '../../../models/agility.model.js';

export const loader = async () => {
	const page = await getLandingPage('home');
	const blocks = Array.isArray(page?.blocks) ? [...page.blocks] : [];

	ensureBlock(blocks, 'product_search', () => ({
		type: 'product_search',
		islandKey: 'product_search',
		hydrate: 'immediate',
	}));
	ensureBlock(blocks, 'carousel', () => getCarouselBlock('agility'));

	const arrangedBlocks = blocks.some((block) => block.type === 'hero')
		? moveBlockAfter(moveBlockAfter(blocks, 'product_search', 'hero'), 'carousel', 'product_search')
		: moveBlockAfter(moveBlockToFront(blocks, 'product_search'), 'carousel', 'product_search');

	return {
		page: {
			title: page?.title || 'Agility ',
			blocks: arrangedBlocks,
		},
	};
};

export const head = (props) => ({ title: props.page?.title || 'Agility ' });

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
						<section key={i} style={{ marginBottom: 24, position: 'relative', zIndex: 1 }}>
							<h2>Search</h2>
							<ProductSearchSSR
								placeholder="Search products..."
								searchPageUrl="/products"
								designSystem={demoComponentDesignSystem}
							/>
						</section>
					);
				}

				return null;
			})}
		</main>
	);
};
