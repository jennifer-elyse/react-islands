// models/cart.model.js

import { apiRoot, isDemoMode } from './commercetools.client.js';

import { getDemoProductById } from './demo.model.js';

import { parseEdge } from './validate.js';

import { cartSchema } from './schemas/cartSchemas.js';

import { pickLocalized } from './product.model.js';

const DEFAULT_LOCALE = process.env.DEFAULT_LOCALE || 'en-US';
const DEFAULT_CURRENCY = process.env.CART_CURRENCY || 'USD';

// Cache controls
const getCartCacheTtlMs = () => {
	const n = Number(process.env.CART_CACHE_TTL_MS);
	return Number.isFinite(n) && n >= 0 ? n : 1500;
};

const getCartCacheSWRMs = () => {
	const n = Number(process.env.CART_CACHE_SWR_MS);
	return Number.isFinite(n) && n >= 0 ? n : 5000;
};

const getCartCacheMaxEntries = () => {
	const n = Number(process.env.CART_CACHE_MAX_ENTRIES);
	return Number.isFinite(n) && n > 0 ? n : 200;
};

const getCartCurrency = () => {
	return process.env.CART_CURRENCY || 'USD';
};

// Cache: cartId -> { freshUntil, staleUntil, value }
const cartCache = new Map();

// In-flight coalescing: cartId -> Promise
const inFlight = new Map();

const demoCartState = {
	id: 'demo-cart',
	version: 1,
	items: [],
};

const getDemoPrice = (centAmount = 399) => ({
	centAmount,
	currencyCode: DEFAULT_CURRENCY,
	display: `$${(centAmount / 100).toFixed(2)}`,
});

const buildDemoCartView = () => {
	const items = demoCartState.items.map((item) => ({
		...item,
		totalPrice: getDemoPrice(item.pricePerUnit * item.qty),
	}));

	const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
	const totalAmount = items.reduce((sum, item) => sum + item.pricePerUnit * item.qty, 0);

	return {
		id: demoCartState.id,
		version: demoCartState.version,
		items,
		total: getDemoPrice(totalAmount),
		totalQty,
	};
};

const demoAddLineItem = ({ productId, quantity = 1 } = {}) => {
	const product = getDemoProductById(productId) || {
		id: productId,
		sku: productId,
		name: `Product ${productId}`,
		imageUrl: null,
		price: getDemoPrice(399),
	};

	const lineItemId = `li-${product.sku || product.id || productId}`;
	const existing = demoCartState.items.find((item) => item.lineItemId === lineItemId);

	if (existing) {
		existing.qty += quantity;
	} else {
		demoCartState.items.push({
			lineItemId,
			productId: product.id || productId,
			sku: product.sku || productId,
			name: product.name || 'Demo product',
			imageUrl: product.imageUrl || null,
			qty: quantity,
			pricePerUnit: product.price?.centAmount || 399,
		});
	}

	demoCartState.version += 1;
	return buildDemoCartView();
};

const demoSetLineItemQuantity = ({ lineItemId, quantity } = {}) => {
	const idx = demoCartState.items.findIndex((item) => item.lineItemId === lineItemId);
	if (idx === -1) return buildDemoCartView();

	if (!quantity || quantity <= 0) {
		demoCartState.items.splice(idx, 1);
	} else {
		demoCartState.items[idx].qty = quantity;
	}

	demoCartState.version += 1;
	return buildDemoCartView();
};

const normalizeCart = (cart, locale = DEFAULT_LOCALE) => {
	const items = (cart.lineItems || []).map((li) => {
		const name = pickLocalized(li.name, locale) || 'Unnamed item';
		const pricePerUnit = li.price?.value?.centAmount || 0;
		const imageUrl = li.variant?.images?.[0]?.url || null;

		return {
			lineItemId: li.id,
			productId: li.productId,
			sku: li.variant?.sku,
			name,
			imageUrl,
			qty: li.quantity,
			pricePerUnit,
			totalPrice: {
				centAmount: li.totalPrice.centAmount,
				currencyCode: li.totalPrice.currencyCode,
				display: `$${(li.totalPrice.centAmount / 100).toFixed(2)}`,
			},
		};
	});

	const totalQty = items.reduce((sum, item) => sum + item.qty, 0);

	return {
		id: cart.id,
		version: cart.version,
		items,
		total: {
			centAmount: cart.totalPrice.centAmount,
			currencyCode: cart.totalPrice.currencyCode,
			display: `$${(cart.totalPrice.centAmount / 100).toFixed(2)}`,
		},
		totalQty,
	};
};

const pruneCacheIfNeeded = () => {
	const maxEntries = getCartCacheMaxEntries();

	if (cartCache.size <= maxEntries) {
		return;
	}

	while (cartCache.size > maxEntries) {
		const oldestKey = cartCache.keys().next().value;
		cartCache.delete(oldestKey);
	}
};

const readCache = (cartId) => {
	const entry = cartCache.get(cartId);
	if (!entry) {
		return { hit: false };
	}

	const now = Date.now();

	if (now <= entry.freshUntil) {
		return { hit: true, kind: 'fresh', value: entry.value };
	}

	if (now <= entry.staleUntil) {
		return { hit: true, kind: 'stale', value: entry.value };
	}

	cartCache.delete(cartId);
	return { hit: false };
};

const writeCache = (cartId, value) => {
	const ttlMs = getCartCacheTtlMs();
	const swrMs = getCartCacheSWRMs();
	const now = Date.now();

	cartCache.set(cartId, {
		freshUntil: now + ttlMs,
		staleUntil: now + ttlMs + swrMs,
		value,
	});

	pruneCacheIfNeeded();
};

const invalidateCartCache = (cartId) => {
	if (!cartId) {
		return;
	}

	cartCache.delete(cartId);
	inFlight.delete(cartId);
};

const clearCartCache = () => {
	cartCache.clear();
	inFlight.clear();
};

const getCartById = async (cartId) => {
	if (isDemoMode || !apiRoot) {
		return buildDemoCartView();
	}
	try {
		const response = await apiRoot.carts().withId({ ID: cartId }).get().execute();

		const body = parseEdge(cartSchema, response.body, { label: 'ct.carts.byId' });

		return body;
	} catch (err) {
		if (err && err.statusCode === 404) {
			return null;
		}
		throw err;
	}
};

const createCart = async ({
	currencyCode = getCartCurrency(),
	anonymousId = undefined,
	customerId = undefined,
} = {}) => {
	if (isDemoMode || !apiRoot) {
		return buildDemoCartView();
	}
	const draft = {
		currency: currencyCode,
	};

	if (anonymousId) {
		draft.anonymousId = anonymousId;
	}

	if (customerId) {
		draft.customerId = customerId;
	}

	const response = await apiRoot.carts().post({ body: draft }).execute();

	const body = parseEdge(cartSchema, response.body, { label: 'ct.carts.create' });

	return body;
};

const getOrCreateCart = async ({
	cartId = undefined,
	currencyCode = getCartCurrency(),
	anonymousId = undefined,
	customerId = undefined,
} = {}) => {
	if (isDemoMode || !apiRoot) {
		return buildDemoCartView();
	}
	if (cartId) {
		const existing = await getCartById(cartId);
		if (existing) {
			return existing;
		}
	}

	return createCart({ currencyCode, anonymousId, customerId });
};

const fetchCartView = async ({
	cartId,
	currencyCode = getCartCurrency(),
	anonymousId = undefined,
	customerId = undefined,
} = {}) => {
	if (isDemoMode || !apiRoot) {
		return buildDemoCartView();
	}
	const cart = await getOrCreateCart({ cartId, currencyCode, anonymousId, customerId });
	return normalizeCart(cart);
};

const refreshCartView = async ({
	cartId,
	currencyCode = getCartCurrency(),
	anonymousId = undefined,
	customerId = undefined,
} = {}) => {
	if (isDemoMode || !apiRoot) {
		return buildDemoCartView();
	}
	const view = await fetchCartView({ cartId, currencyCode, anonymousId, customerId });
	writeCache(view.id, view);
	return view;
};

// SWR behavior:
// - fresh cache => return immediately
// - stale cache => return immediately AND trigger refresh in background (coalesced)
// - miss => await refresh (coalesced)
const getCartView = async ({
	cartId,
	currencyCode = getCartCurrency(),
	anonymousId = undefined,
	customerId = undefined,
} = {}) => {
	if (isDemoMode || !apiRoot) {
		return buildDemoCartView();
	}
	if (cartId) {
		const cached = readCache(cartId);

		if (cached.hit && cached.kind === 'fresh') {
			return cached.value;
		}

		if (cached.hit && cached.kind === 'stale') {
			const existing = inFlight.get(cartId);

			if (!existing) {
				const promise = (async () => {
					try {
						return await refreshCartView({
							cartId,
							currencyCode,
							anonymousId,
							customerId,
						});
					} finally {
						inFlight.delete(cartId);
					}
				})();

				inFlight.set(cartId, promise);

				// Fire-and-forget refresh (SWR)
				promise.catch(() => {});
			}

			return cached.value;
		}

		const existing = inFlight.get(cartId);
		if (existing) {
			return existing;
		}

		const promise = (async () => {
			try {
				return await refreshCartView({ cartId, currencyCode, anonymousId, customerId });
			} finally {
				inFlight.delete(cartId);
			}
		})();

		inFlight.set(cartId, promise);

		return promise;
	}

	// No cartId => create one, then cache it
	const view = await refreshCartView({
		cartId: undefined,
		currencyCode,
		anonymousId,
		customerId,
	});

	return view;
};

const addLineItem = async ({ cartId, productId, variantId = 1, quantity = 1 } = {}) => {
	if (isDemoMode || !apiRoot) {
		return demoAddLineItem({ productId, variantId, quantity });
	}
	if (!cartId) {
		throw new Error('cartId is required to addLineItem');
	}

	// Important: invalidate before the write so readers don't serve stale during mutation
	invalidateCartCache(cartId);

	const cart = await getCartById(cartId);
	if (!cart) {
		throw new Error(`Cart not found for id ${cartId}`);
	}

	const update = {
		version: cart.version,
		actions: [
			{
				action: 'addLineItem',
				productId,
				variantId,
				quantity,
			},
		],
	};

	const response = await apiRoot.carts().withId({ ID: cartId }).post({ body: update }).execute();

	const body = parseEdge(cartSchema, response.body, { label: 'ct.carts.addLineItem' });

	return body;
};

const setLineItemQuantity = async ({ cartId, lineItemId, quantity } = {}) => {
	if (isDemoMode || !apiRoot) {
		return demoSetLineItemQuantity({ lineItemId, quantity });
	}
	if (!cartId) {
		throw new Error('cartId is required to setLineItemQuantity');
	}

	invalidateCartCache(cartId);

	const cart = await getCartById(cartId);
	if (!cart) {
		throw new Error(`Cart not found for id ${cartId}`);
	}

	const actions =
		!quantity || quantity <= 0
			? [{ action: 'removeLineItem', lineItemId }]
			: [{ action: 'changeLineItemQuantity', lineItemId, quantity }];

	const update = {
		version: cart.version,
		actions,
	};

	const response = await apiRoot.carts().withId({ ID: cartId }).post({ body: update }).execute();

	const body = parseEdge(cartSchema, response.body, { label: 'ct.carts.setLineItemQuantity' });

	return body;
};

// View helpers for controllers (still data-only: returns normalized data)
const addItemAndGetView = async ({ cartId, productId, variantId = 1, quantity = 1 } = {}) => {
	if (isDemoMode || !apiRoot) {
		return demoAddLineItem({ productId, variantId, quantity });
	}
	const cart = await addLineItem({ cartId, productId, variantId, quantity });
	const view = normalizeCart(cart);

	writeCache(view.id, view);

	return view;
};

const updateItemAndGetView = async ({ cartId, lineItemId, quantity } = {}) => {
	if (isDemoMode || !apiRoot) {
		return demoSetLineItemQuantity({ lineItemId, quantity });
	}
	const cart = await setLineItemQuantity({ cartId, lineItemId, quantity });
	const view = normalizeCart(cart);

	writeCache(view.id, view);

	return view;
};

// Merge anonymous cart to customer cart after login
const mergeCartToCustomer = async ({ cartId, customerId } = {}) => {
	if (isDemoMode || !apiRoot) {
		return buildDemoCartView();
	}
	if (!cartId || !customerId) {
		return null;
	}

	invalidateCartCache(cartId);

	const cart = await getCartById(cartId);
	if (!cart) {
		return null;
	}

	// If cart already has this customer, nothing to do
	if (cart.customerId === customerId) {
		return normalizeCart(cart);
	}

	const update = {
		version: cart.version,
		actions: [
			{
				action: 'setCustomerId',
				customerId: customerId,
			},
		],
	};

	const response = await apiRoot.carts().withId({ ID: cartId }).post({ body: update }).execute();

	const body = parseEdge(cartSchema, response.body, { label: 'ct.carts.setCustomerId' });
	const view = normalizeCart(body);

	writeCache(view.id, view);

	return view;
};

export {
	getCartById,
	getOrCreateCart,
	getCartView,
	addLineItem,
	setLineItemQuantity,
	addItemAndGetView,
	updateItemAndGetView,
	invalidateCartCache,
	clearCartCache,
	mergeCartToCustomer,
};
