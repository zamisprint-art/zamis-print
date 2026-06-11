import express from 'express';
const router = express.Router();
import {
    getShippingZones,
    createShippingZone,
    updateShippingZone,
    deleteShippingZone,
    calculateShipping
} from '../controllers/shippingZoneController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// Public route for checkout
router.post('/calculate', calculateShipping);

// Admin routes
router.route('/')
    .get(protect, admin, getShippingZones)
    .post(protect, admin, createShippingZone);

router.route('/:id')
    .put(protect, admin, updateShippingZone)
    .delete(protect, admin, deleteShippingZone);

export default router;
