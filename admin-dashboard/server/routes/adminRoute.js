import express from 'express';
import { adminLogin, getAdminProfile, updateAdminProfile, changeAdminPassword } from '../controllers/adminController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', adminLogin);

// Protected routes
router.get('/profile', authMiddleware, getAdminProfile);
router.put('/profile', authMiddleware, updateAdminProfile);
router.put('/change-password', authMiddleware, changeAdminPassword);

export default router; 