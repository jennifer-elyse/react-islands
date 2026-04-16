const surfSlides = [
	{
		eyebrow: 'Glass line',
		title: 'Liquid Glass Board',
		body: 'Pinned as the calm lead frame while the rest of the surf set keeps moving.',
		image: '/demo-images/liquid-glass-board.jpg',
	},
	{
		eyebrow: 'Fin set',
		title: 'Glacier Fins',
		body: 'A cooler translucent accent frame for side-scroll movement.',
		image: '/demo-images/liquid-glass-fins.jpg',
	},
	{
		eyebrow: 'Accessory',
		title: 'Pearl Goggles',
		body: 'Soft OKLab highlights and a glossy shell for quick carousel checks.',
		image: '/demo-images/liquid-glass-goggles.jpg',
	},
	{
		eyebrow: 'Leash',
		title: 'Tide Leash',
		body: 'Adds one more utility card so the pinned rail actually has room to scroll.',
		image: '/demo-images/liquid-glass-board.jpg',
	},
	{
		eyebrow: 'Wax kit',
		title: 'Mist Wax Set',
		body: 'A fifth frame gives the test-data carousel a real next and previous state.',
		image: '/demo-images/liquid-glass-fins.jpg',
	},
];

export const getCarouselSlidesFromProducts = (products = [], { limit } = {}) => {
	const sliced = (Array.isArray(products) ? products : []).filter(Boolean).slice(0, limit || products.length);

	return sliced
		.map((product) => ({
			eyebrow: product?.tags?.[0] || product?.categories?.[0] || 'Product',
			title: product?.name || 'Untitled product',
			body: product?.description || '',
			image: product?.imageUrl || product?.images?.[0] || null,
		}))
		.filter((slide) => slide.image);
};

export const getDemoCarouselBlock = (demo, { slides } = {}) => {
	if (demo === 'test-data-demo') {
		return {
			type: 'carousel',
			title: 'Surf Carousel Lab',
			variant: 'pin-first-marquee',
			accentIconSrc: '/demo-images/glass-surf-icon.svg',
			options: {
				pauseOnHover: true,
				freezeFirstFrame: true,
				showArrows: true,
				showDots: false,
				autoPlayMs: 0,
			},
			slides: slides || surfSlides,
		};
	}

	if (demo === 'contentstack-commercetools-demo') {
		return {
			type: 'carousel',
			title: 'CMS + Commerce Highlights',
			variant: 'spotlight-dots',
			options: {
				showDots: true,
				showArrows: true,
				autoPlayMs: 3200,
				pauseOnHover: true,
			},
			slides: slides || [
				{
					eyebrow: 'Contentstack',
					title: 'Campaign Hero',
					body: 'One frame at a time so editorial storytelling stays focused.',
					image: '/demo-images/liquid-glass-board.jpg',
				},
				{
					eyebrow: 'Commercetools',
					title: 'Catalog Moment',
					body: 'The active dot fills as the product narrative advances.',
					image: '/demo-images/liquid-glass-fins.jpg',
				},
				{
					eyebrow: 'Integrated',
					title: 'Search To Cart',
					body: 'A compact framed spotlight for the content-plus-commerce path.',
					image: '/demo-images/liquid-glass-goggles.jpg',
				},
			],
		};
	}

	if (demo === 'contentstack-demo') {
		return {
			type: 'carousel',
			title: 'Contentstack Story Frames',
			variant: 'editorial-stack',
			options: {
				showDots: false,
				showArrows: true,
				autoPlayMs: 0,
				pauseOnHover: true,
			},
			slides: slides || [
				{
					eyebrow: 'Story',
					title: 'Editorial Campaign',
					body: 'A stacked treatment for content-led merchandising.',
					image: '/demo-images/liquid-glass-board.jpg',
				},
				{
					eyebrow: 'Feature',
					title: 'Hero Module',
					body: 'A second frame to validate CMS-driven sequencing.',
					image: '/demo-images/liquid-glass-fins.jpg',
				},
				{
					eyebrow: 'CTA',
					title: 'Landing Flow',
					body: 'A softer third frame for homepage storytelling.',
					image: '/demo-images/liquid-glass-goggles.jpg',
				},
				{
					eyebrow: 'Follow-up',
					title: 'After Story',
					body: 'An extra editorial card ensures the story stack can actually advance.',
					image: '/demo-images/liquid-glass-board.jpg',
				},
			],
		};
	}

	if (demo === 'agility-demo') {
		return {
			type: 'carousel',
			title: 'Agility Motion Shelf',
			variant: 'floating-cards',
			options: {
				showDots: false,
				showArrows: true,
				autoPlayMs: 0,
				pauseOnHover: true,
			},
			slides: slides || [
				{
					eyebrow: 'Agility',
					title: 'Composable Content',
					body: 'A card-based carousel that feels more modular and block-driven.',
					image: '/demo-images/liquid-glass-board.jpg',
				},
				{
					eyebrow: 'Blocks',
					title: 'Flexible Layouts',
					body: 'Each frame reads like a movable content zone.',
					image: '/demo-images/liquid-glass-fins.jpg',
				},
				{
					eyebrow: 'Preview',
					title: 'Editorial Cards',
					body: 'Good for verifying CMS-friendly block rendering.',
					image: '/demo-images/liquid-glass-goggles.jpg',
				},
				{
					eyebrow: 'Pattern',
					title: 'Nested Modules',
					body: 'A fourth card gives the floating shelf a real lateral motion path.',
					image: '/demo-images/liquid-glass-board.jpg',
				},
			],
		};
	}

	return {
		type: 'carousel',
		title: 'Commerce Frames',
		variant: 'peek-strip',
		options: {
			showDots: false,
			showArrows: true,
			autoPlayMs: 0,
			pauseOnHover: true,
		},
		slides: slides || [
			{
				eyebrow: 'Board',
				title: 'Aqua Driftboard',
				body: 'A commerce-first carousel with peeking next cards.',
				image: '/demo-images/liquid-glass-board.jpg',
			},
			{
				eyebrow: 'Fin',
				title: 'Glacier Fins',
				body: 'Makes motion visible without taking over the page.',
				image: '/demo-images/liquid-glass-fins.jpg',
			},
			{
				eyebrow: 'Gear',
				title: 'Pearl Goggles',
				body: 'A simple product-focused strip for storefront validation.',
				image: '/demo-images/liquid-glass-goggles.jpg',
			},
			{
				eyebrow: 'Leash',
				title: 'Tide Leash',
				body: 'A fourth product card makes the commerce strip feel like a real carousel.',
				image: '/demo-images/liquid-glass-board.jpg',
			},
		],
	};
};
