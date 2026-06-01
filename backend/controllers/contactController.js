import axios from 'axios';
import Contact from '../models/contactModel.js';
import sendEmail from '../utils/sendEmail.js';
import { contactAdminEmail, contactUserEmail } from '../utils/emailTemplates.js';

// @desc    Submit a contact form message
// @route   POST /api/contacts
// @access  Public
export const submitContactForm = async (req, res) => {
  const { name, email, phone, subject, message, recaptchaToken } = req.body;

  try {
    // 1. Verify reCAPTCHA token if provided
    if (recaptchaToken) {
      const secretKey = process.env.RECAPTCHA_SECRET_KEY;
      if (secretKey) {
        const verifyUrl = \`https://www.google.com/recaptcha/api/siteverify?secret=\${secretKey}&response=\${recaptchaToken}\`;
        const { data } = await axios.post(verifyUrl);

        if (!data.success) {
          return res.status(400).json({ message: 'Validación de reCAPTCHA fallida', detail: data['error-codes'] });
        }
      } else {
        console.warn('RECAPTCHA_SECRET_KEY is not defined in env. Skipping backend verification.');
      }
    } else {
      return res.status(400).json({ message: 'El token de reCAPTCHA es obligatorio.' });
    }

    // 2. Save message to DB
    const contactMessage = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    if (contactMessage) {
      // 3. Send Emails
      const adminEmail = process.env.EMAIL_USER || 'info@zamisprint.com';
      
      // Send to admin
      try {
        await sendEmail({
          to: adminEmail,
          subject: \`Nuevo Mensaje: \${subject}\`,
          html: contactAdminEmail({ name, email, phone, subject, message }),
        });
      } catch (err) {
        console.error('Error sending email to admin:', err);
      }

      // Send to user
      try {
        await sendEmail({
          to: email,
          subject: 'ZAMIS Print - Hemos recibido tu mensaje',
          html: contactUserEmail({ name, subject }),
        });
      } catch (err) {
        console.error('Error sending auto-reply to user:', err);
      }

      res.status(201).json({ message: 'Mensaje enviado correctamente' });
    } else {
      res.status(400).json({ message: 'No se pudo guardar el mensaje.' });
    }
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ message: 'Error en el servidor al enviar el mensaje' });
  }
};
