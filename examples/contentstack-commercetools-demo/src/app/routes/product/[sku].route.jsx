import React from 'react';
import { getProductBySlug } from '../../../../models/product.model.js';

export const loader = async ({ params }) => {
	const product = await getProductBySlug(params.sku);
	return { product };
};

export const head = (props) => ({ title: props.product?.name || 'Product' });

export const Page = ({ product }) => {
	return (
		<main style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }}>
			<div>
				{product?.imageUrl ? (
					<img
						src={product.imageUrl}
						alt={product.name}
						style={{ width: '100%', maxWidth: 320, borderRadius: 8, border: '1px solid #eee' }}
					/>
				) : (
					<div
						style={{
							width: '100%',
							height: 240,
							background: '#f7f7f7',
							border: '1px dashed #ddd',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							color: '#999',
							borderRadius: 8,
						}}
					>
						No image
					</div>
				)}
			</div>
			<div>
				<h1 style={{ marginTop: 0 }}>{product?.name || 'Product'}</h1>
				<div style={{ opacity: 0.7, marginBottom: 8 }}>SKU: {product?.sku}</div>
				<p>{product?.description || 'No description.'}</p>
				<div style={{ fontSize: 20, fontWeight: 700 }}>{product?.price?.display || '$—'}</div>
			</div>
		</main>
	);
};
