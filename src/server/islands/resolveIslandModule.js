export const resolveIslandModule = (islandKey) => {
	const map = {
		cart: 'cart',
		product_search: 'product_search',
	};

	return map[islandKey] || null;
};
