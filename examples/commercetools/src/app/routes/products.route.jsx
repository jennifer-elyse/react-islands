import React from 'react';
import { PlpProductsBlock } from 'react-islands';
import { createPlpProductsBlock } from '../../../../_shared/productGridBlock.js';
import { filterProductsByQuery, getSearchQuery } from '../../../../_shared/productSearch.js';
import { demoComponentDesignSystem } from '../../../server/designSystem.js';
import { listProducts } from '../../../models/product.model.js';

export const loader = async ({ req }) => {
	const query = getSearchQuery(req);
	const result = await listProducts({ limit: 100, query });
	const products = filterProductsByQuery(result?.products || [], query).slice(0, 20);
	return { products, query };
};

export const head = ({ query }) => ({ title: query ? `Products: ${query}` : 'Products' });

export const Page = ({ products, query }) => {
	const block = createPlpProductsBlock({ title: query ? `Products for "${query}"` : 'Products', products });

	return (
		<main>
			<h1 style={{ marginTop: 0 }}>Products</h1>
			<PlpProductsBlock block={block} designSystem={demoComponentDesignSystem} />
		</main>
	);
};
