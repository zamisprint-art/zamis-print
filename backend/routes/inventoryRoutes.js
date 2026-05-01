import express from 'express';
import {
    getProductsInventory,
    updateProductStock,
    getMaterials,
    createMaterial,
    updateMaterialStock,
    deleteMaterial
} from '../controllers/inventoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Product Inventory Routes
router.route('/products')
    .get(protect, admin, getProductsInventory);

router.route('/products/:id')
    .put(protect, admin, updateProductStock);

// Raw Materials Inventory Routes
router.route('/materials')
    .get(protect, admin, getMaterials)
    .post(protect, admin, createMaterial);

router.route('/materials/:id')
    .put(protect, admin, updateMaterialStock)
    .delete(protect, admin, deleteMaterial);

export default router;
