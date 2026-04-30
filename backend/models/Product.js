import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const productSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    model3D: {
        type: String, // Path or URL to .glb/.gltf file
        required: false,
    },
    gallery: [{
        type: String, // Array of additional image URLs
    }],
    description: {
        type: String,
        required: true,
    },
    reviews: [reviewSchema],
    rating: {
        type: Number,
        required: true,
        default: 0,
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0,
    },
    category: {
        type: String,
        required: true,
    },
    subcategory: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0,
    },
    requiresTextPersonalization: {
        type: Boolean,
        default: false,
    },
    requiresImagePersonalization: {
        type: Boolean,
        default: false,
    },
    isCustomizable: {
        type: Boolean,
        default: false,
    },
    // --- Featured / Merchandising ---
    isFeatured: {
        type: Boolean,
        default: false,
    },
    isNewArrival: {
        type: Boolean,
        default: false,
    },
    isOnSale: {
        type: Boolean,
        default: false,
    },
    salePrice: {
        type: Number,
        required: false,
    },
    totalSold: {
        type: Number,
        default: 0,
    },
    // --- Advanced Filters ---
    material: {
        type: String,
        required: false,
    },
    color: {
        type: String,
        required: false,
    },
    size: {
        type: String, // e.g. 'Pequeño', 'Mediano', 'Grande', 'Extra Grande'
        required: false,
    },
    measurements: {
        type: String, // e.g. '10cm x 5cm x 8cm'
        required: false,
    },
    personalizationLevel: {
        type: String, // 'Ninguna', 'Básica', 'Avanzada', 'Premium'
        default: 'Ninguna',
    },
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);
export default Product;
