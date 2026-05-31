import Order from '../models/Order.js';
import Product from '../models/Product.js';
import sendEmail from '../utils/sendEmail.js';
import { orderConfirmationEmail, newOrderAdminEmail, orderShippedEmail } from '../utils/emailTemplates.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hola@zamisprint.com';

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

    // --- Stock Validation (Prevent Overselling) ---
    for (const item of orderItems) {
        const productInDb = await Product.findById(item.product);
        if (!productInDb) {
            return res.status(404).json({ message: `Producto no encontrado: ${item.name}` });
        }
        if (productInDb.countInStock < item.qty) {
            return res.status(400).json({ 
                message: `Lo sentimos, "${item.name}" no tiene suficiente stock. (Disponible: ${productInDb.countInStock})` 
            });
        }
    }

    const order = new Order({
        orderItems,
        user:            req.user?._id,
        shippingAddress: {
            fullName:       shippingAddress.fullName,
            email:          shippingAddress.email,
            documentType:   shippingAddress.documentType,
            documentNumber: shippingAddress.documentNumber,
            phone:          shippingAddress.phone,
            address:        shippingAddress.address,
            department:     shippingAddress.department,
            city:           shippingAddress.city,
            postalCode:     shippingAddress.postalCode,
            country:        shippingAddress.country || 'Colombia',
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

// @desc    Get all orders with pagination & filtering
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    const pageSize = Number(req.query.limit) || 20;
    const page = Number(req.query.page) || 1;

    const query = {};

    // Filtros por estado
    if (req.query.orderStatus && req.query.orderStatus !== 'all') {
        query.orderStatus = req.query.orderStatus;
    }

    if (req.query.estadoCobro && req.query.estadoCobro !== 'all') {
        query.estadoCobro = req.query.estadoCobro;
    }

    // Búsqueda general
    if (req.query.search) {
        const cleanSearch = req.query.search.replace('#', '').trim();
        const searchRegex = new RegExp(cleanSearch, 'i');
        
        query.$or = [
            { 'shippingAddress.fullName': searchRegex },
            { 'shippingAddress.email': searchRegex },
            { 'shippingAddress.phone': searchRegex }
        ];

        // Permitir búsqueda parcial por el ID de MongoDB (ej: B885E02E)
        if (cleanSearch.match(/^[0-9a-fA-F]{1,24}$/)) {
            query.$or.push({
                $expr: {
                    $regexMatch: {
                        input: { $toString: "$_id" },
                        regex: cleanSearch,
                        options: "i"
                    }
                }
            });
        }
    }

    const count = await Order.countDocuments({ ...query });
    
    const orders = await Order.find({ ...query })
        .populate('user', 'id name email')
        .sort({ createdAt: -1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    // Obtener estadísticas financieras basándonos en los mismos filtros (o sin paginación)
    // Para no afectar el rendimiento en BD gigantes, agregamos esto:
    const statsResult = await Order.aggregate([
        { $match: query },
        {
            $group: {
                _id: null,
                totalCobrado: {
                    $sum: {
                        $cond: [{ $eq: ["$estadoCobro", "pagado"] }, "$totalPrice", 0]
                    }
                },
                totalPendiente: {
                    $sum: {
                        $cond: [{ $in: ["$estadoCobro", ["pendiente", "vencido"]] }, "$totalPrice", 0]
                    }
                }
            }
        }
    ]);

    const stats = statsResult.length > 0 ? statsResult[0] : { totalCobrado: 0, totalPendiente: 0 };

    res.json({ 
        orders, 
        page, 
        pages: Math.ceil(count / pageSize), 
        total: count,
        stats
    });
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
        
        // Editar detalles de venta externa
        if (req.body.clientName !== undefined && order.shippingAddress) order.shippingAddress.fullName = req.body.clientName;
        if (req.body.clientPhone !== undefined && order.shippingAddress) order.shippingAddress.phone = req.body.clientPhone;
        if (req.body.description !== undefined && order.orderItems && order.orderItems.length > 0) order.orderItems[0].name = req.body.description;
        if (req.body.totalPrice !== undefined) {
            order.totalPrice = Number(req.body.totalPrice);
            order.itemsPrice = Number(req.body.totalPrice);
        }
        if (req.body.canalVenta !== undefined) order.canalVenta = req.body.canalVenta;
        
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

            // --- Send emails (manual payment confirmed) ---
            const customerEmail = order.user?.email || order.shippingAddress?.email;
            if (customerEmail && !order.canalVenta?.includes('Externa')) {
                sendEmail({
                    to: customerEmail,
                    subject: `✅ Pago Confirmado — ZAMIS Print (#${String(order._id).slice(-8).toUpperCase()})`,
                    html: orderConfirmationEmail(order),
                });
            }
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Add external manual order
// @route   POST /api/orders/external
// @access  Private/Admin
const addExternalOrder = async (req, res) => {
    const {
        description,
        totalPrice,
        canalVenta,
        metodoPagoCobro,
        fechaCobro,
        notaCobroInterna,
        clientName,
        clientPhone,
        estadoCobro
    } = req.body;

    const isPaid = estadoCobro === 'pagado';

    const order = new Order({
        orderItems: [
            {
                name: description || 'Venta Externa',
                qty: 1,
                image: '/images/sample.jpg',
                price: totalPrice,
            }
        ],
        shippingAddress: {
            fullName: clientName || 'Venta Externa',
            phone: clientPhone || '',
            address: 'Venta Externa',
            city: 'N/A',
            postalCode: '00000',
            country: 'N/A',
        },
        paymentMethod: metodoPagoCobro || 'Otro',
        itemsPrice: totalPrice,
        shippingPrice: 0,
        totalPrice: totalPrice,
        isPaid: isPaid,
        paidAt: isPaid ? (fechaCobro || Date.now()) : null,
        orderStatus: isPaid ? 'Entregado' : 'Pendiente',
        estadoCobro: estadoCobro || 'pagado',
        metodoPagoCobro,
        notaCobroInterna,
        fechaCobro: isPaid ? (fechaCobro || Date.now()) : null,
        canalVenta: canalVenta || 'Otro'
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
};

export { addOrderItems, getOrderById, getOrders, updateOrderStatus, getMyOrders, updateBillingStatus, addExternalOrder };


