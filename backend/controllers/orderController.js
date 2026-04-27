import Order from '../models/Order.js';
import { Resend } from 'resend';

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
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.orderStatus = req.body.status;
        const updatedOrder = await order.save();
        if (req.body.status === 'Enviado') {
            try {
                const resend = new Resend(process.env.RESEND_API_KEY);
                await resend.emails.send({
                    from: 'ZAMIS Print <onboarding@resend.dev>', // Use verified domain in production
                    to: order.user?.email || 'admin@zamisprint.com',
                    subject: `Tu pedido de ZAMIS Print ha sido enviado (Orden ${order._id})`,
                    html: `
                        <h1>¡Buenas noticias!</h1>
                        <p>Tu pedido con ID <strong>${order._id}</strong> ya está en camino.</p>
                        <p>Gracias por confiar en ZAMIS Print para tus impresiones 3D personalizadas.</p>
                    `
                });
                console.log('Email sent successfully');
            } catch (emailError) {
                console.error('Error sending email:', emailError);
            }
        }
        
        res.json(updatedOrder);
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

export { addOrderItems, getOrderById, getOrders, updateOrderStatus, getMyOrders };
