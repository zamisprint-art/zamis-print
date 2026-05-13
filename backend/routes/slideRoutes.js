import express from 'express';
import { getSlides, getAllSlides, createSlide, updateSlide, deleteSlide } from '../controllers/slideController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.get('/', getSlides);

// Admin
router.get('/admin', protect, admin, getAllSlides);
router.post('/', protect, admin, createSlide);
router.put('/:id', protect, admin, updateSlide);
router.delete('/:id', protect, admin, deleteSlide);

export default router;
