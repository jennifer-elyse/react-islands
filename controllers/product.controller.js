// controllers/product.controller.js

import { listProducts, getProductBySlug } from '../models/product.model.js';

import { getCartView } from '../models/cart.model.js';

import { getPageLayout, getStoreConfig } from '../services/personalizationService.js';

// Session helpers
const getCartIdFromSession = (req) => {
	return req.session.cartId;
};

const setCartIdOnSession = (req, cartId) => {
	req.session.cartId = cartId;
};

const getCurrency = (req) => {
	return req.session.currency || process.env.CART_CURRENCY || 'USD';
};

const getLocale = (req) => {
	return req.session.locale || process.env.DEFAULT_LOCALE || 'en-US';
};

/**
 * Home page - SSR with personalization
 */
const showHomePage = async (req, res, next) => {
	try {
		const storeKey = req.session.storeKey;
		const customerId = req.session.customerId;
		const locale = getLocale(req);
		const currency = getCurrency(req);

		// Parallel fetches for performance
		const [layout, cartView, featuredProducts, storeConfig] = await Promise.all([
			getPageLayout({ page: 'home', storeKey, customerId, locale }),
			getCartView({ cartId: getCartIdFromSession(req), currencyCode: currency }),
			listProducts({ limit: 8, locale, currency }),
			getStoreConfig(storeKey),
		]);

		// Update session with cart ID
		setCartIdOnSession(req, cartView.id);

		// Build SEO metadata
		const seo = {
			title: `${storeConfig.name} | Fresh Groceries Delivered`,
			description: 'Shop fresh groceries online. Fast delivery, quality products, great prices.',
			canonicalUrl: '/',
			jsonLd: {
				'@context': 'https://schema.org',
				'@type': 'GroceryStore',
				name: storeConfig.name,
				url: req.protocol + '://' + req.get('host'),
			},
		};

		// Render with complete view model
		res.render('pages/home', {
			seo,
			layout,
			storeConfig,
			featuredProducts: featuredProducts.products,
			totalQty: cartView.totalQty,
			islands: {
				productSearch: { enabled: true, props: { currency, locale } },
				cart: { enabled: true, props: { cartId: cartView.id } },
				social: { enabled: true, props: { feedType: 'instagram', limit: 6 } },
			},
		});
	} catch (err) {
		next(err);
	}
};

/**
 * Category/PLP page - SSR
 */
const showCategoryPage = async (req, res, next) => {
	try {
		const { slug } = req.params;
		const page = parseInt(req.query.page) || 1;
		const limit = 20;
		const offset = (page - 1) * limit;
		const storeKey = req.session.storeKey;
		const customerId = req.session.customerId;
		const locale = getLocale(req);
		const currency = getCurrency(req);

		// Get layout and products
		const [layout, productsResult, cartView, storeConfig] = await Promise.all([
			getPageLayout({ page: 'category', storeKey, customerId, locale }),
			listProducts({ limit, offset, locale, currency }),
			getCartView({ cartId: getCartIdFromSession(req), currencyCode: currency }),
			getStoreConfig(storeKey),
		]);

		setCartIdOnSession(req, cartView.id);

		const totalPages = Math.ceil(productsResult.total / limit);

		// Build SEO metadata
		const categoryName = slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
		const seo = {
			title: `${categoryName} | ${storeConfig.name}`,
			description: `Shop ${categoryName.toLowerCase()} at ${storeConfig.name}. Fresh quality, fast delivery.`,
			canonicalUrl: `/category/${slug}`,
			jsonLd: {
				'@context': 'https://schema.org',
				'@type': 'CollectionPage',
				name: categoryName,
				url: req.protocol + '://' + req.get('host') + req.originalUrl,
			},
		};

		res.render('pages/category', {
			seo,
			layout,
			storeConfig,
			categoryName,
			categorySlug: slug,
			products: productsResult.products,
			pagination: {
				currentPage: page,
				totalPages,
				total: productsResult.total,
				hasNext: page < totalPages,
				hasPrev: page > 1,
			},
			totalQty: cartView.totalQty,
			islands: {
				productSearch: { enabled: true, props: { currency, locale } },
				cart: { enabled: true, props: { cartId: cartView.id } },
			},
		});
	} catch (err) {
		next(err);
	}
};

/**
 * Product Detail Page (PDP) - SSR
 */
const showProductDetailPage = async (req, res, next) => {
	try {
		const { slug } = req.params;
		const storeKey = req.session.storeKey;
		const customerId = req.session.customerId;
		const locale = getLocale(req);
		const currency = getCurrency(req);

		// Fetch product and cart in parallel
		const [product, cartView, layout, storeConfig] = await Promise.all([
			getProductBySlug(slug, { locale, currency }),
			getCartView({ cartId: getCartIdFromSession(req), currencyCode: currency }),
			getPageLayout({ page: 'product', storeKey, customerId, locale }),
			getStoreConfig(storeKey),
		]);

		if (!product) {
			return res.status(404).render('error', {
				title: '404 - Product Not Found',
				message: 'The product you requested could not be found.',
				totalQty: cartView?.totalQty || 0,
			});
		}

		setCartIdOnSession(req, cartView.id);

		// Build SEO metadata with structured data
		const seo = {
			title: `${product.name} | ${storeConfig.name}`,
			description:
				product.description || `Buy ${product.name} at ${storeConfig.name}. Fresh quality, fast delivery.`,
			canonicalUrl: `/product/${slug}`,
			jsonLd: {
				'@context': 'https://schema.org',
				'@type': 'Product',
				name: product.name,
				description: product.description,
				image: product.imageUrl,
				sku: product.sku,
				offers: {
					'@type': 'Offer',
					price: (product.price.centAmount / 100).toFixed(2),
					priceCurrency: product.price.currencyCode,
					availability: 'https://schema.org/InStock',
					seller: {
						'@type': 'Organization',
						name: storeConfig.name,
					},
				},
			},
		};

		res.render('pages/pdp', {
			seo,
			layout,
			storeConfig,
			product,
			totalQty: cartView.totalQty,
			islands: {
				productSearch: { enabled: true, props: { currency, locale } },
				cart: { enabled: true, props: { cartId: cartView.id } },
			},
		});
	} catch (err) {
		next(err);
	}
};

export { showHomePage, showCategoryPage, showProductDetailPage, getCartIdFromSession, setCartIdOnSession };
