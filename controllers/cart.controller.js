// controllers/cart.controller.js

import { getCartView, addItemAndGetView, updateItemAndGetView } from '../models/cart.model.js';

import { getCartIdFromSession, setCartIdOnSession } from './product.controller.js';

const getCurrency = (req) => {
	return req.session.currency || process.env.CART_CURRENCY || 'USD';
};

/**
 * Show cart page (SSR)
 */
const showCart = async (req, res, next) => {
	try {
		const cartView = await getCartView({
			cartId: getCartIdFromSession(req),
			currencyCode: getCurrency(req),
		});

		setCartIdOnSession(req, cartView.id);

		res.render('pages/cart', {
			seo: {
				title: 'Your Cart',
				description: 'Review your shopping cart and proceed to checkout.',
			},
			cart: cartView,
			totalQty: cartView.totalQty,
			islands: {
				cart: { enabled: true, props: { cartId: cartView.id } },
			},
		});
	} catch (err) {
		next(err);
	}
};

/**
 * Add item to cart (form action - works without JS)
 */
const addToCart = async (req, res, next) => {
	try {
		const cartId = getCartIdFromSession(req);
		const productId = req.body.productId;
		const variantId = parseInt(req.body.variantId) || 1;
		const quantity = parseInt(req.body.quantity) || 1;

		// Ensure we have a cart
		let currentCartId = cartId;
		if (!currentCartId) {
			const newCart = await getCartView({ currencyCode: getCurrency(req) });
			currentCartId = newCart.id;
			setCartIdOnSession(req, currentCartId);
		}

		const updatedView = await addItemAndGetView({
			cartId: currentCartId,
			productId,
			variantId,
			quantity,
		});

		setCartIdOnSession(req, updatedView.id);

		// Check if this is an AJAX request
		if (req.xhr || req.headers.accept?.includes('application/json')) {
			return res.json({
				success: true,
				cart: updatedView,
				totalQty: updatedView.totalQty,
			});
		}

		// Redirect back for form submissions
		res.redirect('back');
	} catch (err) {
		if (req.xhr || req.headers.accept?.includes('application/json')) {
			return res.status(500).json({
				success: false,
				error: err.message,
			});
		}
		next(err);
	}
};

/**
 * Update cart item quantity (form action)
 */
const updateCartItem = async (req, res, next) => {
	try {
		const cartId = getCartIdFromSession(req);
		const lineItemId = req.body.lineItemId;
		const quantity = parseInt(req.body.qty);

		if (!cartId) {
			if (req.xhr || req.headers.accept?.includes('application/json')) {
				return res.status(400).json({ success: false, error: 'No cart found' });
			}
			return res.redirect('/cart');
		}

		const updatedView = await updateItemAndGetView({
			cartId,
			lineItemId,
			quantity,
		});

		setCartIdOnSession(req, updatedView.id);

		if (req.xhr || req.headers.accept?.includes('application/json')) {
			return res.json({
				success: true,
				cart: updatedView,
				totalQty: updatedView.totalQty,
			});
		}

		res.redirect('/cart');
	} catch (err) {
		if (req.xhr || req.headers.accept?.includes('application/json')) {
			return res.status(500).json({
				success: false,
				error: err.message,
			});
		}
		next(err);
	}
};

/**
 * Remove item from cart
 */
const removeCartItem = async (req, res, next) => {
	try {
		const cartId = getCartIdFromSession(req);
		const lineItemId = req.body.lineItemId;

		if (!cartId) {
			if (req.xhr || req.headers.accept?.includes('application/json')) {
				return res.status(400).json({ success: false, error: 'No cart found' });
			}
			return res.redirect('/cart');
		}

		// Remove by setting quantity to 0
		const updatedView = await updateItemAndGetView({
			cartId,
			lineItemId,
			quantity: 0,
		});

		setCartIdOnSession(req, updatedView.id);

		if (req.xhr || req.headers.accept?.includes('application/json')) {
			return res.json({
				success: true,
				cart: updatedView,
				totalQty: updatedView.totalQty,
			});
		}

		res.redirect('/cart');
	} catch (err) {
		if (req.xhr || req.headers.accept?.includes('application/json')) {
			return res.status(500).json({
				success: false,
				error: err.message,
			});
		}
		next(err);
	}
};

export { showCart, addToCart, updateCartItem, removeCartItem };
