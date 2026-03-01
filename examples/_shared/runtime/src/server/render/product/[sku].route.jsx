import React from 'react';

export const loader = async ({ req, params }) => {
	const sku = params.sku;

	if (req.commerce) {
		try {
			const product = await req.commerce.getProductBySku({ sku });
			return { product };
		} catch {
			// fallback below
		}
	}

	return {
		product: {
			sku,
			title: `Product ${sku}`,
			description: 'Server-rendered product page.',
			price: 3.99,
		},
	};
};

export const head = (props) => ({ title: props.product?.title || 'Product' });

export const Page = ({ product }) => {
	return (
		<main>
			<h1 style={{ marginTop: 0 }}>{product.title}</h1>
			<div style={{ opacity: 0.7, marginBottom: 8 }}>SKU: {product.sku}</div>
			<p>{product.description}</p>
			<div>
				<strong>${Number(product.price).toFixed(2)}</strong>
			</div>
		</main>
	);
};
