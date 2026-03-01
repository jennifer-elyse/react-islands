import { listProducts } from './product.model.js';

const matchesQuery = (product, query) => {
	if (!query) return true;
	const q = query.toLowerCase();
	const haystack = [product.name, product.description, product.sku, product.id, ...(product.tags || [])]
		.filter(Boolean)
		.join(' ')
		.toLowerCase();
	return haystack.includes(q);
};

export const searchProducts = async ({ query = '', limit = 10, offset = 0 } = {}) => {
	const data = await listProducts({ limit: Math.max(limit, 50), offset: 0 });
	const filtered = (data.products || []).filter((product) => matchesQuery(product, query));
	const sliced = filtered.slice(offset, offset + limit);
	return {
		products: sliced,
		total: filtered.length,
		offset,
	};
};

export const searchSuggestions = async ({ query = '', limit = 8 } = {}) => {
	const data = await listProducts({ limit: Math.max(limit, 50), offset: 0 });
	const filtered = (data.products || []).filter((product) => matchesQuery(product, query));
	return {
		suggestions: filtered.slice(0, limit).map((product) => ({
			id: product.id,
			type: 'product',
			text: product.name,
			slug: product.sku,
			imageUrl: product.imageUrl || product.images?.[0] || null,
			price: product.price?.display || null,
			sku: product.sku,
		})),
	};
};
