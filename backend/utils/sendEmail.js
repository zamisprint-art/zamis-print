import nodemailer from 'nodemailer';

/**
 * Servicio centralizado para el envío de correos utilizando Nodemailer y Namecheap SMTP.
 * @param {Object} options Opciones del correo
 * @param {string} options.to Correo destino
 * @param {string} options.subject Asunto del correo
 * @param {string} options.html Cuerpo del correo en formato HTML
 */
const sendEmail = async ({ to, subject, html }) => {
    try {
        const port = parseInt(process.env.SMTP_PORT || '465', 10);
        // Configuración del transporter usando SMTP
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'mail.privateemail.com',
            port: port,
            secure: port === 465, // true para 465, false para 587 o 25
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                // Previene problemas de conexión con certificados intermedios
                rejectUnauthorized: false
            }
        });

        // Configuración del remitente
        const mailOptions = {
            from: `ZAMIS Print <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        };

        // Enviar el correo
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${to}: ${subject} [ID: ${info.messageId}]`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error(`⚠️ Email failed: ${error.message}`);
        // No arrojamos el error para no interrumpir los flujos principales (ej. creación de orden)
        return { success: false, error: error.message };
    }
};

export default sendEmail;
