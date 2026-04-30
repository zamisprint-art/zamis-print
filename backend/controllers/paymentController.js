import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { Resend } from 'resend';
import Order from '../models/Order.js';

const formatCOP = (v) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);

// ─── Email Helper ─────────────────────────────────────────────────────────────
const sendConfirmationEmail = async (order, payerEmail) => {
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const toEmail = payerEmail || order.shippingAddress?.email || 'admin@zamisprint.com';

        const itemsHtml = order.orderItems
            .map(item => `
                <tr>
                    <td style="padding:10px;border-bottom:1px solid #f1f5f9;">${item.name}</td>
                    <td style="padding:10px;border-bottom:1px solid #f1f5f9;text-align:center;">${item.qty}</td>
                    <td style="padding:10px;border-bottom:1px solid #f1f5f9;text-align:right;">${formatCOP(item.price * item.qty)}</td>
                </tr>`)
            .join('');

        await resend.emails.send({
            from: 'ZAMIS Print <onboarding@resend.dev>',
            to: toEmail,
            subject: `✅ ¡Pedido confirmado! #${order._id.toString().slice(-8).toUpperCase()} — ZAMIS Print`,
            html: `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:40px 32px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:900;letter-spacing:-0.5px;">ZAMIS<span style="opacity:0.7;">.</span>Print</h1>
      <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">Impresión 3D Premium</p>
    </div>

    <!-- Success Badge -->
    <div style="text-align:center;padding:32px 32px 0;">
      <div style="display:inline-block;background:#dcfce7;border:2px solid #86efac;border-radius:50px;padding:10px 24px;">
        <span style="color:#16a34a;font-weight:700;font-size:15px;">✅ ¡Pago confirmado!</span>
      </div>
      <h2 style="color:#0f172a;margin:20px 0 8px;font-size:24px;">¡Gracias por tu pedido!</h2>
      <p style="color:#64748b;margin:0;font-size:15px;">Hemos recibido tu pago y tu pedido está en cola de producción.</p>
    </div>

    <!-- Order Info -->
    <div style="padding:24px 32px;">
      <div style="background:#f8fafc;border-radius:12px;padding:20px;border:1px solid #e2e8f0;margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:6px 0;color:#64748b;font-size:13px;">Número de pedido</td>
            <td style="padding:6px 0;text-align:right;font-weight:700;font-family:monospace;color:#0f172a;">#${order._id.toString().slice(-8).toUpperCase()}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#64748b;font-size:13px;">Fecha</td>
            <td style="padding:6px 0;text-align:right;color:#0f172a;">${new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#64748b;font-size:13px;">Envío a</td>
            <td style="padding:6px 0;text-align:right;color:#0f172a;">${order.shippingAddress?.city || 'Colombia'}</td>
          </tr>
        </table>
      </div>

      <!-- Items -->
      <h3 style="color:#0f172a;margin:0 0 12px;font-size:16px;">Productos en tu pedido</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <thead>
          <tr style="background:#f1f5f9;">
            <th style="padding:10px;text-align:left;font-size:12px;color:#64748b;text-transform:uppercase;">Producto</th>
            <th style="padding:10px;text-align:center;font-size:12px;color:#64748b;text-transform:uppercase;">Cant.</th>
            <th style="padding:10px;text-align:right;font-size:12px;color:#64748b;text-transform:uppercase;">Subtotal</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <!-- Total -->
      <div style="background:#6366f1;border-radius:12px;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;">
        <span style="color:rgba(255,255,255,0.85);font-weight:600;">Total pagado</span>
        <span style="color:#ffffff;font-size:22px;font-weight:900;">${formatCOP(order.totalPrice)}</span>
      </div>
    </div>

    <!-- Next Steps -->
    <div style="padding:0 32px 32px;">
      <h3 style="color:#0f172a;margin:0 0 16px;font-size:16px;">¿Qué sigue?</h3>
      <div style="display:flex;flex-direction:column;gap:12px;">
        ${[
            ['🖨️', 'En Producción', 'Nuestro equipo comenzará a fabricar tu pieza 3D.'],
            ['✅', 'Control de Calidad', 'Verificamos cada detalle antes de empacar.'],
            ['🚀', 'Envío Express', 'Te notificamos con el número de guía cuando salga.'],
        ].map(([icon, title, desc]) => `
        <div style="background:#f8fafc;border-radius:10px;padding:14px 16px;border-left:4px solid #6366f1;">
          <p style="margin:0;font-weight:700;color:#0f172a;font-size:14px;">${icon} ${title}</p>
          <p style="margin:4px 0 0;color:#64748b;font-size:13px;">${desc}</p>
        </div>`).join('')}
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:24px 32px;text-align:center;">
      <p style="color:#64748b;font-size:13px;margin:0 0 8px;">¿Tienes preguntas? Escríbenos a</p>
      <a href="mailto:hola@zamisprint.com" style="color:#6366f1;font-weight:600;text-decoration:none;">hola@zamisprint.com</a>
      <p style="color:#94a3b8;font-size:12px;margin:16px 0 0;">© ${new Date().getFullYear()} ZAMIS Print · Bogotá, Colombia</p>
    </div>
  </div>
</body>
</html>`,
        });
        console.log(`[Email] ✅ Confirmation sent to ${toEmail}`);
    } catch (emailErr) {
        console.error('[Email] ❌ Failed to send confirmation:', emailErr.message);
    }
};

// ─── Create MercadoPago Preference ───────────────────────────────────────────
// @route POST /api/payments/create_preference  @access optionalAuth
const createPreference = async (req, res) => {
    try {
        const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });
        const preference = new Preference(client);
        const { items, orderId } = req.body;

        const mpItems = items.map(item => ({
            title:       item.name,
            unit_price:  Number(item.price),
            quantity:    Number(item.qty),
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
                auto_return:        'approved',
                notification_url:   `${process.env.BACKEND_URL}/api/payments/webhook`,
                external_reference: orderId.toString(),
            },
        });

        res.json({ id: response.id, init_point: response.init_point });
    } catch (error) {
        console.error('[MP] createPreference error:', error);
        
        // Extract exact error from MercadoPago if available
        let detailMsg = error.message;
        if (error.cause && error.cause.length > 0) {
            detailMsg = error.cause.map(c => `${c.description || c.code} (${c.data})`).join('; ');
        } else if (error.response && error.response.data) {
            detailMsg = JSON.stringify(error.response.data);
        }

        res.status(500).json({ 
            message: 'Error creando la preferencia en MercadoPago', 
            detail: detailMsg 
        });
    }
};

// ─── MercadoPago IPN Webhook ──────────────────────────────────────────────────
// @route POST /api/payments/webhook  @access Public
const paymentWebhook = async (req, res) => {
    res.status(200).send('OK'); // Always respond quickly

    try {
        const topic = req.query.topic || req.query.type;
        const id    = req.query.id    || req.body?.data?.id;

        console.log(`[MP Webhook] topic=${topic} id=${id}`);
        if (!topic || !id) return;
        if (topic !== 'payment' && topic !== 'payment_intent') return;

        const client    = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });
        const mpPayment = new Payment(client);
        const payment   = await mpPayment.get({ id });

        const { status, external_reference, id: paymentId, payer } = payment;
        console.log(`[MP Webhook] status=${status} orderId=${external_reference}`);

        if (!external_reference) return;

        const order = await Order.findById(external_reference).populate('user', 'name email');
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
                status,
                update_time:   new Date().toISOString(),
                email_address: payer?.email || '',
            };
            await order.save();
            console.log(`[MP Webhook] ✅ Order ${external_reference} marked as PAID`);

            // 📧 Send confirmation email to customer
            const customerEmail = payer?.email || order.user?.email;
            await sendConfirmationEmail(order, customerEmail);

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
