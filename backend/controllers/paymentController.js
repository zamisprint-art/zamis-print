import { MercadoPagoConfig, Preference } from 'mercadopago';

// @desc    Create MercadoPago Preference
// @route   POST /api/payments/create_preference
// @access  Private
const createPreference = async (req, res) => {
    try {
        const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });
        const preference = new Preference(client);

        const { items, orderId } = req.body;

        const mpItems = items.map(item => ({
            title: item.name,
            unit_price: Number(item.price),
            quantity: Number(item.qty),
            currency_id: 'MXN' // Change to relevant currency
        }));

        const response = await preference.create({
            body: {
                items: mpItems,
                back_urls: {
                    success: `${process.env.FRONTEND_URL}/order/${orderId}?status=success`,
                    failure: `${process.env.FRONTEND_URL}/order/${orderId}?status=failure`,
                    pending: `${process.env.FRONTEND_URL}/order/${orderId}?status=pending`
                },
                auto_return: "approved",
                external_reference: orderId.toString()
            }
        });

        res.json({ id: response.id, init_point: response.init_point });
    } catch (error) {
        console.error('MercadoPago Error:', error);
        res.status(500).json({ message: 'Error creating payment preference' });
    }
};

// @desc    MercadoPago Webhook
// @route   POST /api/payments/webhook
// @access  Public
const paymentWebhook = async (req, res) => {
    const payment = req.query;
    console.log('Webhook Received:', payment);
    // Here we would verify the payment status with MP API and update our Order DB
    res.status(200).send('OK');
};

export { createPreference, paymentWebhook };
