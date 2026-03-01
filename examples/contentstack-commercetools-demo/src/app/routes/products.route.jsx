import React from 'react';
import { listProducts } from '../../../models/product.model.js';

const toView = (p) => ({
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
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
					gap: 16,
				}}
			>
				{products.map((p) => (
					<a
						key={p.sku}
						href={`/product/${encodeURIComponent(p.sku)}`}
						style={{
							display: 'block',
							padding: 12,
							border: '1px solid #eee',
							borderRadius: 8,
							textDecoration: 'none',
							color: 'inherit',
						}}
					>
						{p.image ? (
							<img
								src={p.image}
								alt={p.name}
								style={{
									width: '100%',
									height: 140,
									objectFit: 'cover',
									borderRadius: 6,
									marginBottom: 8,
								}}
							/>
						) : (
							<div
								style={{
									height: 140,
									background: '#f7f7f7',
									border: '1px dashed #ddd',
									borderRadius: 6,
									marginBottom: 8,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: '#999',
								}}
							>
								No image
							</div>
						)}
						<div style={{ fontWeight: 600, marginBottom: 4 }}>{p.name}</div>
						<div style={{ opacity: 0.8, fontSize: 14, marginBottom: 8 }}>{p.price}</div>
						<div style={{ opacity: 0.7, fontSize: 13, lineHeight: 1.4 }}>{p.description}</div>
					</a>
				))}
			</div>
		</main>
	);
};
