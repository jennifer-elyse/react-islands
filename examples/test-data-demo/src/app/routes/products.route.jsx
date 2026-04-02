import React from 'react';
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
			<div className="test-data-products-grid">
				{products.map((p) => (
					<a key={p.key} href={`/products/${encodeURIComponent(p.key)}`} className="test-data-product-card">
						{p.image ? (
							<img src={p.image} alt={p.name} />
						) : null}
						<div className="test-data-product-card__name">{p.name}</div>
						<div className="test-data-product-card__price">{p.price}</div>
						<div className="test-data-product-card__description">{p.description}</div>
					</a>
				))}
			</div>
		</main>
	);
};
