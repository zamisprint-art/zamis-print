import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    q: '¿Cuánto tiempo tarda en llegar mi pedido?',
    a: 'El tiempo de producción es de 3 a 7 días hábiles dependiendo de la complejidad del modelo. El envío a cualquier parte de Colombia tarda entre 2 y 5 días hábiles adicionales. Te notificamos por email en cada etapa del proceso.'
  },
  {
    q: '¿Puedo personalizar cualquier producto del catálogo?',
    a: 'Sí. Todos nuestros productos pueden adaptarse en color, tamaño y acabado. Algunos modelos también aceptan texto grabado o están basados en una foto tuya (ej. Funko Personalizado). Encontrarás las opciones disponibles en la página de cada producto.'
  },
  {
    q: '¿Qué materiales utilizan?',
    a: 'Trabajamos principalmente con PLA biodegradable (ideal para decoración y figuras), PETG de alta resistencia (para piezas funcionales) y resina de alta resolución (para detalles finos). Todos son materiales certificados y de uso seguro.'
  },
  {
    q: '¿Qué pasa si mi producto llega dañado?',
    a: 'Tienes 7 días desde la recepción para reportar cualquier daño. Contáctanos por WhatsApp con una foto del producto y gestionamos el reenvío sin costo adicional. Consulta nuestras Políticas de Devolución para más detalles.'
  },
  {
    q: '¿Puedo pagar contra entrega?',
    a: 'Actualmente procesamos los pagos de forma segura a través de MercadoPago, que acepta tarjetas de crédito/débito, PSE y efectivo en puntos autorizados. No manejamos pago contra entrega.'
  },
  {
    q: '¿Hacen envíos fuera de Colombia?',
    a: 'Por el momento solo realizamos envíos dentro del territorio colombiano. Estamos trabajando para habilitar envíos internacionales próximamente.'
  },
  {
    q: '¿Puedo encargar un modelo 3D que no está en el catálogo?',
    a: '¡Claro que sí! Contáctanos a través de la página de Contacto o por WhatsApp con tu idea. Evaluamos el proyecto sin costo y te enviamos una cotización personalizada.'
  },
];

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-neutral-200 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-5 text-left gap-4"
      >
        <span className="font-semibold text-neutral-900 text-base">{q}</span>
        <ChevronDown
          size={20}
          className={`text-brand-500 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden"
      >
        <p className="pb-5 text-neutral-600 leading-relaxed">{a}</p>
      </motion.div>
    </div>
  );
};

const FAQ = () => (
  <div className="min-h-screen bg-surface-base py-20 px-4">
    <div className="max-w-3xl mx-auto">
      
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-brand-600 text-sm font-semibold uppercase tracking-widest mb-3">Ayuda</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 mb-4">
          Preguntas Frecuentes
        </h1>
        <p className="text-neutral-500 text-lg">
          Todo lo que necesitas saber antes de hacer tu pedido.
        </p>
      </div>

      {/* FAQ List */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm px-8 py-2 mb-12">
        {FAQS.map((item, i) => (
          <FAQItem key={i} q={item.q} a={item.a} />
        ))}
      </div>

      {/* CTA */}
      <div className="text-center bg-brand-50 border border-brand-100 rounded-2xl p-10">
        <h3 className="text-xl font-bold text-neutral-900 mb-2">¿No encontraste tu respuesta?</h3>
        <p className="text-neutral-500 mb-6">Nuestro equipo está listo para ayudarte personalmente.</p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-8 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-colors"
        >
          Escribirnos →
        </Link>
      </div>
    </div>
  </div>
);

export default FAQ;
