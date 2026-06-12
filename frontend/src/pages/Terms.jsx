
import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Terms = () => {
  return (
    <div className="min-h-screen bg-surface-base py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-brand-600 to-brand-800 px-8 py-12 text-center text-white">
          <Shield size={48} className="mx-auto mb-4 text-brand-100" />
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Términos y Condiciones</h1>
          <p className="text-brand-100 font-medium">Última actualización: {new Date().toLocaleDateString('es-CO')}</p>
        </div>

        <div className="p-8 md:p-12 prose prose-brand max-w-none text-neutral-600">
          <h2 className="text-2xl font-bold text-neutral-900 mt-0">1. Información General</h2>
          <p>
            Bienvenido a <strong>ZAMIS Print</strong>. Estos términos y condiciones regulan el uso de nuestro sitio web y la compra de nuestros productos. Al acceder a esta página o realizar una compra, aceptas estar sujeto a los siguientes términos.
            El sitio web es operado por <strong>ZAMIS Print</strong> (en adelante "la empresa"), identificada con NIT/CC <strong>1019996790</strong>, con domicilio principal en <strong>Bogotá, Colombia</strong>.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-8">2. Productos y Personalización</h2>
          <p>
            ZAMIS Print se especializa en la fabricación de artículos mediante impresión 3D. Debido a la naturaleza del proceso de fabricación aditiva, es posible que los productos presenten ligeras marcas de capas o variaciones milimétricas que son características propias de esta tecnología y no se consideran defectos.
          </p>
          <p>
            <strong>Productos Personalizados:</strong> Cuando solicitas un producto personalizado, eres responsable de la exactitud de las especificaciones, textos y diseños proporcionados. ZAMIS Print no se hace responsable por errores en la información suministrada por el cliente.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-8">3. Precios y Pagos</h2>
          <p>
            Todos los precios publicados en el sitio están en Pesos Colombianos (COP) y no incluyen los costos de envío, los cuales se calcularán y mostrarán antes de finalizar la compra.
            Nos reservamos el derecho de modificar los precios en cualquier momento. Procesamos nuestros pagos de forma segura a través de pasarelas de pago autorizadas (MercadoPago).
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-8">4. Excepción al Derecho de Retracto</h2>
          <div className="bg-neutral-50 border-l-4 border-brand-500 p-4 rounded-r-lg my-4">
            <p className="m-0 font-medium text-neutral-800">
              De acuerdo con el artículo 47 de la Ley 1480 de 2011 (Estatuto del Consumidor de Colombia), el derecho de retracto <strong>NO aplica</strong> para bienes confeccionados conforme a las especificaciones del consumidor o claramente personalizados.
            </p>
            <p className="m-0 mt-2 text-sm">
              Al tratarse de impresiones 3D fabricadas bajo demanda o a medida, todas las ventas son finales y no se aceptan devoluciones por arrepentimiento una vez ha iniciado el proceso de fabricación.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-neutral-900 mt-8">5. Tiempos de Entrega</h2>
          <p>
            Al tratarse de productos fabricados bajo demanda, el tiempo de entrega total incluye el tiempo de producción (impresión 3D) más el tiempo de envío por parte de la transportadora.
            Los tiempos estimados se informarán al momento de la compra. ZAMIS Print no se hace responsable por retrasos atribuibles a la empresa de transporte o a situaciones de fuerza mayor.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-8">6. Contacto</h2>
          <p>
            Para cualquier inquietud, reclamo o información adicional sobre estos Términos y Condiciones, puedes contactarnos al correo electrónico: <strong>info@zamisprint.com</strong> o al número de teléfono <strong>+57 3107878192</strong>.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Terms;
