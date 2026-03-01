// routes/apiRoutes.js

import { Router } from 'express';
import {
	apiSearchProducts,
	apiSearchSuggestions,
	apiGetCart,
	apiAddToCart,
	apiUpdateCartItem,
	apiRemoveCartItem,
	apiGetSocialFeed,
	apiGetEvents,
} from '../controllers/api.controller.js';

const router = Router();

// Search API (for product search island)
router.get('/search', apiSearchProducts);
router.get('/search/suggestions', apiSearchSuggestions);

// Cart API (for cart island)
router.get('/cart', apiGetCart);
router.post('/cart/items', apiAddToCart);
router.patch('/cart/items/:lineItemId', apiUpdateCartItem);
router.delete('/cart/items/:lineItemId', apiRemoveCartItem);

// Social feed API (for social island)
router.get('/social', apiGetSocialFeed);

// SSE Events endpoint (for real-time updates)
router.get('/events', apiGetEvents);

export default router;
