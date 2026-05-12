// ============================================================
// ZAMIS Print — Plantillas de Email (HTML)
// ============================================================

/**
 * Email de confirmación para el CLIENTE al crear la orden.
 */
export const orderConfirmationEmail = (order) => {
    const itemsHtml = order.orderItems.map(item => `
        <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
                <strong>${item.name}</strong><br/>
                <span style="color:#888;font-size:13px;">Cantidad: ${item.qty}</span>
                ${item.personalizationText ? `<br/><span style="color:#7c3aed;font-size:12px;">✏️ ${item.personalizationText}</span>` : ''}
            </td>
            <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:right;white-space:nowrap;">
                ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(item.price * item.qty)}
            </td>
        </tr>
    `).join('');

    const formatPrice = (n) =>
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

    return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Confirmación de pedido</title></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f4f4f8;color:#1a1a2e;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f8;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#7c3aed,#4f46e5);padding:40px 40px 32px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:28px;letter-spacing:-0.5px;">ZAMIS Print</h1>
            <p style="margin:8px 0 0;color:#c4b5fd;font-size:14px;">Impresión 3D Personalizada</p>
          </td>
        </tr>

        <!-- Confirmation Banner -->
        <tr>
          <td style="background:#f0fdf4;border-left:4px solid #22c55e;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:18px;font-weight:700;color:#16a34a;">✅ ¡Pedido confirmado!</p>
            <p style="margin:4px 0 0;font-size:13px;color:#4b5563;">Orden #${String(order._id).slice(-8).toUpperCase()}</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 40px;">
            <p style="font-size:16px;margin:0 0 24px;">Hola <strong>${order.shippingAddress?.fullName || 'Cliente'}</strong>, recibimos tu pedido y ya estamos trabajando en él. 🎉</p>

            <!-- Items -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;">
              <thead>
                <tr style="border-bottom:2px solid #e5e7eb;">
                  <th style="text-align:left;padding-bottom:8px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Producto</th>
                  <th style="text-align:right;padding-bottom:8px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Total</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
            </table>

            <!-- Totals -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:6px 0;color:#6b7280;font-size:14px;">Subtotal</td>
                <td style="padding:6px 0;text-align:right;font-size:14px;">${formatPrice(order.itemsPrice || order.totalPrice)}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#6b7280;font-size:14px;">Envío</td>
                <td style="padding:6px 0;text-align:right;font-size:14px;">${order.shippingPrice === 0 ? 'Gratis' : formatPrice(order.shippingPrice || 0)}</td>
              </tr>
              <tr style="border-top:2px solid #e5e7eb;">
                <td style="padding:12px 0;font-weight:700;font-size:16px;">Total pagado</td>
                <td style="padding:12px 0;text-align:right;font-weight:700;font-size:18px;color:#7c3aed;">${formatPrice(order.totalPrice)}</td>
              </tr>
            </table>

            <!-- Shipping Info -->
            <div style="margin-top:24px;padding:16px;background:#f9f9ff;border-radius:10px;border:1px solid #e5e7eb;">
              <p style="margin:0 0 8px;font-weight:700;font-size:14px;">📦 Datos de envío</p>
              <p style="margin:0;font-size:14px;color:#4b5563;line-height:1.6;">
                ${order.shippingAddress?.fullName}<br/>
                ${order.shippingAddress?.address}, ${order.shippingAddress?.city}<br/>
                ${order.shippingAddress?.phone ? `📱 ${order.shippingAddress.phone}` : ''}
              </p>
            </div>

            <p style="margin:28px 0 0;font-size:14px;color:#6b7280;line-height:1.7;">
              Te contactaremos pronto para coordinar los detalles de tu pedido.<br/>
              ¿Tienes alguna duda? Escríbenos a 
              <a href="mailto:hola@zamisprint.com" style="color:#7c3aed;">hola@zamisprint.com</a> 
              o por WhatsApp al <a href="https://wa.me/573107878192" style="color:#7c3aed;">+57 310 787 8192</a>.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f4f4f8;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">© 2026 ZAMIS Print · Impresión 3D Personalizada · Colombia</p>
            <p style="margin:6px 0 0;font-size:12px;color:#9ca3af;">
              <a href="https://zamisprint.vercel.app" style="color:#7c3aed;text-decoration:none;">zamisprint.vercel.app</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;
};

/**
 * Email de notificación para el ADMIN cuando llega una nueva orden.
 */
export const newOrderAdminEmail = (order) => {
    const formatPrice = (n) =>
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

    const itemsList = order.orderItems.map(item =>
        `• ${item.name} x${item.qty} — ${formatPrice(item.price * item.qty)}${item.personalizationText ? ` [✏️ ${item.personalizationText}]` : ''}`
    ).join('\n');

    return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Nueva Orden</title></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f4f4f8;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f8;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header Admin -->
        <tr>
          <td style="background:#1a1a2e;padding:28px 40px;text-align:center;">
            <h2 style="margin:0;color:#a78bfa;font-size:22px;">🚀 Nueva Orden — ZAMIS Print Admin</h2>
            <p style="margin:6px 0 0;color:#6b7280;font-size:13px;">Orden #${String(order._id).slice(-8).toUpperCase()} · ${new Date().toLocaleDateString('es-CO', { dateStyle: 'full' })}</p>
          </td>
        </tr>

        <!-- Summary -->
        <tr>
          <td style="padding:32px 40px;">
            <div style="background:#fefce8;border:1px solid #fde68a;border-radius:10px;padding:16px;margin-bottom:24px;">
              <p style="margin:0;font-weight:700;font-size:20px;color:#92400e;">💰 Total: ${formatPrice(order.totalPrice)}</p>
            </div>

            <h3 style="margin:0 0 12px;font-size:15px;color:#374151;">👤 Cliente</h3>
            <p style="margin:0 0 20px;font-size:14px;color:#4b5563;line-height:1.8;padding:12px;background:#f9f9f9;border-radius:8px;">
              <strong>${order.shippingAddress?.fullName}</strong><br/>
              📍 ${order.shippingAddress?.address}, ${order.shippingAddress?.city}<br/>
              📱 ${order.shippingAddress?.phone || 'Sin teléfono'}
            </p>

            <h3 style="margin:0 0 12px;font-size:15px;color:#374151;">🛒 Productos</h3>
            <div style="background:#f9f9f9;border-radius:8px;padding:16px;margin-bottom:20px;">
              <pre style="margin:0;font-family:'Courier New',monospace;font-size:13px;color:#374151;white-space:pre-wrap;">${itemsList}</pre>
            </div>

            <div style="text-align:center;margin-top:24px;">
              <a href="https://zamisprint.vercel.app/admin" 
                 style="display:inline-block;background:#7c3aed;color:#ffffff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;">
                Ir al Panel Admin →
              </a>
            </div>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;
};

/**
 * Email de notificación de ENVÍO para el cliente (ya existía, mejorado).
 */
export const orderShippedEmail = (order) => `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Tu pedido va en camino</title></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f4f4f8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f8;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#059669,#0891b2);padding:40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:28px;">ZAMIS Print</h1>
            <p style="margin:8px 0 0;color:#a7f3d0;font-size:32px;">📦</p>
            <p style="margin:8px 0 0;color:#d1fae5;font-size:20px;font-weight:700;">¡Tu pedido va en camino!</p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;">
            <p style="font-size:16px;margin:0 0 16px;">Hola <strong>${order.shippingAddress?.fullName || 'Cliente'}</strong>,</p>
            <p style="font-size:15px;color:#4b5563;line-height:1.7;margin:0 0 24px;">
              Tu pedido <strong>#${String(order._id).slice(-8).toUpperCase()}</strong> ha sido enviado y está en camino a:<br/>
              <strong>${order.shippingAddress?.address}, ${order.shippingAddress?.city}</strong>
            </p>
            <p style="font-size:14px;color:#6b7280;margin:0;">
              ¿Preguntas? Escríbenos por 
              <a href="https://wa.me/573107878192" style="color:#059669;">WhatsApp +57 310 787 8192</a>
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f4f4f8;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">© 2026 ZAMIS Print · Colombia</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
