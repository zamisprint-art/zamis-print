import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      required: true,
      enum: ['percent', 'fixed'],
    },
    discountValue: {
      type: Number,
      required: true,
    },
    expiryDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usageLimit: {
      type: Number, // Límite global del cupón (ej. primeros 50 compradores)
      default: null,
    },
    usageLimitPerUser: {
      type: Number, // Límite por usuario (ej. 1 uso por persona)
      default: 1,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    usedBy: [
      {
        type: String, // Guardaremos el email del usuario para controlar el límite
      }
    ]
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
