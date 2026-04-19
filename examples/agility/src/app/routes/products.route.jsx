import React from 'react';
<<<<<<< Updated upstream
import { PlpProductsBlock } from 'react-islands';
import { createPlpProductsBlock } from '../../../../_shared/productGridBlock.js';
import { filterProductsByQuery, getSearchQuery } from '../../../../_shared/productSearch.js';
import { demoComponentDesignSystem } from '../../../server/designSystem.js';
import { listProducts } from '../../../models/product.model.js';

export const loader = async ({ req }) => {
	const query = getSearchQuery(req);
	const result = await listProducts({ limit: 100, query });
	const products = filterProductsByQuery(result?.products || [], query).slice(0, 20);
	return { products, query };
};

export const head = ({ query }) => ({ title: query ? `Products: ${query}` : 'Products' });

export const Page = ({ products, query }) => {
	const block = createPlpProductsBlock({ title: query ? `Products for "${query}"` : 'Products', products });

	return (
		<main>
			<h1 style={{ marginTop: 0 }}>Products</h1>
			<PlpProductsBlock block={block} designSystem={demoComponentDesignSystem} />
=======
import { listProducts } from '../../../models/product.model.js';

const toView = (p) => ({
	key: p.slug || p.sku || p.id,
	sku: p.sku,
	name: p.name || p.title || 'Product',
	description: p.description || '',
	image: p.imageUrl || p.images?.[0] || null,
	price: p.price?.display || '$—',
});

export const loader = async () => {
	const result = await listProducts({ limit: 20 });
	const products = (result?.products || []).map(toView);
	return { products };
};

export const head = () => ({ title: 'Products' });

export const Page = ({ products }) => {
	return (
		<main>
			<h1 style={{ marginTop: 0 }}>Products</h1>
			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
				{products.map((p) => (
					<a
						key={p.key}
						href={`/products/${encodeURIComponent(p.key)}`}
						style={{
							display: 'block',
							textDecoration: 'none',
							color: 'inherit',
							borderRadius: 'var(--radius-surface, 16px)',
							overflow: 'hidden',
							border: '1px solid var(--border-subtle)',
							background: 'var(--surface-panel)',
						}}
					>
						{p.image ? (
							<img src={p.image} alt={p.name} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }} />
						) : null}
						<div style={{ padding: '1rem' }}>
							<strong>{p.name}</strong>
							<div style={{ marginTop: '0.25rem', color: 'var(--text-muted)' }}>{p.price}</div>
						</div>
					</a>
				))}
			</div>
>>>>>>> Stashed changes
		</main>
	);
};
