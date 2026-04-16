// Demo API routes using main controllers (commercetools)
import { Router } from 'express';
import { status } from '../controllers/api.controller.js';
import { getCart, addItem } from '../controllers/cart.controller.js';
import { getHomeContent, getHeroContent } from '../controllers/content.controller.js';
import { listProductsHandler, getProduct } from '../controllers/product.controller.js';
import { apiSearchProducts, apiSearchSuggestions } from '../controllers/search.controller.js';

const router = Router();

router.get('/status', status);
router.get('/search', apiSearchProducts);
router.get('/search/suggestions', apiSearchSuggestions);
router.get('/cart', getCart);
router.post('/cart/add', addItem);
router.get('/content/home', getHomeContent);
router.get('/content/hero', getHeroContent);
router.get('/products', listProductsHandler);
router.get('/products/:sku', getProduct);

export default router;
