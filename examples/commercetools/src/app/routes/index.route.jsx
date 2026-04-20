import React from 'react';
import { Island, resolveIslandModule } from 'react-islands-runtime/ssr';

import { CarouselBlock, CartSSR, ProductSearchSSR } from 'react-islands-ui';
import { getCarouselBlock } from '../../../../_shared/carousels.js';
import { getLandingPage } from '../../../models/content.model.js';
import { demoComponentDesignSystem } from '../../../server/designSystem.js';

export const loader = async () => {
	const page = await getLandingPage();
	const blocks = (Array.isArray(page?.blocks) ? [...page.blocks] : []).map((block) =>
		block?.type === 'carousel' ? getCarouselBlock('commercetools') : block,
	);

	return { page: { ...page, blocks } };
};

export const head = (props) => ({ title: props.page?.title || 'Commercetools ' });

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

				if (b.type === 'product_grid') {
					return (
						<section key={i} style={{ marginBottom: 24 }}>
							<h2>{b.title}</h2>
							<div
								style={{
									display: 'grid',
									gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
									gap: 'var(--spacing-md, 16px)',
								}}
							>
								{(b.products || []).map((p) => (
									<div
										key={p.id}
										style={{
											padding: 'var(--spacing-md, 16px)',
											border: '1px solid var(--border-subtle)',
											borderRadius: 'var(--radius-surface, 24px)',
											textAlign: 'center',
										}}
									>
										{p.imageUrl && (
											<img
												src={p.imageUrl}
												alt={p.name}
												style={{
													width: '100%',
													aspectRatio: '1',
													objectFit: 'cover',
													borderRadius: 'var(--radius-surface, 24px)',
												}}
											/>
										)}
										<h3 style={{ margin: '8px 0 4px', fontSize: '1rem' }}>{p.name}</h3>
										<p style={{ margin: 0, color: 'var(--text-muted)' }}>{p.price?.display}</p>
									</div>
								))}
							</div>
						</section>
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
