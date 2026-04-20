import React from 'react';
import { ProductDetailBlock } from 'react-islands-ui';
import { createProductDetailBlock } from '../../../../../_shared/productDetailBlock.js';
import { demoComponentDesignSystem } from '../../../../server/designSystem.js';
import { getProductBySku } from '../../../../models/commercetools.client.js';

export const loader = async ({ params }) => {
	const product = await getProductBySku(params.sku);

	return {
		product: product || {
			sku: params.sku,
			name: `Product ${params.sku}`,
			price: 3.99,
			description: 'Exampleproduct details.',
		},
	};
};

export const head = (props) => ({ title: props.product?.name || 'Product' });

export const Page = ({ product }) => {
	const block = createProductDetailBlock({
		product,
		resolvePrice: (item) => {
			const priceValue = item?.price;
			if (typeof priceValue === 'number') return `$${priceValue.toFixed(2)}`;
			if (typeof priceValue === 'string') return priceValue;
			if (priceValue && typeof priceValue === 'object') {
				if (typeof priceValue.display === 'string') return priceValue.display;
				if (typeof priceValue.centAmount === 'number') return `$${(priceValue.centAmount / 100).toFixed(2)}`;
			}
			return '$—';
		},
	});

	return (
		<main>
			<ProductDetailBlock block={block} designSystem={demoComponentDesignSystem} />
		</main>
	);
};
