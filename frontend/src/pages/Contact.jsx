import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Instagram, Facebook } from 'lucide-react';
import { Button } from '../components/ui';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', subject: '', message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-surface-base py-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-neutral-900 mb-4"
          >
            Hablemos de tu <span className="text-brand-500">próximo proyecto</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-500 text-lg max-w-2xl mx-auto"
          >
            ¿Tienes una idea en mente, necesitas cotizar un modelo 3D o tienes dudas sobre un pedido? Escríbenos y te responderemos a la velocidad de impresión.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
          
          {/* Contact Info Cards */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-6 lg:col-span-1"
          >
            <div className="bg-surface-card p-8 rounded-3xl border border-neutral-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-500 shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900 mb-1">Email</h3>
                <p className="text-neutral-500 mb-2">Soporte y cotizaciones</p>
                <a href="mailto:hola@zamisprint.com" className="text-brand-600 font-semibold hover:underline">hola@zamisprint.com</a>
              </div>
            </div>

            <div className="bg-surface-card p-8 rounded-3xl border border-neutral-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-500 shrink-0">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900 mb-1">WhatsApp</h3>
                <p className="text-neutral-500 mb-2">Lunes a Sábado, 9am - 6pm</p>
                <a href="https://wa.me/573000000000" className="text-green-600 font-semibold hover:underline">+57 300 000 0000</a>
              </div>
            </div>

            <div className="bg-surface-card p-8 rounded-3xl border border-neutral-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900 mb-1">Ubicación</h3>
                <p className="text-neutral-500">Bogotá, Colombia<br/>(Tienda 100% online, envíos a todo el país)</p>
              </div>
            </div>
            
            {/* Socials */}
            <div className="flex gap-4 mt-4 px-2">
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-colors"><Instagram size={20}/></a>
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-colors"><Facebook size={20}/></a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-neutral-100"
          >
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
                  <Send size={40} />
                </div>
                <h2 className="text-3xl font-bold text-neutral-900">¡Mensaje Enviado!</h2>
                <p className="text-neutral-500 max-w-md">
                  Gracias por escribirnos. Hemos recibido tu mensaje y nuestro equipo se pondrá en contacto contigo en las próximas 24 horas.
                </p>
                <Button variant="outline" onClick={() => setSubmitted(false)} className="mt-8">
                  Enviar otro mensaje
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label-base">Nombre Completo</label>
                    <input 
                      type="text" required 
                      value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                      className="input-field bg-surface-base" placeholder="Ej. Juan Pérez"
                    />
                  </div>
                  <div>
                    <label className="label-base">Correo Electrónico</label>
                    <input 
                      type="email" required 
                      value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                      className="input-field bg-surface-base" placeholder="ejemplo@correo.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="label-base">Asunto / Motivo</label>
                  <select 
                    required 
                    value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}
                    className="input-field bg-surface-base"
                  >
                    <option value="">Selecciona un motivo...</option>
                    <option value="cotizacion">Cotizar un diseño personalizado</option>
                    <option value="duda_pedido">Duda sobre un pedido existente</option>
                    <option value="soporte">Soporte general</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="label-base">Mensaje</label>
                  <textarea 
                    required rows="5"
                    value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                    className="input-field bg-surface-base resize-none" 
                    placeholder="Cuéntanos todos los detalles aquí..."
                  ></textarea>
                </div>

                <Button type="submit" variant="primary" size="lg" fullWidth icon={<Send size={18}/>}>
                  Enviar Mensaje
                </Button>
              </form>
            )}
          </motion.div>
          
        </div>
      </div>
    </div>
  );
};

export default Contact;
