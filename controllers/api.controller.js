// controllers/api.controller.js

import { searchProducts, searchSuggestions } from '../models/search.model.js';

import { getCartView, addItemAndGetView, updateItemAndGetView } from '../models/cart.model.js';

import { getSocialFeed } from '../models/contentstack.model.js';

import {
	registerConnection,
	removeConnection,
	getBufferedEvents,
	startPingInterval,
} from '../services/eventsService.js';

const getCurrency = (req) => {
	return req.session.currency || process.env.CART_CURRENCY || 'USD';
};

const getLocale = (req) => {
	return req.session.locale || process.env.DEFAULT_LOCALE || 'en-US';
};

/**
 * Search products API (for typeahead island)
 */
const apiSearchProducts = async (req, res) => {
	try {
		const query = req.query.q || '';
		const limit = Math.min(parseInt(req.query.limit) || 10, 50);
		const offset = parseInt(req.query.offset) || 0;
		const locale = getLocale(req);
		const currency = getCurrency(req);

		const result = await searchProducts({
			query,
			limit,
			offset,
			locale,
			currency,
		});

		res.json({
			success: true,
			products: result.products,
			total: result.total,
			offset: result.offset,
		});
	} catch (err) {
		console.error('API search error:', err);
		res.status(500).json({
			success: false,
			error: 'Search failed',
		});
	}
};

/**
 * Search suggestions API (for typeahead)
 */
const apiSearchSuggestions = async (req, res) => {
	try {
		const query = req.query.q || '';
		const limit = Math.min(parseInt(req.query.limit) || 8, 20);
		const locale = getLocale(req);
		const currency = getCurrency(req);
		const fuzzy = req.query.fuzzy !== 'false';

		const result = await searchSuggestions({
			query,
			limit,
			locale,
			currency,
			fuzzy,
		});

		res.json({
			success: true,
			suggestions: result.suggestions,
		});
	} catch (err) {
		console.error('API suggestions error:', err);
		res.status(500).json({
			success: false,
			error: 'Suggestions failed',
		});
	}
};

/**
 * Get cart API
 */
const apiGetCart = async (req, res) => {
	try {
		const cartId = req.session.cartId;
		const currency = getCurrency(req);

		const cart = await getCartView({
			cartId,
			currencyCode: currency,
		});

		// Update session if cart was created
		req.session.cartId = cart.id;

		res.json({
			success: true,
			cart,
		});
	} catch (err) {
		console.error('API get cart error:', err);
		res.status(500).json({
			success: false,
			error: 'Failed to get cart',
		});
	}
};

/**
 * Add item to cart API
 */
const apiAddToCart = async (req, res) => {
	try {
		const { productId, variantId = 1, quantity = 1 } = req.body;

		if (!productId) {
			return res.status(400).json({
				success: false,
				error: 'productId is required',
			});
		}

		// Ensure we have a cart
		let cartId = req.session.cartId;
		if (!cartId) {
			const newCart = await getCartView({ currencyCode: getCurrency(req) });
			cartId = newCart.id;
			req.session.cartId = cartId;
		}

		const cart = await addItemAndGetView({
			cartId,
			productId,
			variantId: parseInt(variantId),
			quantity: parseInt(quantity),
		});

		req.session.cartId = cart.id;

		res.json({
			success: true,
			cart,
		});
	} catch (err) {
		console.error('API add to cart error:', err);
		res.status(500).json({
			success: false,
			error: err.message || 'Failed to add item',
		});
	}
};

/**
 * Update cart item API
 */
const apiUpdateCartItem = async (req, res) => {
	try {
		const { lineItemId } = req.params;
		const { quantity } = req.body;
		const cartId = req.session.cartId;

		if (!cartId) {
			return res.status(400).json({
				success: false,
				error: 'No cart found',
			});
		}

		const cart = await updateItemAndGetView({
			cartId,
			lineItemId,
			quantity: parseInt(quantity),
		});

		res.json({
			success: true,
			cart,
		});
	} catch (err) {
		console.error('API update cart error:', err);
		res.status(500).json({
			success: false,
			error: err.message || 'Failed to update item',
		});
	}
};

/**
 * Remove cart item API
 */
const apiRemoveCartItem = async (req, res) => {
	try {
		const { lineItemId } = req.params;
		const cartId = req.session.cartId;

		if (!cartId) {
			return res.status(400).json({
				success: false,
				error: 'No cart found',
			});
		}

		const cart = await updateItemAndGetView({
			cartId,
			lineItemId,
			quantity: 0,
		});

		res.json({
			success: true,
			cart,
		});
	} catch (err) {
		console.error('API remove from cart error:', err);
		res.status(500).json({
			success: false,
			error: err.message || 'Failed to remove item',
		});
	}
};

/**
 * Get social feed API
 */
const apiGetSocialFeed = async (req, res) => {
	try {
		const feedType = req.query.type || 'instagram';
		const limit = Math.min(parseInt(req.query.limit) || 6, 20);

		const posts = await getSocialFeed({ feedType, limit });

		res.json({
			success: true,
			posts,
		});
	} catch (err) {
		console.error('API social feed error:', err);
		res.status(500).json({
			success: false,
			error: 'Failed to get social feed',
		});
	}
};

/**
 * SSE Events endpoint
 */
const apiGetEvents = async (req, res) => {
	const customerId = req.session.customerId;

	// SSE headers
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache, no-transform');
	res.setHeader('Connection', 'keep-alive');
	res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

	// Flush headers
	res.flushHeaders();

	// Send retry hint
	res.write('retry: 3000\n\n');

	// Register connection (only for authenticated users)
	if (customerId) {
		registerConnection(customerId, res);

		// Replay buffered events since last event ID
		const lastEventId = req.headers['last-event-id'];
		const bufferedEvents = getBufferedEvents(customerId, lastEventId);

		for (const event of bufferedEvents) {
			const eventStr = `id: ${event.id}\nevent: ${event.type}\ndata: ${JSON.stringify(event.data)}\n\n`;
			res.write(eventStr);
		}

		// Start ping interval
		const pingInterval = startPingInterval(customerId);

		// Handle disconnect
		req.on('close', () => {
			clearInterval(pingInterval);
			removeConnection(customerId, res);
		});
	} else {
		// For unauthenticated users, just keep connection alive with pings
		const pingInterval = setInterval(() => {
			try {
				res.write(': ping\n\n');
			} catch (err) {
				clearInterval(pingInterval);
			}
		}, 30000);

		req.on('close', () => {
			clearInterval(pingInterval);
		});
	}

	// Send initial connection event
	res.write(`event: connected\ndata: ${JSON.stringify({ authenticated: !!customerId })}\n\n`);
};

export {
	apiSearchProducts,
	apiSearchSuggestions,
	apiGetCart,
	apiAddToCart,
	apiUpdateCartItem,
	apiRemoveCartItem,
	apiGetSocialFeed,
	apiGetEvents,
};
