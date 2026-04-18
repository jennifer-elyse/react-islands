import React from 'react';
import { ProductDetailBlock } from 'react-islands';
import { createProductDetailBlock } from '../../../../../_shared/productDetailBlock.js';
import { demoComponentDesignSystem } from '../../../../server/designSystem.js';
import { getProductBySlug } from '../../../../models/product.model.js';

export const loader = async ({ params }) => {
	const product = await getProductBySlug(params.sku);
	return { product };
};

export const head = (props) => ({ title: props.product?.name || 'Product' });

export const Page = ({ product }) => {
	const block = createProductDetailBlock({ product });

	return (
		<main>
			<ProductDetailBlock block={block} designSystem={demoComponentDesignSystem} />
		</main>
	);
};
