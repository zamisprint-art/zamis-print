import { Resend } from 'resend';

/**
 * Servicio centralizado para el envío de correos utilizando el API de Resend (HTTP)
 * Esto previene bloqueos de puertos SMTP en hosting gratuitos como Render.
 * 
 * @param {Object} options Opciones del correo
 * @param {string} options.to Correo destino
 * @param {string} options.subject Asunto del correo
 * @param {string} options.html Cuerpo del correo en formato HTML
 */
const sendEmail = async ({ to, subject, html }) => {
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        // Usa el correo oficial como remitente. Si falla por falta de verificación DNS, 
        // fallback temporal a la cuenta de prueba de Resend.
        const fromEmail = process.env.SMTP_USER || 'ZAMIS Print <onboarding@resend.dev>';

        const { data, error } = await resend.emails.send({
            from: `ZAMIS Print <info@zamisprint.com>`, // Forzamos el uso del dominio personalizado
            to,
            subject,
            html,
        });

        if (error) {
            console.error(`⚠️ Resend API Error: ${error.message}`);
            return { success: false, error: error.message };
        }

        console.log(`✅ Email sent to ${to}: ${subject} [Resend ID: ${data?.id}]`);
        return { success: true, messageId: data?.id };
    } catch (error) {
        console.error(`⚠️ Email critical failure: ${error.message}`);
        return { success: false, error: error.message };
    }
};

export default sendEmail;
