// Demo API routes using main controllers (commercetools)
import { Router } from 'express';
import {
  apiSearchProducts,
  apiSearchSuggestions,
  apiGetCart,
  apiAddToCart,
  apiUpdateCartItem,
  apiRemoveCartItem,
  apiGetSocialFeed,
  apiGetEvents
} from '../../../controllers/api.controller.js';

const router = Router();

router.get('/search', apiSearchProducts);
router.get('/search/suggestions', apiSearchSuggestions);
router.get('/cart', apiGetCart);
router.post('/cart/items', apiAddToCart);
router.patch('/cart/items/:lineItemId', apiUpdateCartItem);
router.delete('/cart/items/:lineItemId', apiRemoveCartItem);
router.get('/social', apiGetSocialFeed);
router.get('/events', apiGetEvents);

export default router;
