import HomeSection from '../models/HomeSection.js';

// @desc    Get all active home sections (for public home page)
// @route   GET /api/homesections
// @access  Public
export const getActiveHomeSections = async (req, res) => {
  try {
    const sections = await HomeSection.find({ isActive: true }).sort({ order: 1 });
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all home sections (for admin)
// @route   GET /api/homesections/admin
// @access  Private/Admin
export const getAdminHomeSections = async (req, res) => {
  try {
    const sections = await HomeSection.find({}).sort({ order: 1 });
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a home section
// @route   POST /api/homesections
// @access  Private/Admin
export const createHomeSection = async (req, res) => {
  try {
    const section = new HomeSection(req.body);
    const createdSection = await section.save();
    res.status(201).json(createdSection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a home section
// @route   PUT /api/homesections/:id
// @access  Private/Admin
export const updateHomeSection = async (req, res) => {
  try {
    const section = await HomeSection.findById(req.params.id);
    if (section) {
      Object.assign(section, req.body);
      const updatedSection = await section.save();
      res.json(updatedSection);
    } else {
      res.status(404).json({ message: 'Sección no encontrada' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a home section
// @route   DELETE /api/homesections/:id
// @access  Private/Admin
export const deleteHomeSection = async (req, res) => {
  try {
    const section = await HomeSection.findById(req.params.id);
    if (section) {
      await section.deleteOne();
      res.json({ message: 'Sección eliminada' });
    } else {
      res.status(404).json({ message: 'Sección no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order of sections
// @route   PUT /api/homesections/reorder
// @access  Private/Admin
export const reorderHomeSections = async (req, res) => {
  try {
    const { orderedIds } = req.body;
    for (let i = 0; i < orderedIds.length; i++) {
      await HomeSection.findByIdAndUpdate(orderedIds[i], { order: i });
    }
    res.json({ message: 'Orden actualizado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
