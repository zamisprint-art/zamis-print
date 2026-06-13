import express from 'express';
const router = express.Router();
import CustomCta from '../models/CustomCta.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// @desc    Get Custom CTA config
// @route   GET /api/customcta
// @access  Public
router.get('/', async (req, res) => {
  try {
    const cta = await CustomCta.findOne();
    if (cta) {
      res.json(cta);
    } else {
      res.json(null);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Custom CTA' });
  }
});

// @desc    Update Custom CTA config
// @route   PUT /api/customcta
// @access  Private/Admin
router.put('/', protect, admin, async (req, res) => {
  try {
    const { badgeText, title, description, buttonText, buttonLink, images } = req.body;

    let cta = await CustomCta.findOne();

    if (cta) {
      cta.badgeText = badgeText || cta.badgeText;
      cta.title = title || cta.title;
      cta.description = description || cta.description;
      cta.buttonText = buttonText || cta.buttonText;
      cta.buttonLink = buttonLink || cta.buttonLink;
      if (images && Array.isArray(images)) {
        cta.images = images;
      }
      
      const updatedCta = await cta.save();
      res.json(updatedCta);
    } else {
      // Create new if none exists
      cta = new CustomCta({
        badgeText,
        title,
        description,
        buttonText,
        buttonLink,
        images: images || []
      });
      const createdCta = await cta.save();
      res.status(201).json(createdCta);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating Custom CTA' });
  }
});

export default router;
