// Demo Contentstack model (SDK-backed, matches main app auth behavior)
import { createCmsClient } from '../../_shared/runtime/src/server/sdk/contentstack.js';

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
	return await fetchEntries(contentType, { locale });
};
