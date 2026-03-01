// models/search.model.js

import { apiRoot } from './commercetools.client.js';

import { parseEdge } from './validate.js';

import { productProjectionPagedQueryResponseSchema } from './schemas/productSchemas.js';

import { normalizeProduct, pickLocalized } from './product.model.js';

const DEFAULT_LOCALE = process.env.DEFAULT_LOCALE || 'en-US';
const DEFAULT_CURRENCY = process.env.CART_CURRENCY || 'USD';

/**
 * Search products using Product Projection Search (text-based)
 * Returns normalized products with facets
 */
const searchProducts = async ({
	query,
	limit = 20,
	offset = 0,
	locale = DEFAULT_LOCALE,
	currency = DEFAULT_CURRENCY,
	filters = {},
	facets = [],
} = {}) => {
	const queryArgs = {
		staged: false,
		limit,
		offset,
		localeProjection: locale,
		priceCurrency: currency,
	};

	// Add text search if provided
	if (query && query.trim()) {
		queryArgs['text.' + locale] = query.trim();
		queryArgs.fuzzy = true;
	}

	// Add filters
	const filterParams = [];

	if (filters.categoryId) {
		filterParams.push(`categories.id:"${filters.categoryId}"`);
	}

	if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
		const min = filters.priceMin !== undefined ? filters.priceMin : '*';
		const max = filters.priceMax !== undefined ? filters.priceMax : '*';
		filterParams.push(`variants.price.centAmount:range(${min} to ${max})`);
	}

	if (filters.brand) {
		filterParams.push(`variants.attributes.brand:"${filters.brand}"`);
	}

	if (filterParams.length > 0) {
		queryArgs.filter = filterParams;
	}

	// Add facets for aggregations
	if (facets.length > 0) {
		queryArgs.facet = facets;
	}

	try {
		const response = await apiRoot.productProjections().search().get({ queryArgs }).execute();

		const body = parseEdge(productProjectionPagedQueryResponseSchema, response.body, {
			label: 'ct.productProjections.search',
		});
		const results = body.results || [];

		return {
			products: results.map((p) => normalizeProduct(p, locale, currency)),
			total: body.total || results.length,
			offset: body.offset || offset,
			count: body.count || results.length,
			facets: response.body.facets || {},
		};
	} catch (err) {
		console.error('Search error:', err);
		throw err;
	}
};

/**
 * Search suggestions (typeahead) - returns products and categories for autocomplete
 * Supports fuzzy matching for typo tolerance
 */
const searchSuggestions = async ({
	query,
	limit = 10,
	locale = DEFAULT_LOCALE,
	currency = DEFAULT_CURRENCY,
	fuzzy = true,
	includeCategories = true,
} = {}) => {
	if (!query || query.trim().length < 2) {
		return { suggestions: [] };
	}

	const searchTerm = query.trim();
	const suggestions = [];

	try {
		// Try the suggestions API first (fastest)
		const suggestResponse = await apiRoot
			.productProjections()
			.suggest()
			.get({
				queryArgs: {
					['searchKeywords.' + locale]: searchTerm,
					limit: Math.ceil(limit / 2),
					staged: false,
					fuzzy,
				},
			})
			.execute();

		const keywordSuggestions = suggestResponse.body['searchKeywords.' + locale] || [];

		for (const s of keywordSuggestions) {
			suggestions.push({
				id: `kw-${s.text}`,
				type: 'keyword',
				text: s.text,
				score: s.score,
			});
		}
	} catch (err) {
		// Suggestions API not configured, continue with search fallback
		console.warn('Suggestions API not available:', err.message);
	}

	// Also search for actual products to show with images/prices
	try {
		const productLimit = Math.max(limit - suggestions.length, 4);

		const searchResponse = await apiRoot
			.productProjections()
			.search()
			.get({
				queryArgs: {
					['text.' + locale]: searchTerm,
					fuzzy,
					fuzzyLevel: 1,
					staged: false,
					limit: productLimit,
					localeProjection: locale,
					priceCurrency: currency,
				},
			})
			.execute();

		const products = searchResponse.body.results || [];

		for (const p of products) {
			const normalized = normalizeProduct(p, locale, currency);
			suggestions.push({
				id: p.id,
				type: 'product',
				text: normalized.name,
				slug: normalized.slug,
				imageUrl: normalized.imageUrl,
				price: normalized.price?.display,
				sku: normalized.sku,
			});
		}
	} catch (err) {
		console.error('Product search fallback failed:', err.message);
	}

	// Optionally search categories
	if (includeCategories && suggestions.length < limit) {
		try {
			const categoryResponse = await apiRoot
				.categories()
				.get({
					queryArgs: {
						where: `name(${locale}="${searchTerm}*")`,
						limit: 3,
					},
				})
				.execute();

			for (const cat of categoryResponse.body.results || []) {
				const name = pickLocalized(cat.name, locale);
				const slug = pickLocalized(cat.slug, locale);

				suggestions.push({
					id: cat.id,
					type: 'category',
					text: name,
					slug: slug,
				});
			}
		} catch (err) {
			// Category search is optional, ignore errors
		}
	}

	// Dedupe by text and limit
	const seen = new Set();
	const deduped = suggestions.filter((s) => {
		const key = s.text.toLowerCase();
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});

	return {
		suggestions: deduped.slice(0, limit),
	};
};

/**
 * Hydrate product IDs into full product projections
 * Used with Product Search API (ID-first approach)
 */
const hydrateProductIds = async ({ productIds, locale = DEFAULT_LOCALE, currency = DEFAULT_CURRENCY } = {}) => {
	if (!productIds || productIds.length === 0) {
		return [];
	}

	// Build where clause for ID lookup
	const idList = productIds.map((id) => `"${id}"`).join(',');

	const response = await apiRoot
		.productProjections()
		.get({
			queryArgs: {
				staged: false,
				where: `id in (${idList})`,
				limit: productIds.length,
				localeProjection: locale,
				priceCurrency: currency,
			},
		})
		.execute();

	const body = parseEdge(productProjectionPagedQueryResponseSchema, response.body, {
		label: 'ct.productProjections.hydrate',
	});

	// Create a map for fast lookup
	const productMap = new Map();
	for (const p of body.results) {
		productMap.set(p.id, normalizeProduct(p, locale, currency));
	}

	// Return in the original order (important for search relevance)
	return productIds.map((id) => productMap.get(id)).filter(Boolean);
};

export { searchProducts, searchSuggestions, hydrateProductIds };
