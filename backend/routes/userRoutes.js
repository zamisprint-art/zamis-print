import express from 'express';
import { authUser, registerUser, logoutUser, getUserProfile, forgotPassword, resetPassword } from '../controllers/userController.js';
import { getAllUsers, getAnonymousBuyers } from '../controllers/adminUserController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getUserProfile);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// Admin routes
router.get('/admin', protect, admin, getAllUsers);
router.get('/admin/anonymous', protect, admin, getAnonymousBuyers);

export default router;
