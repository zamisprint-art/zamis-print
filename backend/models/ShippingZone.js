import mongoose from 'mongoose';

const shippingZoneSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    departments: [{
        type: String
    }],
    cities: [{
        type: String
    }],
    baseCost: {
        type: Number,
        required: true,
        default: 0
    },
    freeShippingThreshold: {
        type: Number,
        default: null // If null, free shipping is never applied for this zone based on threshold
    },
    estimatedDays: {
        type: String,
        required: true,
        default: '3-5 días hábiles'
    },
    isDefault: {
        type: Boolean,
        default: false // The catch-all rule (e.g. "Rest of Colombia")
    }
}, {
    timestamps: true
});

const ShippingZone = mongoose.model('ShippingZone', shippingZoneSchema);

export default ShippingZone;
