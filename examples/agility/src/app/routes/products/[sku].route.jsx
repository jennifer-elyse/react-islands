import React from 'react';
import { getProductBySlug } from '../../../../models/product.model.js';

export const loader = async ({ params }) => {
	const product = await getProductBySlug(params.sku);
	return { product };
};

export const head = (props) => ({ title: props.product?.name || 'Product' });

export const Page = ({ product }) => {
	if (!product) {
		return (
			<main>
				<h1 style={{ marginTop: 0 }}>Product not found</h1>
				<p>
					<a href="/products">Back to products</a>
				</p>
			</main>
		);
	}

	return (
		<main>
			<p style={{ marginTop: 0 }}>
				<a href="/products">← All products</a>
			</p>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
					gap: '2rem',
					alignItems: 'start',
				}}
			>
				{product.imageUrl || product.images?.[0] ? (
					<img
						src={product.imageUrl || product.images[0]}
						alt={product.name}
						style={{ width: '100%', borderRadius: 'var(--radius-surface, 16px)', objectFit: 'cover' }}
					/>
				) : null}
				<div>
					<h1 style={{ marginTop: 0 }}>{product.name}</h1>
					<div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>SKU: {product.sku}</div>
					<p>{product.description || 'No description.'}</p>
					<div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{product.price?.display || '$—'}</div>
				</div>
			</div>
		</main>
	);
};
