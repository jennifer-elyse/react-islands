// routes/contentRoutes.js

import { Router } from 'express';
import { showLandingPage } from '../controllers/contentController.js';

const router = Router();

// CMS-driven landing pages (catch-all for pages managed in Contentstack)
// This should be lower priority than other routes
router.get('/page/:slug', showLandingPage);
router.get('/promo/:slug', showLandingPage);
router.get('/campaign/:slug', showLandingPage);

export default router;
