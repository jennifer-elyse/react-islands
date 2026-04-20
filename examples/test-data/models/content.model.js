import { listSurfProducts } from '../../_shared/data/surf-shop.js';

const heroBanners = [
	{
		title: 'Test Data Drop',
		subtitle: 'Local CMS-style content, no vendor keys required.',
	},
	{
		title: 'Surf Shop Fixtures',
		subtitle: 'Backed by the same repository test catalog used for products and search.',
	},
];

export const getHeroBanners = async () => heroBanners;

export const getLandingPage = async (slug = 'home') => {
	const featured = listSurfProducts({ limit: 3 }).products;

	return {
		slug,
		title: 'Test Data ',
		blocks: [
			{
				type: 'hero',
				title: 'Beach Glass Weekend',
				subtitle:
					'Sun-washed boards, easy local search, and playful surf-shop data all running from checked-in fixtures.',
				eyebrow: 'Liquid Glass Surf Data',
				image: '/images/liquid-glass-board.jpg',
			},
			{
				type: 'promo',
				title: 'Featured Products',
				body: featured.map((product) => product.name).join(', '),
			},
			{
				type: 'promo',
				title: 'Why This ExampleExists',
				body: 'Use it to verify islands, search, routing, and product rendering without external services.',
			},
			{ type: 'product_search', islandKey: 'product_search', hydrate: 'immediate' },
			{ type: 'cart_mini', islandKey: 'cart', hydrate: 'immediate' },
		],
	};
};
