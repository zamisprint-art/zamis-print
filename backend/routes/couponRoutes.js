import express from 'express';
const router = express.Router();
import {
    getCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    validateCoupon
} from '../controllers/couponController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// Rutas administrativas
router.route('/')
    .get(protect, admin, getCoupons)
    .post(protect, admin, createCoupon);

router.route('/:id')
    .put(protect, admin, updateCoupon)
    .delete(protect, admin, deleteCoupon);

// Ruta pública para validación en el checkout
router.get('/validate/:code', validateCoupon);

export default router;
