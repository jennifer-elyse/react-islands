// controllers/search.controller.js

import { searchProducts } from '../models/search.model.js';

import { getCartView } from '../models/cart.model.js';

import { getPageLayout, getStoreConfig } from '../services/personalizationService.js';

import { getCartIdFromSession, setCartIdOnSession } from './product.controller.js';

const getCurrency = (req) => {
	return req.session.currency || process.env.CART_CURRENCY || 'USD';
};

const getLocale = (req) => {
	return req.session.locale || process.env.DEFAULT_LOCALE || 'en-US';
};

/**
 * Show search results page (SSR)
 */
const showSearchResults = async (req, res, next) => {
	try {
		const query = req.query.q || '';
		const page = parseInt(req.query.page) || 1;
		const limit = 20;
		const offset = (page - 1) * limit;
		const storeKey = req.session.storeKey;
		const customerId = req.session.customerId;
		const locale = getLocale(req);
		const currency = getCurrency(req);

		// Parse filters from query params
		const filters = {};
		if (req.query.category) {
			filters.categoryId = req.query.category;
		}
		if (req.query.priceMin) {
			filters.priceMin = parseInt(req.query.priceMin) * 100; // Convert to cents
		}
		if (req.query.priceMax) {
			filters.priceMax = parseInt(req.query.priceMax) * 100;
		}
		if (req.query.brand) {
			filters.brand = req.query.brand;
		}

		// Execute search and parallel fetches
		const [searchResult, cartView, layout, storeConfig] = await Promise.all([
			searchProducts({
				query,
				limit,
				offset,
				locale,
				currency,
				filters,
				facets: [
					'categories.id',
					'variants.attributes.brand',
					'variants.price.centAmount:range(0 to 1000),(1000 to 5000),(5000 to 10000),(10000 to *)',
				],
			}),
			getCartView({ cartId: getCartIdFromSession(req), currencyCode: currency }),
			getPageLayout({ page: 'search', storeKey, customerId, locale }),
			getStoreConfig(storeKey),
		]);

		setCartIdOnSession(req, cartView.id);

		const totalPages = Math.ceil(searchResult.total / limit);

		// Build SEO metadata
		const seo = {
			title: query ? `Search: "${query}" | ${storeConfig.name}` : `Search | ${storeConfig.name}`,
			description: query
				? `Search results for "${query}" at ${storeConfig.name}.`
				: `Search for groceries at ${storeConfig.name}.`,
			canonicalUrl: `/search${query ? '?q=' + encodeURIComponent(query) : ''}`,
			noindex: true, // Search pages typically shouldn't be indexed
		};

		res.render('pages/search', {
			seo,
			layout,
			storeConfig,
			query,
			products: searchResult.products,
			facets: searchResult.facets,
			filters,
			pagination: {
				currentPage: page,
				totalPages,
				total: searchResult.total,
				hasNext: page < totalPages,
				hasPrev: page > 1,
			},
			totalQty: cartView.totalQty,
			islands: {
				productSearch: { enabled: true, props: { currency, locale, initialQuery: query } },
				cart: { enabled: true, props: { cartId: cartView.id } },
			},
		});
	} catch (err) {
		next(err);
	}
};

export { showSearchResults };
