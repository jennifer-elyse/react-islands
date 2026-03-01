// routes/authRoutes.js

import { Router } from 'express';
import { initiateLogin, handleCallback, logout, getMe } from '../controllers/authController.js';

const router = Router();

// Initiate login - redirects to OneLogin
router.get('/login', initiateLogin);

// OAuth callback from OneLogin
router.get('/callback', handleCallback);

// Logout
router.get('/logout', logout);
router.post('/logout', logout);

// Get current user info (for islands)
router.get('/me', getMe);

export default router;
