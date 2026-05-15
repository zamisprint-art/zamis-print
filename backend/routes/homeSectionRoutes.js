import express from 'express';
import {
  getActiveHomeSections,
  getAdminHomeSections,
  createHomeSection,
  updateHomeSection,
  deleteHomeSection,
  reorderHomeSections
} from '../controllers/homeSectionController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getActiveHomeSections);
router.get('/admin', protect, admin, getAdminHomeSections);
router.post('/', protect, admin, createHomeSection);
router.put('/reorder', protect, admin, reorderHomeSections);
router.put('/:id', protect, admin, updateHomeSection);
router.delete('/:id', protect, admin, deleteHomeSection);

export default router;
