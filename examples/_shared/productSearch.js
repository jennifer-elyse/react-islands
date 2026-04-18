export const getSearchQuery = (req) => {
	const requestUrl = req?.url || '/';
	const url = new URL(requestUrl, 'http://localhost');
	return (url.searchParams.get('q') || '').trim();
};

export const filterProductsByQuery = (products = [], query = '') => {
	const normalizedQuery = String(query || '').trim().toLowerCase();
	if (!normalizedQuery) return Array.isArray(products) ? products : [];

	return (Array.isArray(products) ? products : []).filter((product) => {
		const haystack = [
			product?.name,
			product?.title,
			product?.description,
			product?.slug,
			product?.sku,
			product?.id,
			...(Array.isArray(product?.tags) ? product.tags : []),
			...(Array.isArray(product?.categories) ? product.categories : []),
		]
			.filter(Boolean)
			.join(' ')
			.toLowerCase();

		return haystack.includes(normalizedQuery);
	});
};
