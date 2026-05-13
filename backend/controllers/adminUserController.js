import User from '../models/User.js';
import Order from '../models/Order.js';

// @desc  Get all registered users with purchase summary
// @route GET /api/users/admin
// @access Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).select('-password').sort({ createdAt: -1 });

    // Enrich with order data
    const enriched = await Promise.all(users.map(async (u) => {
      const orders = await Order.find({ user: u._id }).select('totalPrice orderStatus createdAt');
      const totalSpent = orders.reduce((a, o) => a + (o.totalPrice || 0), 0);
      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        createdAt: u.createdAt,
        type: 'registered',
        orderCount: orders.length,
        totalSpent,
        lastOrderDate: orders.length > 0 ? orders[orders.length - 1].createdAt : null,
      };
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get all anonymous buyers (orders without user account)
// @route GET /api/users/admin/anonymous
// @access Private/Admin
export const getAnonymousBuyers = async (req, res) => {
  try {
    // Órdenes sin usuario registrado asociado
    const orders = await Order.find({ user: { $exists: false } })
      .select('shippingAddress totalPrice orderStatus createdAt paymentResult')
      .sort({ createdAt: -1 });

    // Agrupar por teléfono o nombre (como identificador único del anónimo)
    const buyerMap = {};
    orders.forEach(order => {
      const addr = order.shippingAddress || {};
      const key = addr.phone || addr.fullName || 'sin-datos';
      if (!buyerMap[key]) {
        buyerMap[key] = {
          key,
          name: addr.fullName || 'Desconocido',
          phone: addr.phone || '—',
          city: addr.city || '—',
          email: order.paymentResult?.email_address || '—',
          type: 'anonymous',
          orderCount: 0,
          totalSpent: 0,
          lastOrderDate: null,
          orders: [],
        };
      }
      buyerMap[key].orderCount += 1;
      buyerMap[key].totalSpent += order.totalPrice || 0;
      buyerMap[key].lastOrderDate = order.createdAt;
      buyerMap[key].orders.push({
        _id: order._id,
        totalPrice: order.totalPrice,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt,
      });
    });

    res.json(Object.values(buyerMap));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
