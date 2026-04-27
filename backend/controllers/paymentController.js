import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import Order from '../models/Order.js';

// @desc    Create MercadoPago Preference
// @route   POST /api/payments/create_preference
// @access  Private
const createPreference = async (req, res) => {
    try {
        const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });
        const preference = new Preference(client);

        const { items, orderId } = req.body;

        const mpItems = items.map(item => ({
            title:      item.name,
            unit_price: Number(item.price),
            quantity:   Number(item.qty),
            currency_id: 'COP',
        }));

        const response = await preference.create({
            body: {
                items: mpItems,
                back_urls: {
                    success: `${process.env.FRONTEND_URL}/order/${orderId}?status=success`,
                    failure: `${process.env.FRONTEND_URL}/order/${orderId}?status=failure`,
                    pending: `${process.env.FRONTEND_URL}/order/${orderId}?status=pending`,
                },
                auto_return:      'approved',
                notification_url: `${process.env.BACKEND_URL}/api/payments/webhook`,
                external_reference: orderId.toString(),
            },
        });

        res.json({ id: response.id, init_point: response.init_point });
    } catch (error) {
        console.error('[MP] createPreference error:', error);
        res.status(500).json({ message: 'Error creating payment preference', detail: error.message });
    }
};

// @desc    MercadoPago IPN Webhook — updates order when payment is confirmed
// @route   POST /api/payments/webhook
// @access  Public (MP calls this)
const paymentWebhook = async (req, res) => {
    // Always respond 200 quickly so MP doesn't retry
    res.status(200).send('OK');

    try {
        const topic = req.query.topic || req.query.type;
        const id    = req.query.id    || req.body?.data?.id;

        console.log(`[MP Webhook] topic=${topic} id=${id}`);

        if (!topic || !id) return;

        // Only handle payment notifications
        if (topic !== 'payment' && topic !== 'payment_intent') return;

        // Fetch the payment details from MP
        const client  = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });
        const mpPayment = new Payment(client);
        const payment = await mpPayment.get({ id });

        const { status, external_reference, id: paymentId, payer } = payment;

        console.log(`[MP Webhook] status=${status} orderId=${external_reference}`);

        if (!external_reference) return;

        const order = await Order.findById(external_reference);
        if (!order) {
            console.warn(`[MP Webhook] Order not found: ${external_reference}`);
            return;
        }

        if (status === 'approved') {
            order.isPaid        = true;
            order.paidAt        = new Date();
            order.orderStatus   = 'Pagado';
            order.paymentResult = {
                id:            String(paymentId),
                status:        status,
                update_time:   new Date().toISOString(),
                email_address: payer?.email || '',
            };
            await order.save();
            console.log(`[MP Webhook] ✅ Order ${external_reference} marked as PAID`);
        } else if (status === 'rejected' || status === 'cancelled') {
            order.orderStatus = 'Pago Fallido';
            await order.save();
            console.log(`[MP Webhook] ❌ Order ${external_reference} payment REJECTED`);
        }
    } catch (err) {
        console.error('[MP Webhook] Processing error:', err.message);
    }
};

export { createPreference, paymentWebhook };
