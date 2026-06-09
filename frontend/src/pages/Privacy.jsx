import React from 'react';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-surface-base py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-brand-600 to-brand-800 px-8 py-12 text-center text-white">
          <Lock size={48} className="mx-auto mb-4 text-brand-100" />
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Política de Privacidad</h1>
          <p className="text-brand-100 font-medium">Última actualización: {new Date().toLocaleDateString('es-CO')}</p>
        </div>

        <div className="p-8 md:p-12 prose prose-brand max-w-none text-neutral-600">
          <p className="lead text-lg font-medium text-neutral-700">
            En ZAMIS Print estamos comprometidos con la protección de tus datos personales.
            Esta política explica cómo recolectamos, usamos y protegemos tu información en cumplimiento con la Ley 1581 de 2012 de Colombia.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-8">1. Responsable del Tratamiento</h2>
          <p>
            El responsable del tratamiento de tus datos personales es <strong>ZAMIS Print</strong>, con NIT/CC <strong>1019996790</strong>,
            ubicado en la ciudad de <strong>Bogotá, Colombia</strong>. Correo de contacto: <strong>info@zamisprint.com</strong>.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-8">2. Datos Recolectados</h2>
          <p>Para procesar tus compras y brindar un excelente servicio, podemos solicitar los siguientes datos:</p>
          <ul>
            <li>Nombres y apellidos completos.</li>
            <li>Tipo y número de identificación (CC, NIT, CE, etc.).</li>
            <li>Correo electrónico y número de teléfono (WhatsApp).</li>
            <li>Dirección física para envíos.</li>
            <li>Información relacionada con las especificaciones de tus pedidos.</li>
          </ul>
          <p className="text-sm italic text-neutral-500 mt-2">
            Nota: Los datos de tus tarjetas de crédito o débito son procesados directamente por nuestra pasarela de pagos segura (MercadoPago) y ZAMIS Print no tiene acceso ni almacena esta información.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-8">3. Finalidad del Tratamiento</h2>
          <p>Utilizamos tus datos personales única y exclusivamente para:</p>
          <ul>
            <li>Procesar, facturar y enviar tus pedidos.</li>
            <li>Contactarte en caso de novedades con el diseño, impresión o entrega de tu compra.</li>
            <li>Responder a tus consultas, peticiones, quejas o reclamos (PQRS).</li>
            <li>Enviarte información relevante sobre el estado de tu pedido.</li>
            <li>(Opcional) Enviarte correos promocionales o descuentos, únicamente si has dado tu consentimiento explícito para ello.</li>
          </ul>

          <h2 className="text-2xl font-bold text-neutral-900 mt-8">4. Derechos del Titular (Habeas Data)</h2>
          <p>Como titular de los datos personales, tienes derecho a:</p>
          <ul>
            <li>Conocer, actualizar y rectificar tus datos personales frente a ZAMIS Print.</li>
            <li>Solicitar prueba de la autorización otorgada para el tratamiento de tus datos.</li>
            <li>Revocar la autorización y/o solicitar la supresión del dato en cualquier momento.</li>
            <li>Acceder en forma gratuita a los datos personales que hayan sido objeto de Tratamiento.</li>
          </ul>

          <h2 className="text-2xl font-bold text-neutral-900 mt-8">5. Ejercicio de tus Derechos</h2>
          <p>
            Para ejercer tus derechos de conocer, actualizar, rectificar y suprimir tu información, puedes enviar un correo electrónico a <strong>info@zamisprint.com</strong>
            indicando en el asunto "Ejercicio Derecho Habeas Data". Daremos respuesta a tu solicitud en los tiempos establecidos por la ley.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Privacy;
