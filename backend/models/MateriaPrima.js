import mongoose from 'mongoose';

const materiaPrimaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    tipo: {
        type: String,
        enum: ['filamento', 'pintura', 'resina', 'empaque', 'otro'],
        required: true,
    },
    unidad: {
        type: String, // e.g. "kg", "ml", "unidades", "metros"
        required: true,
    },
    stockActual: {
        type: Number,
        default: 0,
        required: true,
    },
    stockMinimo: {
        type: Number,
        default: 1,
    },
    proveedor: {
        type: String,
        required: false,
    },
    precioUnitario: {
        type: Number, // Costo por unidad (ej: costo de 1kg de filamento)
        required: false,
    },
    movimientos: [{
        tipo: {
            type: String,
            enum: ['compra', 'uso', 'ajuste'],
            required: true,
        },
        cantidad: {
            type: Number,
            required: true,
        },
        motivo: String, // "Compra a proveedor X", "Usado en Pedido #123"
        fecha: {
            type: Date,
            default: Date.now,
        },
        usuario: String // Admin email/ID
    }],
}, {
    timestamps: true,
});

const MateriaPrima = mongoose.model('MateriaPrima', materiaPrimaSchema);
export default MateriaPrima;
