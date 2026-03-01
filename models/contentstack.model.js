// models/contentstackModel.js

import 'dotenv/config';

const CONTENTSTACK_API_KEY = process.env.CONTENTSTACK_API_KEY;
const CONTENTSTACK_DELIVERY_TOKEN = process.env.CONTENTSTACK_DELIVERY_TOKEN;
const CONTENTSTACK_ENVIRONMENT = process.env.CONTENTSTACK_ENVIRONMENT || 'production';
const CONTENTSTACK_REGION = process.env.CONTENTSTACK_REGION || 'us';

// Determine base URL based on region
const getBaseUrl = () => {
	switch (CONTENTSTACK_REGION.toLowerCase()) {
		case 'eu':
			return 'https://eu-cdn.contentstack.com/v3';
		case 'azure-na':
			return 'https://azure-na-cdn.contentstack.com/v3';
		case 'azure-eu':
			return 'https://azure-eu-cdn.contentstack.com/v3';
		default:
			return 'https://cdn.contentstack.io/v3';
	}
};

const BASE_URL = getBaseUrl();

// Simple in-memory cache for CMS content
const contentCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const getCacheKey = (contentType, query) => {
	return `${contentType}:${JSON.stringify(query)}`;
};

const readCache = (key) => {
	const entry = contentCache.get(key);
	if (!entry) return null;

	if (Date.now() >= entry.expiresAt) {
		contentCache.delete(key);
		return null;
	}

	return entry.value;
};

const writeCache = (key, value) => {
	contentCache.set(key, {
		expiresAt: Date.now() + CACHE_TTL_MS,
		value,
	});
};

/**
 * Fetch entries from Contentstack
 */
const fetchEntries = async (contentType, { query = {}, locale = 'en-us' } = {}) => {
	if (!CONTENTSTACK_API_KEY || !CONTENTSTACK_DELIVERY_TOKEN) {
		console.warn('Contentstack credentials not configured, returning mock data');
		return getMockContent(contentType);
	}

	const cacheKey = getCacheKey(contentType, { ...query, locale });
	const cached = readCache(cacheKey);

	if (cached) {
		return cached;
	}

	try {
		const params = new URLSearchParams({
			environment: CONTENTSTACK_ENVIRONMENT,
			locale,
			...query,
		});

		const response = await fetch(`${BASE_URL}/content_types/${contentType}/entries?${params}`, {
			headers: {
				api_key: CONTENTSTACK_API_KEY,
				access_token: CONTENTSTACK_DELIVERY_TOKEN,
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			throw new Error(`Contentstack error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();

		writeCache(cacheKey, data.entries || []);

		return data.entries || [];
	} catch (err) {
		console.error('Contentstack fetch error:', err);
		return getMockContent(contentType);
	}
};

/**
 * Fetch a single entry by UID
 */
const fetchEntryByUid = async (contentType, uid, { locale = 'en-us' } = {}) => {
	if (!CONTENTSTACK_API_KEY || !CONTENTSTACK_DELIVERY_TOKEN) {
		return getMockEntry(contentType, uid);
	}

	const cacheKey = `${contentType}:uid:${uid}:${locale}`;
	const cached = readCache(cacheKey);

	if (cached) {
		return cached;
	}

	try {
		const params = new URLSearchParams({
			environment: CONTENTSTACK_ENVIRONMENT,
			locale,
		});

		const response = await fetch(`${BASE_URL}/content_types/${contentType}/entries/${uid}?${params}`, {
			headers: {
				api_key: CONTENTSTACK_API_KEY,
				access_token: CONTENTSTACK_DELIVERY_TOKEN,
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			return null;
		}

		const data = await response.json();

		writeCache(cacheKey, data.entry);

		return data.entry;
	} catch (err) {
		console.error('Contentstack fetch error:', err);
		return getMockEntry(contentType, uid);
	}
};

/**
 * Get banner content for a specific banner/store
 */
const getBannerContent = async (bannerId, { locale = 'en-us' } = {}) => {
	const entries = await fetchEntries('banner', {
		query: { query: JSON.stringify({ banner_id: bannerId }) },
		locale,
	});

	return entries[0] || getMockBanner(bannerId);
};

/**
 * Get hero banners for homepage
 */
const getHeroBanners = async ({ locale = 'en-us', storeKey = null } = {}) => {
	const query = {
		query: JSON.stringify({
			is_active: true,
			...(storeKey && { store_key: storeKey }),
		}),
	};

	const entries = await fetchEntries('hero_banner', { query, locale });

	if (entries.length === 0) {
		return getMockHeroBanners();
	}

	return entries;
};

/**
 * Get promotional modules for a page
 */
const getPromoModules = async ({ page = 'home', storeKey = null, locale = 'en-us' } = {}) => {
	const query = {
		query: JSON.stringify({
			page,
			is_active: true,
			...(storeKey && { store_key: storeKey }),
		}),
	};

	const entries = await fetchEntries('promo_module', { query, locale });

	if (entries.length === 0) {
		return getMockPromoModules(page);
	}

	return entries;
};

/**
 * Get landing page content by slug
 */
const getLandingPage = async (slug, { locale = 'en-us' } = {}) => {
	const entries = await fetchEntries('landing_page', {
		query: { query: JSON.stringify({ url_slug: slug }) },
		locale,
	});

	return entries[0] || null;
};

/**
 * Get navigation/menu content
 */
const getNavigation = async ({ menuId = 'main', locale = 'en-us' } = {}) => {
	const entries = await fetchEntries('navigation', {
		query: { query: JSON.stringify({ menu_id: menuId }) },
		locale,
	});

	return entries[0] || getMockNavigation();
};

/**
 * Get social feed content
 */
const getSocialFeed = async ({ feedType = 'instagram', limit = 6 } = {}) => {
	const entries = await fetchEntries('social_post', {
		query: {
			query: JSON.stringify({ platform: feedType }),
			limit: limit,
		},
	});

	if (entries.length === 0) {
		return getMockSocialFeed(feedType, limit);
	}

	return entries;
};

// Mock data functions for development/fallback
const getMockContent = (contentType) => {
	switch (contentType) {
		case 'hero_banner':
			return getMockHeroBanners();
		case 'promo_module':
			return getMockPromoModules('home');
		case 'navigation':
			return [getMockNavigation()];
		case 'social_post':
			return getMockSocialFeed('instagram', 6);
		default:
			return [];
	}
};

const getMockEntry = (contentType, uid) => {
	return {
		uid,
		title: `Mock ${contentType}`,
		content: 'This is mock content for development.',
	};
};

const getMockBanner = (bannerId) => {
	return {
		uid: `mock-banner-${bannerId}`,
		banner_id: bannerId,
		title: 'Fresh Groceries Delivered',
		subtitle: 'Shop local, eat fresh',
		image_url: '/images/hero-placeholder.jpg',
		cta_text: 'Shop Now',
		cta_link: '/category/fresh-produce',
	};
};

const getMockHeroBanners = () => {
	return [
		{
			uid: 'mock-hero-1',
			title: 'Fresh Groceries Delivered',
			subtitle: 'Shop local, eat fresh. Free delivery on orders over $50.',
			image_url: '/images/hero-groceries.jpg',
			cta_text: 'Shop Now',
			cta_link: '/category/fresh-produce',
			background_color: '#f8f9fa',
		},
		{
			uid: 'mock-hero-2',
			title: 'Weekly Specials',
			subtitle: 'Save up to 30% on selected items.',
			image_url: '/images/hero-specials.jpg',
			cta_text: 'View Deals',
			cta_link: '/specials',
			background_color: '#fff3cd',
		},
	];
};

const getMockPromoModules = (page) => {
	return [
		{
			uid: 'mock-promo-1',
			module_type: 'category_tiles',
			title: 'Shop by Category',
			items: [
				{
					title: 'Fresh Produce',
					image: '/images/cat-produce.jpg',
					link: '/category/produce',
				},
				{ title: 'Dairy & Eggs', image: '/images/cat-dairy.jpg', link: '/category/dairy' },
				{ title: 'Bakery', image: '/images/cat-bakery.jpg', link: '/category/bakery' },
				{ title: 'Meat & Seafood', image: '/images/cat-meat.jpg', link: '/category/meat' },
			],
		},
		{
			uid: 'mock-promo-2',
			module_type: 'featured_products',
			title: 'Top Picks This Week',
			product_ids: [],
		},
	];
};

const getMockNavigation = () => {
	return {
		uid: 'mock-nav-main',
		menu_id: 'main',
		items: [
			{ label: 'Shop', link: '/category/all', children: [] },
			{ label: 'Deals', link: '/deals', children: [] },
			{ label: 'Recipes', link: '/recipes', children: [] },
			{ label: 'About', link: '/about', children: [] },
		],
	};
};

const getMockSocialFeed = (feedType, limit) => {
	const posts = [];
	for (let i = 0; i < limit; i++) {
		posts.push({
			uid: `mock-social-${i}`,
			platform: feedType,
			image_url: `/images/social-${i + 1}.jpg`,
			caption: `Check out our fresh ${feedType === 'instagram' ? '📸' : ''} picks!`,
			link: `https://${feedType}.com/example/post${i}`,
			likes: Math.floor(Math.random() * 500) + 50,
		});
	}
	return posts;
};

const clearContentCache = () => {
	contentCache.clear();
};

export {
	fetchEntries,
	fetchEntryByUid,
	getBannerContent,
	getHeroBanners,
	getPromoModules,
	getLandingPage,
	getNavigation,
	getSocialFeed,
	clearContentCache,
};
