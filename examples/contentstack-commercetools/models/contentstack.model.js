import { createCmsClient } from '../../_shared/contentstack-sdk.js';

const isConfiguredValue = (value) => {
	const normalized = String(value || '').trim();
	if (!normalized) return false;
	if (/^(your-|change-me|example|placeholder)/i.test(normalized)) return false;
	return true;
};

const hasCmsConfig = () =>
	['CONTENTSTACK_API_KEY', 'CONTENTSTACK_DELIVERY_TOKEN', 'CONTENTSTACK_ENVIRONMENT'].every((name) =>
		isConfiguredValue(process.env[name]),
	);

let didWarnMissingConfig = false;
let didWarnCmsError = false;
let cmsUnavailable = false;

const warnMissingConfig = () => {
	if (didWarnMissingConfig) return;
	didWarnMissingConfig = true;
	console.warn('[contentstack-commercetools] Missing CONTENTSTACK_* env; using built-in examplecontent.');
};

const warnCmsError = (error) => {
	if (didWarnCmsError) return;
	didWarnCmsError = true;

	if (error?.error_code === 109 || error?.status === 412) {
		cmsUnavailable = true;
		console.warn('[contentstack-commercetools] Contentstack stack cannot be found. Check CONTENTSTACK_API_KEY.');
		return;
	}

	console.warn(
		'[contentstack-commercetools] Falling back to built-in examplecontent after CMS error:',
		error?.message || error,
	);
};

const getContentTypeUid = (name, fallback) => {
	const v = process.env[name];
	return v && v.trim() ? v.trim() : fallback;
};

const LANDING_SLUG_FIELD = process.env.CONTENTSTACK_LANDING_SLUG_FIELD || 'slug';

const PRODUCT_TYPE_UID = getContentTypeUid('CONTENTSTACK_PRODUCT_TYPE', 'product');
const PRODUCT_SKU_FIELD = process.env.CONTENTSTACK_PRODUCT_SKU_FIELD || 'sku';
const PRODUCT_IMAGE_FIELD = process.env.CONTENTSTACK_PRODUCT_IMAGE_FIELD || 'image';
const PRODUCT_IMAGES_FIELD = process.env.CONTENTSTACK_PRODUCT_IMAGES_FIELD || 'images';

const getStack = () => createCmsClient().stack;

const getFallbackPage = (slug = 'home') => ({
	isFallback: true,
	title: slug === 'home' ? 'Contentstack + Commercetools' : 'Page',
	blocks: [
		{
			type: 'hero',
			title: 'Mix & Match',
			subtitle: 'A grocery-style fallback homepage powered by the shared component design system.',
			image: '/app-images/fruit-basket.png',
			ctaLabel: 'Shop now',
			href: '/products',
		},
		{
			type: 'promo',
			title: 'Weekly Savings',
			body: 'Merchandising blocks and promotional rails rendered through the shared library until Contentstack is configured.',
		},
		{
			type: 'product_search',
			islandKey: 'product_search',
			hydrate: 'immediate',
		},
		{
			type: 'cart_mini',
			islandKey: 'cart',
			hydrate: 'immediate',
		},
	],
});

const applyQuery = (queryObj, q) => {
	if (!queryObj || typeof queryObj !== 'object') return;
	for (const [key, value] of Object.entries(queryObj)) {
		q.where(key, value);
	}
};

const fetchEntries = async (contentType, { query = {}, locale = 'en-us' } = {}) => {
	try {
		if (cmsUnavailable || !hasCmsConfig()) {
			warnMissingConfig();
			return [];
		}

		const stack = getStack();
		const q = stack.ContentType(contentType).Query();

		if (locale && typeof q.language === 'function') {
			q.language(locale);
		}

		const queryObj = typeof query.query === 'string' ? JSON.parse(query.query) : query.query;
		applyQuery(queryObj, q);

		const result = await q.toJSON().find();
		const entries = Array.isArray(result) ? result[0] || [] : [];
		return entries;
	} catch (error) {
		warnCmsError(error);
		return [];
	}
};

export const getLandingPage = async (slug, { locale = 'en-us' } = {}) => {
	const contentType = getContentTypeUid('CONTENTSTACK_LANDING_TYPE', 'page');
	const tryFields = [LANDING_SLUG_FIELD, 'url_slug', 'slug'].filter(
		(field, idx, arr) => field && arr.indexOf(field) === idx,
	);

	for (const field of tryFields) {
		const entries = await fetchEntries(contentType, {
			query: { query: JSON.stringify({ [field]: slug }) },
			locale,
		});
		if (entries.length) return entries[0];
	}

	return getFallbackPage(slug);
};

export const getHeroBanners = async ({ locale = 'en-us' } = {}) => {
	const contentType = getContentTypeUid('CONTENTSTACK_HERO_TYPE', 'page');
	try {
		return await fetchEntries(contentType, { locale });
	} catch {
		return [];
	}
};

const normalizeAssetUrl = (asset) => {
	if (!asset) return null;
	if (typeof asset === 'string') return asset;
	if (typeof asset.url === 'string') return asset.url;
	return null;
};

const extractProductImages = (entry) => {
	if (!entry) return { imageUrl: null, images: [] };
	const images = [];

	const primary = entry[PRODUCT_IMAGE_FIELD];
	if (Array.isArray(primary)) {
		for (const item of primary) {
			const url = normalizeAssetUrl(item);
			if (url) images.push(url);
		}
	} else {
		const url = normalizeAssetUrl(primary);
		if (url) images.push(url);
	}

	const gallery = entry[PRODUCT_IMAGES_FIELD];
	if (Array.isArray(gallery)) {
		for (const item of gallery) {
			const url = normalizeAssetUrl(item);
			if (url) images.push(url);
		}
	}

	return {
		imageUrl: images[0] || null,
		images,
	};
};

export const getProductImagesBySkus = async (skus, { locale = 'en-us' } = {}) => {
	const uniqueSkus = Array.from(new Set((skus || []).filter(Boolean)));
	if (!uniqueSkus.length) return {};

	let entries = [];
	try {
		entries = await fetchEntries(PRODUCT_TYPE_UID, {
			query: { [PRODUCT_SKU_FIELD]: { $in: uniqueSkus } },
			locale,
		});
	} catch {
		entries = [];
		for (const sku of uniqueSkus) {
			const results = await fetchEntries(PRODUCT_TYPE_UID, {
				query: { [PRODUCT_SKU_FIELD]: sku },
				locale,
			});
			if (results.length) entries.push(results[0]);
		}
	}

	const map = {};
	for (const entry of entries) {
		const sku = entry?.[PRODUCT_SKU_FIELD];
		if (!sku) continue;
		map[sku] = extractProductImages(entry);
	}

	return map;
};
