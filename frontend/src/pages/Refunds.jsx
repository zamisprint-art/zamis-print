import React from 'react';
import { PackageX } from 'lucide-react';
import { motion } from 'framer-motion';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-surface-base py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-brand-600 to-brand-800 px-8 py-12 text-center text-white">
          <PackageX size={48} className="mx-auto mb-4 text-brand-100" />
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Garantías y Devoluciones</h1>
          <p className="text-brand-100 font-medium">Última actualización: {new Date().toLocaleDateString('es-CO')}</p>
        </div>
        
        <div className="p-8 md:p-12 prose prose-brand max-w-none text-neutral-600">
          <h2 className="text-2xl font-bold text-neutral-900 mt-0">1. Garantía por Defectos de Fabricación</h2>
          <p>
            En ZAMIS Print nos esforzamos por ofrecer impresiones 3D de la más alta calidad. Ofrecemos una garantía de <strong>30 días calendario</strong> contados a partir de la fecha de entrega del producto.
          </p>
          <p>Esta garantía cubre:</p>
          <ul>
            <li>Defectos estructurales evidentes (delaminación de capas severa).</li>
            <li>Piezas faltantes en pedidos de múltiples partes.</li>
            <li>Daños severos ocasionados durante el transporte (ver sección 2).</li>
          </ul>
          <p>Esta garantía <strong>NO</strong> cubre:</p>
          <ul>
            <li>Desgaste normal por uso, rayones, o daños causados por caídas o golpes posteriores a la entrega.</li>
            <li>Daños causados por exposición a altas temperaturas, agua prolongada (si el material no lo soporta) o químicos.</li>
            <li>Ligeras marcas de impresión, soportes o líneas de capa que son naturales y propias de la tecnología de impresión 3D (FDM / Resina).</li>
          </ul>

          <h2 className="text-2xl font-bold text-neutral-900 mt-8">2. Daños durante el Envío</h2>
          <p>
            Si tu pedido llega con daños evidentes causados por la transportadora (caja aplastada, producto roto en su interior), <strong>debes reportarlo en un plazo máximo de 48 horas</strong> tras haberlo recibido, enviando fotografías del empaque y del producto dañado a <strong>[TU_CORREO_DE_SOPORTE]</strong> o a nuestra línea de WhatsApp. 
            Pasado este tiempo, asumiremos que el producto fue recibido a satisfacción y no se aceptarán reclamos por daños de transporte.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-8">3. Excepción al Derecho de Retracto</h2>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg my-4 text-red-900">
            <p className="m-0 font-medium">
              Por mandato de la Ley 1480 de 2011 (Estatuto del Consumidor), artículo 47, se exceptúan del derecho de retracto los contratos de suministro de bienes confeccionados conforme a las especificaciones del consumidor o claramente personalizados.
            </p>
          </div>
          <p>
            Debido a que nuestras impresiones 3D y servicios de diseño son creados específicamente para cada cliente (bajo demanda, colores específicos, diseños a medida), <strong>no aceptamos devoluciones por retracto o arrepentimiento de compra</strong> una vez que el pedido ha pasado a estado de "En Producción".
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-8">4. Proceso para Reclamos de Garantía</h2>
          <p>Si consideras que tu caso aplica para garantía, por favor sigue estos pasos:</p>
          <ol>
            <li>Comunícate a <strong>[TU_CORREO_DE_SOPORTE]</strong> o al WhatsApp <strong>[TU_TELEFONO]</strong> indicando tu número de pedido (#).</li>
            <li>Adjunta fotos claras del problema.</li>
            <li>Nuestro equipo evaluará el caso en un plazo de 3 a 5 días hábiles.</li>
            <li>De ser aprobada la garantía, procederemos (a nuestra discreción) a reimprimir la pieza o a realizar un reembolso parcial/total dependiendo de la gravedad del defecto.</li>
          </ol>
        </div>
      </motion.div>
    </div>
  );
};

export default RefundPolicy;
