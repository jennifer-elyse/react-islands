// Demo Contentstack model (SDK-backed, matches main app auth behavior)
import { createCmsClient } from '../../_shared/runtime/src/server/sdk/contentstack.js';

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
	console.warn('[contentstack-demo] Missing CONTENTSTACK_* env; using built-in demo content.');
};

const warnCmsError = (error) => {
	if (didWarnCmsError) return;
	didWarnCmsError = true;

	if (error?.error_code === 109 || error?.status === 412) {
		cmsUnavailable = true;
		console.warn('[contentstack-demo] Contentstack stack cannot be found. Check CONTENTSTACK_API_KEY.');
		return;
	}

	console.warn('[contentstack-demo] Falling back to built-in demo content after CMS error:', error?.message || error);
};

const getStack = () => createCmsClient().stack;

const applyQuery = (queryObj, q) => {
	if (!queryObj || typeof queryObj !== 'object') return;
	for (const [key, value] of Object.entries(queryObj)) {
		q.where(key, value);
	}
};

const getContentTypeUid = (name, fallback) => {
	const v = process.env[name];
	return v && v.trim() ? v.trim() : fallback;
};

const LANDING_SLUG_FIELD = process.env.CONTENTSTACK_LANDING_SLUG_FIELD || 'slug';

const getFallbackPage = (slug = 'home') => ({
	title: slug === 'home' ? 'Contentstack Demo' : 'Page',
	blocks: [
		{
			type: 'hero',
			title: 'Weekly Deals',
			subtitle: 'Running with built-in demo content until Contentstack is configured.',
		},
		{
			type: 'promo',
			title: 'Featured Stories',
			body: 'Editorial product groupings and promo content rendered from the shared fixture catalog.',
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
	return await fetchEntries(contentType, { locale });
};
