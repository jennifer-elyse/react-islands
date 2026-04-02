import React from 'react';
import { getProductBySlug } from '../../../../models/product.model.js';

export const loader = async ({ params }) => {
	const product = await getProductBySlug(params.sku);
	return { product };
};

export const head = (props) => ({ title: props.product?.name || 'Product' });

export const Page = ({ product }) => {
	return (
		<main>
			<div className="test-data-product-detail">
				<img
					className="test-data-product-detail__image"
					src={product?.imageUrl || product?.images?.[0] || '/demo-images/liquid-glass-goggles.jpg'}
					alt={product?.name || 'Product'}
				/>
				<div className="test-data-product-detail__copy">
					<h1 style={{ marginTop: 0 }}>{product?.name || 'Product'}</h1>
					<div className="test-data-product-detail__sku">SKU: {product?.sku}</div>
					<p>{product?.description || 'No description.'}</p>
					<div className="test-data-product-detail__price">{product?.price?.display || '$—'}</div>
				</div>
			</div>
		</main>
	);
};
