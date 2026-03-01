// routes/productRoutes.js

import { Router } from 'express';
import { showHomePage, showCategoryPage, showProductDetailPage } from '../controllers/productController.js';

const router = Router();

// Home page (SSR)
router.get('/', showHomePage);

// Category/PLP pages (SSR)
router.get('/category/:slug', showCategoryPage);

// Product detail page (SSR)
router.get('/product/:slug', showProductDetailPage);

export default router;
