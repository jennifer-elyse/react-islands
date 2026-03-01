import { apiRoot, isDemoMode } from './commercetools.client.js';
import { listSurfProducts, getSurfProductBySku } from '../demo-data/surf-shop.js';

const DEFAULT_LOCALE = process.env.DEFAULT_LOCALE || 'en-US';
const DEFAULT_CURRENCY = process.env.CART_CURRENCY || 'USD';

const pickLocalized = (localized, locale) => {
	if (!localized) return undefined;
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

export const listProducts = async ({
	limit = 20,
	offset = 0,
	categoryId = null,
	locale = DEFAULT_LOCALE,
	currency = DEFAULT_CURRENCY,
} = {}) => {
	if (isDemoMode || !apiRoot) {
		return listSurfProducts({ limit, offset, currencyCode: currency });
	}

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
	const body = response.body || {};
	const results = body.results || [];

	return {
		products: results.map((p) => normalizeProduct(p, locale, currency)),
		total: body.total || results.length,
		offset: body.offset || offset,
		count: body.count || results.length,
	};
};

export const getProductBySlug = async (slug, { locale = DEFAULT_LOCALE, currency = DEFAULT_CURRENCY } = {}) => {
	if (isDemoMode || !apiRoot) {
		return getSurfProductBySku(slug, currency);
	}

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

	const body = response.body || {};
	if (!body.results || body.results.length === 0) {
		return null;
	}

	return normalizeProduct(body.results[0], locale, currency);
};

export const getProductById = async (id, { locale = DEFAULT_LOCALE, currency = DEFAULT_CURRENCY } = {}) => {
	if (isDemoMode || !apiRoot) {
		return null;
	}

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

	return normalizeProduct(response.body, locale, currency);
};
