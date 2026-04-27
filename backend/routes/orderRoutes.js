import express from 'express';
import { addOrderItems, getOrderById, getOrders, updateOrderStatus, getMyOrders } from '../controllers/orderController.js';
import { protect, admin, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(optionalAuth, addOrderItems).get(protect, admin, getOrders);
router.route('/mine').get(protect, getMyOrders);
router.route('/:id').get(optionalAuth, getOrderById);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

export default router;
