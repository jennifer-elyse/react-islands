import { getSurfCarouselSlides } from './data/surf-shop.js';

export const getCarouselSlidesFromProducts = (products = [], { limit } = {}) => {
	const sliced = (Array.isArray(products) ? products : []).filter(Boolean).slice(0, limit || products.length);

	return sliced.map((product) => ({
		title: product?.name || 'Untitled product',
		body: product?.description || '',
		image: product?.imageUrl || product?.images?.[0] || null,
	}));
};

export const getCarouselBlock = (experience, { slides } = {}) => {
	if (experience === 'test-data') {
		return {
			type: 'carousel',
			title: 'Surf Carousel Lab',
			variant: 'pin-first-marquee',
			options: {
				pauseOnHover: true,
				stickySlideCount: 1,
				visibleSlides: 2,
				stickySlideSizeRatio: '2:1',
				minHeight: 400,
				maxHeight: 400,
				slideImageTextRatio: [3, 2],
				showArrows: true,
				showDots: false,
				autoPlayMs: 0,
			},
			slides:
				slides ||
				getSurfCarouselSlides({
					skus: ['surf-001', 'surf-007', 'surf-009', 'surf-010', 'surf-002', 'surf-006'],
				}),
		};
	}

	if (experience === 'contentstack-commercetools') {
		return {
			type: 'carousel',
			title: 'Featured Item Picks',
			variant: 'spotlight-dots',
			options: {
				showDots: true,
				showArrows: true,
				arrowPosition: 'outer-sides',
				autoPlayMs: 3200,
				pauseOnHover: true,
			},
			slides:
				slides ||
				getSurfCarouselSlides({
					skus: ['surf-006', 'surf-001', 'surf-010'],
				}),
		};
	}

	if (experience === 'contentstack') {
		return {
			type: 'carousel',
			title: 'Story Picks',
			variant: 'editorial-stack',
			options: {
				showDots: false,
				showArrows: true,
				autoPlayMs: 3600,
				pauseOnHover: true,
			},
			slides:
				slides ||
				getSurfCarouselSlides({
					skus: ['surf-001', 'surf-007', 'surf-009'],
				}),
		};
	}

	if (experience === 'agility') {
		return {
			type: 'carousel',
			title: 'Surf Motion Shelf',
			variant: 'floating-cards',
			options: {
				showDots: true,
				showArrows: true,
				showPlayPause: true,
				autoPlayMs: 3400,
				pauseOnHover: true,
				loopNavButtons: true,
				visibleSlides: 2,
			},
			slides: slides || getSurfCarouselSlides(),
		};
	}

	return {
		type: 'carousel',
		title: 'Catalog Frames',
		variant: 'peek-strip',
		options: {
			showDots: true,
			showArrows: true,
			showPlayPause: true,
			autoPlayMs: 3000,
			pauseOnHover: true,
			visibleSlides: 2,
		},
		slides:
			slides ||
			getSurfCarouselSlides({
				skus: ['surf-001', 'surf-004', 'surf-009', 'surf-002', 'surf-006'],
			}),
	};
};
