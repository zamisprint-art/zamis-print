import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User',
    },
    orderItems: [
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product',
            },
            personalizationText: { type: String },
            personalizationImage: { type: String }, // Path to uploaded image if required
        }
    ],
    shippingAddress: {
        fullName:   { type: String },
        phone:      { type: String },
        address:    { type: String, required: true },
        city:       { type: String, required: true },
        postalCode: { type: String, required: true },
        country:    { type: String, required: true, default: 'Colombia' },
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String },
    },
    itemsPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false,
    },
    paidAt: {
        type: Date,
    },
    orderStatus: {
        type: String,
        required: true,
        default: 'Pendiente', // Pendiente, Pagado, En Producción, Enviado
    },
    deliveredAt: {
        type: Date,
    },
    // --- COBROS Y FINANZAS ---
    estadoCobro: {
        type: String,
        enum: ['pendiente', 'pagado', 'vencido'],
        default: 'pendiente'
    },
    metodoPagoCobro: {
        type: String, // 'mercadopago', 'efectivo', 'transferencia', 'otro'
    },
    notaCobroInterna: String,
    fechaCobro: Date,
    // --- PREPARACIÓN PARA CRÉDITO FUTURO ---
    esCredito: {
        type: Boolean,
        default: false
    },
    fechaVencimiento: Date,
    abonos: [{
        monto: Number,
        fecha: { type: Date, default: Date.now },
        metodo: String,
        nota: String
    }],
}, {
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
