import React from 'react';
import { listProducts } from '../../../models/product.model.js';

const toView = (p) => ({
	key: p.slug || p.sku || p.id,
	sku: p.sku,
	name: p.name || p.title || 'Product',
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
			<ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
				{products.map((p) => (
					<li key={p.key} style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
						<a href={`/products/${encodeURIComponent(p.key)}`}>{p.name}</a>
						<div style={{ opacity: 0.7 }}>{p.price}</div>
					</li>
				))}
			</ul>
		</main>
	);
};
