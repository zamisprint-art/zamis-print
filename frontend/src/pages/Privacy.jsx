const Privacy = () => (
  <div className="min-h-screen bg-surface-base py-20 px-4">
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-brand-600 text-sm font-semibold uppercase tracking-widest mb-3">Legal</p>
        <h1 className="text-4xl font-extrabold text-neutral-900">Política de Privacidad</h1>
        <p className="text-neutral-500 mt-3">Última actualización: Abril 2025</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 md:p-12 prose prose-neutral max-w-none space-y-8">
        {[
          {
            title: '1. Información que recopilamos',
            body: 'Recopilamos información que nos proporcionas directamente al crear una cuenta, realizar un pedido o contactarnos: nombre completo, correo electrónico, dirección de envío, número de teléfono y datos de pago procesados de forma segura por MercadoPago.'
          },
          {
            title: '2. Uso de la información',
            body: 'Utilizamos tu información exclusivamente para: procesar y gestionar tus pedidos, comunicarte el estado de tu envío, ofrecerte soporte postventa y, con tu consentimiento, enviarte novedades y promociones de ZAMIS Print. Nunca vendemos tus datos a terceros.'
          },
          {
            title: '3. Seguridad de los datos',
            body: 'Toda la información sensible (contraseñas y datos de pago) es cifrada utilizando estándares de la industria (bcrypt, HTTPS/TLS). Los pagos son gestionados íntegramente por MercadoPago, lo que significa que no almacenamos datos de tarjetas de crédito en nuestros servidores.'
          },
          {
            title: '4. Cookies',
            body: 'Utilizamos cookies de sesión esenciales para mantener tu carrito activo y tu estado de inicio de sesión. No utilizamos cookies de rastreo publicitario de terceros.'
          },
          {
            title: '5. Tus derechos',
            body: 'Tienes derecho a acceder, corregir o eliminar tus datos personales en cualquier momento. Para ejercer este derecho, contáctanos a hola@zamisprint.com y responderemos en un plazo máximo de 5 días hábiles.'
          },
          {
            title: '6. Contacto',
            body: 'Si tienes preguntas sobre esta política, escríbenos a hola@zamisprint.com o visita nuestra página de Contacto.'
          },
        ].map((section, i) => (
          <div key={i}>
            <h2 className="text-lg font-bold text-neutral-900 mb-2">{section.title}</h2>
            <p className="text-neutral-600 leading-relaxed">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Privacy;
