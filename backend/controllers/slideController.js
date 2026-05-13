import Slide from '../models/Slide.js';

// @desc  Get all active slides (public)
// @route GET /api/slides
// @access Public
export const getSlides = async (req, res) => {
  try {
    const slides = await Slide.find({ isActive: true }).sort({ order: 1 });
    res.json(slides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get all slides (admin, including inactive)
// @route GET /api/slides/admin
// @access Private/Admin
export const getAllSlides = async (req, res) => {
  try {
    const slides = await Slide.find().sort({ order: 1 });
    res.json(slides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Create a slide
// @route POST /api/slides
// @access Private/Admin
export const createSlide = async (req, res) => {
  try {
    const { title, subtitle, description, image, ctaText, ctaLink, isActive, order } = req.body;
    const slide = await Slide.create({ title, subtitle, description, image, ctaText, ctaLink, isActive, order });
    res.status(201).json(slide);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc  Update a slide
// @route PUT /api/slides/:id
// @access Private/Admin
export const updateSlide = async (req, res) => {
  try {
    const slide = await Slide.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!slide) return res.status(404).json({ message: 'Slide no encontrado' });
    res.json(slide);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc  Delete a slide
// @route DELETE /api/slides/:id
// @access Private/Admin
export const deleteSlide = async (req, res) => {
  try {
    const slide = await Slide.findByIdAndDelete(req.params.id);
    if (!slide) return res.status(404).json({ message: 'Slide no encontrado' });
    res.json({ message: 'Slide eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
