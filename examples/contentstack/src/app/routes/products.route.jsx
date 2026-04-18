import React from 'react';
import { PlpProductsBlock } from 'react-islands';
import { createPlpProductsBlock } from '../../../../_shared/productGridBlock.js';
import { filterProductsByQuery, getSearchQuery } from '../../../../_shared/productSearch.js';
import { getProducts } from '../../../models/commercetools.client.js';

const normalizeProducts = (products = []) =>
	(Array.isArray(products) ? products : []).map((product) => ({
		...product,
		price:
			typeof product?.price === 'number'
				? { display: `$${product.price.toFixed(2)}` }
				: typeof product?.price === 'string'
					? { display: product.price }
					: typeof product?.price?.display === 'string'
						? product.price
						: typeof product?.price?.centAmount === 'number'
							? { ...product.price, display: `$${(product.price.centAmount / 100).toFixed(2)}` }
							: { display: '$—' },
	}));

export const loader = async ({ req }) => {
	const query = getSearchQuery(req);
	const products = filterProductsByQuery(normalizeProducts(await getProducts()), query).slice(0, 20);
	return { products, query };
};

export const head = ({ query }) => ({ title: query ? `Products: ${query}` : 'Products' });

export const Page = ({ products, query }) => {
	const block = createPlpProductsBlock({ title: query ? `Products for "${query}"` : 'Products', products });

	return (
		<main>
			<h1 style={{ marginTop: 0 }}>Products</h1>
			<PlpProductsBlock block={block} />
		</main>
	);
};
