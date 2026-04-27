import express from 'express';
import { createPreference, paymentWebhook } from '../controllers/paymentController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create_preference', optionalAuth, createPreference);
router.post('/webhook', paymentWebhook);

export default router;
