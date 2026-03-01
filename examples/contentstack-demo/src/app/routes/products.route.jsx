import React from 'react';
import { getProducts } from '../../../models/commercetools.client.js';

const formatPrice = (price) => {
	if (typeof price === 'number') return `$${price.toFixed(2)}`;
	if (typeof price === 'string') return price;
	if (price && typeof price === 'object') {
		if (typeof price.display === 'string') return price.display;
		if (typeof price.centAmount === 'number') return `$${(price.centAmount / 100).toFixed(2)}`;
	}
	return '$—';
};

const toView = (p) => ({
	sku: p.sku,
	name: p.name || p.title || 'Product',
	price: formatPrice(p.price),
});

export const loader = async () => {
	const products = (await getProducts()).map(toView);
	return { products };
};

export const head = () => ({ title: 'Products' });

export const Page = ({ products }) => {
	return (
		<main>
			<h1 style={{ marginTop: 0 }}>Products</h1>
			<ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
				{products.map((p) => (
					<li key={p.sku} style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
						<a href={`/product/${encodeURIComponent(p.sku)}`}>{p.name}</a>
						<div style={{ opacity: 0.7 }}>{p.price}</div>
					</li>
				))}
			</ul>
		</main>
	);
};
