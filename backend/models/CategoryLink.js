import mongoose from 'mongoose';

const categoryLinkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true }, // URL to uploaded image
  linkTo: { type: String, required: true }, // e.g. '/shop?category=Figuras'
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const CategoryLink = mongoose.model('CategoryLink', categoryLinkSchema);
export default CategoryLink;
