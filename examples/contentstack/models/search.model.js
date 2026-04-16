import { listSurfProducts, listSurfSuggestions } from '../../_shared/demo-data/surf-shop.js';

export const searchProducts = async ({ query = '', limit = 10, offset = 0 } = {}) => {
	const data = listSurfProducts({ query, limit, offset });
	return {
		products: data.products,
		total: data.total,
		offset: data.offset,
	};
};

export const searchSuggestions = async ({ query = '', limit = 8 } = {}) => {
	return listSurfSuggestions({ query, limit });
};
