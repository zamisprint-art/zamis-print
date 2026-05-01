import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { Resend } from 'resend';
import { orderConfirmationEmail, newOrderAdminEmail, orderShippedEmail } from '../utils/emailTemplates.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hola@zamisprint.com';
const FROM_EMAIL  = 'ZAMIS Print <onboarding@resend.dev>';

// Helper: send email without crashing the main flow
const sendEmail = async ({ to, subject, html }) => {
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({ from: FROM_EMAIL, to, subject, html });
        console.log(`✅ Email sent to ${to}: ${subject}`);
    } catch (err) {
        console.error(`⚠️  Email failed (non-critical): ${err.message}`);
    }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    }

    const order = new Order({
        orderItems,
        user:            req.user?._id,
        shippingAddress: {
            fullName:   shippingAddress.fullName,
            address:    shippingAddress.address,
            city:       shippingAddress.city,
            postalCode: shippingAddress.postalCode,
            phone:      shippingAddress.phone,
            country:    shippingAddress.country || 'Colombia',
        },
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);

    // --- Send emails (non-blocking) ---
    const customerEmail = req.user?.email || shippingAddress?.email;

    // 1. Confirmation to customer
    if (customerEmail) {
        sendEmail({
            to: customerEmail,
            subject: `✅ Pedido confirmado — ZAMIS Print (#${String(createdOrder._id).slice(-8).toUpperCase()})`,
            html: orderConfirmationEmail(createdOrder),
        });
    }

    // 2. New order alert to admin
    sendEmail({
        to: ADMIN_EMAIL,
        subject: `🚀 Nueva orden recibida — $${totalPrice?.toLocaleString('es-CO')} COP`,
        html: newOrderAdminEmail({ ...createdOrder.toObject(), shippingAddress }),
    });
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
        res.json(order);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name email');
    res.json(orders);
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        order.orderStatus = req.body.status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);

        // Send "Enviado" notification to customer
        if (req.body.status === 'Enviado') {
            const customerEmail = order.user?.email;
            if (customerEmail) {
                sendEmail({
                    to: customerEmail,
                    subject: `📦 Tu pedido ZAMIS Print va en camino (#${String(order._id).slice(-8).toUpperCase()})`,
                    html: orderShippedEmail(order),
                });
            }
        }
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/mine
// @access  Private
const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
};

// @desc    Update billing status (Cobros)
// @route   PUT /api/orders/:id/billing
// @access  Private/Admin
const updateBillingStatus = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        if (req.body.estadoCobro) order.estadoCobro = req.body.estadoCobro;
        if (req.body.metodoPagoCobro) order.metodoPagoCobro = req.body.metodoPagoCobro;
        if (req.body.notaCobroInterna !== undefined) order.notaCobroInterna = req.body.notaCobroInterna;
        if (req.body.fechaCobro) order.fechaCobro = req.body.fechaCobro;
        
        // Si se marca como pagado y no estaba pagado antes
        if (req.body.estadoCobro === 'pagado' && !order.isPaid) {
            order.isPaid = true;
            order.paidAt = req.body.fechaCobro || Date.now();

            // Reducir stock automáticamente
            for (const item of order.orderItems) {
                const product = await Product.findById(item.product);
                if (product) {
                    product.countInStock = Math.max(0, product.countInStock - item.qty);
                    product.stockMovimientos.push({
                        tipo: 'salida',
                        cantidad: item.qty,
                        motivo: `Venta automática - Pedido #${String(order._id).slice(-8).toUpperCase()}`,
                        usuario: req.user ? req.user.email : 'sistema'
                    });
                    await product.save();
                }
            }
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

export { addOrderItems, getOrderById, getOrders, updateOrderStatus, getMyOrders, updateBillingStatus };


