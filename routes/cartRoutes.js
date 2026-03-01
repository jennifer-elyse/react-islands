// routes/cartRoutes.js

import { Router } from 'express';
import { showCart, addToCart, updateCartItem, removeCartItem } from '../controllers/cartController.js';

const router = Router();

// Cart page (SSR)
router.get('/cart', showCart);

// Cart actions (form submissions for progressive enhancement)
router.post('/cart/add', addToCart);
router.post('/cart/update', updateCartItem);
router.post('/cart/remove', removeCartItem);

export default router;
