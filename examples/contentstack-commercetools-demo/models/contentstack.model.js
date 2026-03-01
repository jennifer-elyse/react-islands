import { createCmsClient } from '../../_shared/runtime/src/server/sdk/contentstack.js';

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

const applyQuery = (queryObj, q) => {
	if (!queryObj || typeof queryObj !== 'object') return;
	for (const [key, value] of Object.entries(queryObj)) {
		q.where(key, value);
	}
};

const fetchEntries = async (contentType, { query = {}, locale = 'en-us' } = {}) => {
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

	return null;
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
