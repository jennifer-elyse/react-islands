// controllers/contentController.js

import { getLandingPage, getNavigation } from '../models/contentstackModel.js';

import { getCartView } from '../models/cartModel.js';

import { getStoreConfig } from '../services/personalizationService.js';

import { getCartIdFromSession, setCartIdOnSession } from './productController.js';

const getCurrency = (req) => {
	return req.session.currency || process.env.CART_CURRENCY || 'USD';
};

const getLocale = (req) => {
	return req.session.locale || process.env.DEFAULT_LOCALE || 'en-US';
};

/**
 * Show CMS-driven landing page
 */
const showLandingPage = async (req, res, next) => {
	try {
		const { slug } = req.params;
		const storeKey = req.session.storeKey;
		const locale = getLocale(req);
		const currency = getCurrency(req);

		// Fetch page content and supporting data
		const [pageContent, cartView, navigation, storeConfig] = await Promise.all([
			getLandingPage(slug, { locale }),
			getCartView({ cartId: getCartIdFromSession(req), currencyCode: currency }),
			getNavigation({ locale }),
			getStoreConfig(storeKey),
		]);

		if (!pageContent) {
			return res.status(404).render('error', {
				title: '404 - Page Not Found',
				message: 'The page you requested could not be found.',
				totalQty: cartView?.totalQty || 0,
			});
		}

		setCartIdOnSession(req, cartView.id);

		// Build SEO metadata from CMS content
		const seo = {
			title: pageContent.seo_title || pageContent.title || storeConfig.name,
			description: pageContent.seo_description || pageContent.excerpt || '',
			canonicalUrl: `/${req.path.split('/')[1]}/${slug}`,
			ogImage: pageContent.og_image?.url || pageContent.hero_image?.url,
			jsonLd: pageContent.structured_data || null,
		};

		// Render landing page template
		res.render('pages/landing', {
			seo,
			storeConfig,
			pageContent,
			navigation: navigation?.items || [],
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

export { showLandingPage };
