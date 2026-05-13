import mongoose from 'mongoose';

const slideSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, required: true },
  ctaText: { type: String, default: 'Ver más' },
  ctaLink: { type: String, default: '/shop' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const Slide = mongoose.model('Slide', slideSchema);
export default Slide;
