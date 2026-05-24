import express from 'express';
import CategoryLink from '../models/CategoryLink.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all category links
// @route   GET /api/categorylinks
// @access  Public
router.get('/', async (req, res) => {
  try {
    const links = await CategoryLink.find({}).sort({ order: 1 });
    res.json(links);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las categorías', error: error.message });
  }
});

// @desc    Create a category link
// @route   POST /api/categorylinks
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, image, linkTo, isActive, order } = req.body;
    const link = new CategoryLink({
      title,
      image,
      linkTo,
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
    });
    const createdLink = await link.save();
    res.status(201).json(createdLink);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la categoría', error: error.message });
  }
});

// @desc    Update a category link
// @route   PUT /api/categorylinks/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { title, image, linkTo, isActive, order } = req.body;
    const link = await CategoryLink.findById(req.params.id);

    if (link) {
      link.title = title || link.title;
      link.image = image || link.image;
      link.linkTo = linkTo || link.linkTo;
      link.isActive = isActive !== undefined ? isActive : link.isActive;
      link.order = order !== undefined ? order : link.order;

      const updatedLink = await link.save();
      res.json(updatedLink);
    } else {
      res.status(404).json({ message: 'Categoría no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la categoría', error: error.message });
  }
});

// @desc    Delete a category link
// @route   DELETE /api/categorylinks/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const link = await CategoryLink.findById(req.params.id);
    if (link) {
      await link.deleteOne();
      res.json({ message: 'Categoría eliminada' });
    } else {
      res.status(404).json({ message: 'Categoría no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la categoría', error: error.message });
  }
});

export default router;
