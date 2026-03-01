// routes/searchRoutes.js

import { Router } from 'express';
import { showSearchResults } from '../controllers/searchController.js';

const router = Router();

// Search results page (SSR)
router.get('/search', showSearchResults);

export default router;
