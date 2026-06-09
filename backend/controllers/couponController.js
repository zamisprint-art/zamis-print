import Coupon from '../models/Coupon.js';

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = async (req, res) => {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json(coupons);
};

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res) => {
    const { code, discountType, discountValue, expiryDate, isActive, usageLimit, usageLimitPerUser } = req.body;

    if (discountType === 'percent' && (discountValue <= 0 || discountValue > 100)) {
        return res.status(400).json({ message: 'El porcentaje de descuento debe estar entre 1 y 100' });
    }
    if (discountType === 'fixed' && discountValue <= 0) {
        return res.status(400).json({ message: 'El descuento fijo debe ser mayor a 0' });
    }

    const couponExists = await Coupon.findOne({ code: code.toUpperCase() });

    if (couponExists) {
        return res.status(400).json({ message: 'El código de cupón ya existe' });
    }

    const coupon = new Coupon({
        code: code.toUpperCase(),
        discountType,
        discountValue,
        expiryDate,
        isActive,
        usageLimit,
        usageLimitPerUser,
    });

    const createdCoupon = await coupon.save();
    res.status(201).json(createdCoupon);
};

// @desc    Update a coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = async (req, res) => {
    const { code, discountType, discountValue, expiryDate, isActive, usageLimit, usageLimitPerUser } = req.body;

    if (discountType === 'percent' && (discountValue <= 0 || discountValue > 100)) {
        return res.status(400).json({ message: 'El porcentaje de descuento debe estar entre 1 y 100' });
    }
    if (discountType === 'fixed' && discountValue <= 0) {
        return res.status(400).json({ message: 'El descuento fijo debe ser mayor a 0' });
    }

    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
        coupon.code = code ? code.toUpperCase() : coupon.code;
        coupon.discountType = discountType || coupon.discountType;
        coupon.discountValue = discountValue !== undefined ? discountValue : coupon.discountValue;
        coupon.expiryDate = expiryDate !== undefined ? expiryDate : coupon.expiryDate;
        coupon.isActive = isActive !== undefined ? isActive : coupon.isActive;
        coupon.usageLimit = usageLimit !== undefined ? usageLimit : coupon.usageLimit;
        coupon.usageLimitPerUser = usageLimitPerUser !== undefined ? usageLimitPerUser : coupon.usageLimitPerUser;

        const updatedCoupon = await coupon.save();
        res.json(updatedCoupon);
    } else {
        res.status(404).json({ message: 'Cupón no encontrado' });
    }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
        await coupon.deleteOne();
        res.json({ message: 'Cupón eliminado' });
    } else {
        res.status(404).json({ message: 'Cupón no encontrado' });
    }
};

// @desc    Validate a coupon code (Public)
// @route   GET /api/coupons/validate/:code
// @access  Public
const validateCoupon = async (req, res) => {
    const code = req.params.code.toUpperCase();
    const { email } = req.query; // Para validar uso por usuario

    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
        return res.status(404).json({ message: 'Cupón inválido' });
    }

    if (!coupon.isActive) {
        return res.status(400).json({ message: 'Este cupón está desactivado' });
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
        return res.status(400).json({ message: 'Este cupón ha expirado' });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return res.status(400).json({ message: 'Este cupón ha alcanzado su límite de usos' });
    }

    if (email && coupon.usageLimitPerUser) {
        const userUsages = coupon.usedBy.filter(u => u.toLowerCase() === email.toLowerCase()).length;
        if (userUsages >= coupon.usageLimitPerUser) {
            return res.status(400).json({ message: 'Ya has utilizado este cupón el máximo de veces permitido' });
        }
    }

    // Si es válido, enviamos los detalles del descuento
    res.json({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
    });
};

// @desc    Check if any active coupon exists (Public)
// @route   GET /api/coupons/active-exists
// @access  Public
const checkActiveCouponsExists = async (req, res) => {
    // Check if there is at least one coupon that is active, and either has no expiry or expiry is in the future
    const activeCouponCount = await Coupon.countDocuments({
        isActive: true,
        $or: [
            { expiryDate: null },
            { expiryDate: { $gte: new Date() } }
        ]
    });
    res.json({ hasActiveCoupons: activeCouponCount > 0 });
};

export { getCoupons, createCoupon, updateCoupon, deleteCoupon, validateCoupon, checkActiveCouponsExists };
