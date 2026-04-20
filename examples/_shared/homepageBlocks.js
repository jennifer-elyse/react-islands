import { getCarouselBlock } from './carousels.js';

const slidesFromProducts = (products = [], limit = 5) =>
	(Array.isArray(products) ? products : [])
		.filter(Boolean)
		.slice(0, limit)
		.map((p) => ({
			eyebrow: p?.tags?.[0] || p?.categories?.[0] || 'Product',
			title: p?.name || 'Untitled',
			body: p?.description || '',
			image: p?.imageUrl || p?.images?.[0] || null,
		}))
		.filter((s) => s.image);

export const ensureBlock = (blocks, type, factory) => {
	if (!blocks.some((block) => block.type === type)) blocks.push(factory());
};

export const moveBlockAfter = (blocks, type, anchorType) => {
	const blockIndex = blocks.findIndex((block) => block.type === type);
	if (blockIndex === -1) return blocks;

	const anchorIndex = blocks.findIndex((block) => block.type === anchorType);
	if (anchorIndex === -1) return blocks;
	if (blockIndex === anchorIndex + 1) return blocks;

	const next = [...blocks];
	const [block] = next.splice(blockIndex, 1);
	const refreshedAnchorIndex = next.findIndex((item) => item.type === anchorType);
	next.splice(refreshedAnchorIndex + 1, 0, block);
	return next;
};

export const moveBlockToFront = (blocks, type) => {
	const blockIndex = blocks.findIndex((block) => block.type === type);
	if (blockIndex <= 0) return blocks;

	const next = [...blocks];
	const [block] = next.splice(blockIndex, 1);
	next.unshift(block);
	return next;
};

export const normalizeHomepageBlocks = (blocks = [], demoName, { products = [] } = {}) => {
	const next = [...blocks];

	ensureBlock(next, 'product_search', () => ({
		type: 'product_search',
		islandKey: 'product_search',
		hydrate: 'immediate',
	}));
	ensureBlock(next, 'cart_mini', () => ({
		type: 'cart_mini',
		islandKey: 'cart',
		hydrate: 'immediate',
	}));
	ensureBlock(next, 'carousel', () => ({
		...getCarouselBlock(demoName, {
			slides: slidesFromProducts(products, 6),
		}),
	}));

	if (demoName === 'test-data') {
		const fallbackSlides = slidesFromProducts(products, 6);
		for (let index = 0; index < next.length; index += 1) {
			const block = next[index];
			if (block?.type !== 'carousel') continue;

			const preset = getCarouselBlock('test-data', {
				slides: Array.isArray(block?.slides) && block.slides.length ? block.slides : fallbackSlides,
			});

			next[index] = {
				...block,
				...preset,
				type: 'carousel',
				slides: preset.slides,
				options: {
					...(block?.options || {}),
					...(preset.options || {}),
				},
			};
		}
	}

	if (next.some((block) => block.type === 'hero')) {
		const searchAfterHero = moveBlockAfter(next, 'product_search', 'hero');
		return moveBlockAfter(searchAfterHero, 'carousel', 'product_search');
	}

	const searchFirst = moveBlockToFront(next, 'product_search');
	return moveBlockAfter(searchFirst, 'carousel', 'product_search');
};
