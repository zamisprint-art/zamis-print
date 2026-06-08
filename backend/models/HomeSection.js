import mongoose from 'mongoose';

const homeSectionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['featured', 'sale', 'newest', 'category', 'bespoke'],
  },
  categoryFilter: {
    type: String, // Solo se usa si type es 'category'
  },
  emoji: { type: String, default: '✨' },
  title: { type: String, required: true },
  linkTo: { type: String, default: '/shop' },
  linkLabel: { type: String, default: 'Ver todo' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const HomeSection = mongoose.model('HomeSection', homeSectionSchema);
export default HomeSection;
