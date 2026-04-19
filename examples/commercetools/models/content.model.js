// Examplecontent model (non-vendor) using local surf shop data
import { listSurfProducts } from '../../_shared/data/surf-shop.js';

export const getLandingPage = async () => {
	const products = listSurfProducts({ limit: 6 }).products;
	return {
		title: 'Surf Shop Daily Drops',
		blocks: [
			{ type: 'hero', title: 'Glassline Collection', subtitle: 'Liquid glass surf essentials.' },
			{ type: 'carousel' },
			{ type: 'product_grid', title: 'Featured Gear', products },
			{ type: 'product_search', islandKey: 'product_search', hydrate: 'immediate' },
			{ type: 'cart_mini', islandKey: 'cart', hydrate: 'immediate' },
		],
	};
};
