// models/product.model.js

import { apiRoot } from './commercetools.client.js';

import { parseEdge } from './validate.js';

import { productProjectionPagedQueryResponseSchema, productProjectionSchema } from './schemas/productSchemas.js';

const DEFAULT_LOCALE = process.env.DEFAULT_LOCALE || 'en-US';
const DEFAULT_CURRENCY = process.env.CART_CURRENCY || 'USD';

// Cache controls
const getCacheTtlMs = () => {
	const n = Number(process.env.PRODUCTS_CACHE_TTL_MS);
	return Number.isFinite(n) && n >= 0 ? n : 60000;
};

const getCacheMaxEntries = () => {
	const n = Number(process.env.PRODUCTS_CACHE_MAX_ENTRIES);
	return Number.isFinite(n) && n > 0 ? n : 50;
};

const cacheKeyFromArgs = ({ limit, offset, categoryId }) => {
	return `limit=${limit}&offset=${offset}&category=${categoryId || 'all'}`;
};

// In-memory cache: key -> { expiresAt, value }
const productsCache = new Map();

// In-flight coalescing: key -> Promise
const inFlight = new Map();

const pickLocalized = (localized, locale) => {
	if (!localized) {
		return undefined;
	}

	return localized[locale] || Object.values(localized)[0];
};

const normalizeProduct = (product, locale = DEFAULT_LOCALE, currency = DEFAULT_CURRENCY) => {
	const variant = product.masterVariant;
	const prices = variant?.prices || [];
	const firstPrice = prices.find((p) => p.value?.currencyCode === currency)?.value || prices[0]?.value;
	const images = variant?.images || [];

	const name = pickLocalized(product.name, locale) || 'Unnamed product';
	const slug = pickLocalized(product.slug, locale);
	const description = pickLocalized(product.description, locale);

	const centAmount = firstPrice ? firstPrice.centAmount : 0;
	const currencyCode = firstPrice ? firstPrice.currencyCode : currency;

	return {
		id: product.id,
		sku: variant?.sku,
		name,
		slug,
		description,
		imageUrl: images[0]?.url || null,
		images: images.map((img) => img.url),
		price: {
			centAmount,
			currencyCode,
			display: `$${(centAmount / 100).toFixed(2)}`,
		},
		categories: product.categories?.map((c) => c.id) || [],
	};
};

const pruneCacheIfNeeded = () => {
	const maxEntries = getCacheMaxEntries();

	if (productsCache.size <= maxEntries) {
		return;
	}

	// Delete oldest entries first (Map preserves insertion order)
	while (productsCache.size > maxEntries) {
		const oldestKey = productsCache.keys().next().value;
		productsCache.delete(oldestKey);
	}
};

const readCache = (key) => {
	const entry = productsCache.get(key);
	if (!entry) {
		return null;
	}

	if (Date.now() >= entry.expiresAt) {
		productsCache.delete(key);
		return null;
	}

	return entry.value;
};

const writeCache = (key, value) => {
	const ttlMs = getCacheTtlMs();
	const expiresAt = Date.now() + ttlMs;

	productsCache.set(key, { expiresAt, value });

	pruneCacheIfNeeded();
};

const fetchAndNormalizeProducts = async ({ limit, offset, categoryId, locale, currency }) => {
	const queryArgs = {
		staged: false,
		limit,
		offset,
		localeProjection: locale,
		priceCurrency: currency,
	};

	if (categoryId) {
		queryArgs.filter = [`categories.id:"${categoryId}"`];
	}

	const response = await apiRoot.productProjections().get({ queryArgs }).execute();

	const body = parseEdge(productProjectionPagedQueryResponseSchema, response.body, {
		label: 'ct.productProjections.query',
	});
	const results = body.results;

	return {
		products: results.map((p) => normalizeProduct(p, locale, currency)),
		total: body.total || results.length,
		offset: body.offset || offset,
		count: body.count || results.length,
	};
};

const listProducts = async ({
	limit = 20,
	offset = 0,
	categoryId = null,
	locale = DEFAULT_LOCALE,
	currency = DEFAULT_CURRENCY,
} = {}) => {
	const key = cacheKeyFromArgs({ limit, offset, categoryId });
	const cached = readCache(key);

	if (cached) {
		return cached;
	}

	// Coalesce if already fetching this key
	const existing = inFlight.get(key);
	if (existing) {
		return existing;
	}

	const promise = (async () => {
		try {
			const result = await fetchAndNormalizeProducts({
				limit,
				offset,
				categoryId,
				locale,
				currency,
			});
			writeCache(key, result);
			return result;
		} finally {
			inFlight.delete(key);
		}
	})();

	inFlight.set(key, promise);

	return promise;
};

const getProductById = async (id, { locale = DEFAULT_LOCALE, currency = DEFAULT_CURRENCY } = {}) => {
	const response = await apiRoot
		.productProjections()
		.withId({ ID: id })
		.get({
			queryArgs: {
				staged: false,
				localeProjection: locale,
				priceCurrency: currency,
			},
		})
		.execute();

	const body = parseEdge(productProjectionSchema, response.body, {
		label: 'ct.productProjections.byId',
	});

	return normalizeProduct(body, locale, currency);
};

const getProductBySlug = async (slug, { locale = DEFAULT_LOCALE, currency = DEFAULT_CURRENCY } = {}) => {
	const response = await apiRoot
		.productProjections()
		.get({
			queryArgs: {
				staged: false,
				where: `slug(${locale}="${slug}")`,
				localeProjection: locale,
				priceCurrency: currency,
				limit: 1,
			},
		})
		.execute();

	const body = parseEdge(productProjectionPagedQueryResponseSchema, response.body, {
		label: 'ct.productProjections.bySlug',
	});

	if (!body.results || body.results.length === 0) {
		return null;
	}

	return normalizeProduct(body.results[0], locale, currency);
};

// Optional: let controllers/tests clear cache
const clearProductsCache = () => {
	productsCache.clear();
	inFlight.clear();
};

export { listProducts, getProductById, getProductBySlug, clearProductsCache, normalizeProduct, pickLocalized };
