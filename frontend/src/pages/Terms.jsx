import { Link } from 'react-router-dom';

const Terms = () => (
  <div className="min-h-screen bg-surface-base py-20 px-4">
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-brand-600 text-sm font-semibold uppercase tracking-widest mb-3">Legal</p>
        <h1 className="text-4xl font-extrabold text-neutral-900">Términos y Condiciones</h1>
        <p className="text-neutral-500 mt-3">Última actualización: Abril 2025</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 md:p-12 space-y-8">
        {[
          {
            title: '1. Aceptación de los términos',
            body: 'Al acceder y utilizar la plataforma ZAMIS Print, aceptas cumplir con estos Términos y Condiciones. Si no estás de acuerdo con alguna parte, te pedimos que no utilices nuestros servicios.'
          },
          {
            title: '2. Productos y personalización',
            body: 'Todos los productos son fabricados bajo demanda mediante tecnología de impresión 3D. Los tiempos de producción estimados se indican en cada producto. ZAMIS Print se reserva el derecho de rechazar pedidos que infrinjan derechos de terceros o incluyan contenido inapropiado.'
          },
          {
            title: '3. Precios y pagos',
            body: 'Los precios están expresados en Pesos Colombianos (COP) e incluyen IVA cuando aplica. El pago se procesa de forma segura a través de MercadoPago. El pedido se confirma únicamente cuando el pago es aprobado.'
          },
          {
            title: '4. Envíos',
            body: 'Realizamos envíos a todo el territorio colombiano. Los tiempos de entrega son estimados y pueden variar por factores externos (carrier, condiciones climáticas, etc.). El costo de envío se calcula según la dirección de entrega.'
          },
          {
            title: '5. Devoluciones y garantías',
            body: 'Aceptamos devoluciones dentro de los 7 días siguientes a la recepción del producto, únicamente si el producto presenta defectos de fabricación o daños en el envío. Los productos personalizados no son elegibles para devolución salvo defecto comprobado.'
          },
          {
            title: '6. Propiedad intelectual',
            body: 'Todo el contenido de ZAMIS Print (diseños, imágenes, logotipos, modelos 3D) es propiedad de ZAMIS Print y está protegido por derechos de autor. Está prohibida su reproducción sin autorización expresa.'
          },
          {
            title: '7. Modificaciones',
            body: 'ZAMIS Print se reserva el derecho de modificar estos términos en cualquier momento. Te notificaremos por correo electrónico ante cambios significativos. El uso continuo de la plataforma implica la aceptación de los nuevos términos.'
          },
        ].map((section, i) => (
          <div key={i}>
            <h2 className="text-lg font-bold text-neutral-900 mb-2">{section.title}</h2>
            <p className="text-neutral-600 leading-relaxed">{section.body}</p>
          </div>
        ))}

        <div className="border-t border-neutral-100 pt-6 text-sm text-neutral-500">
          ¿Tienes dudas?{' '}
          <Link to="/contact" className="text-brand-600 hover:underline font-medium">
            Contáctanos
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default Terms;
