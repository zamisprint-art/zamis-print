import { motion } from 'framer-motion';
import { Printer, Palette, Truck, Zap } from 'lucide-react';
import SEOHead from '../components/SEOHead';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen pb-20">
      <SEOHead
        title="Nosotros | ZAMIS Print — Impresión 3D Colombia"
        description="Conoce el equipo de ZAMIS Print. Apasionados por la impresión 3D y el diseño personalizado. Tecnología de punta para dar vida a tus ideas."
      />
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-surface-base">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold text-neutral-900 mb-6 leading-tight"
          >
            Damos forma a tu <span className="text-brand-500">imaginación</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto"
          >
            En ZAMIS Print, no solo imprimimos objetos; materializamos ideas. Somos un equipo apasionado por la tecnología 3D, el diseño y los detalles perfectos.
          </motion.p>
        </div>
      </section>

      {/* Stats/Image Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <div className="rounded-3xl overflow-hidden h-[500px] shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1000&auto=format&fit=crop" 
              alt="Impresora 3D trabajando" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">Nuestra Historia</h2>
              <p className="text-neutral-600 leading-relaxed text-lg">
                ZAMIS Print nació con una visión clara: revolucionar la forma en que las personas interactúan con sus ideas. Lo que comenzó como una fascinación por la tecnología de impresión 3D se ha transformado en un estudio creativo donde la ingeniería y el arte convergen. Hoy, combinamos tecnología de deposición fundida (FDM) y resina de ultra alta resolución (SLA) para entregar piezas que superan los más altos estándares de calidad, desde coleccionables personalizados hasta soluciones funcionales.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-surface-card rounded-2xl border border-neutral-100 shadow-sm">
                <p className="text-4xl font-extrabold text-brand-500 mb-2">+10k</p>
                <p className="text-sm text-neutral-500 font-medium">Horas de impresión</p>
              </div>
              <div className="p-6 bg-surface-card rounded-2xl border border-neutral-100 shadow-sm">
                <p className="text-4xl font-extrabold text-brand-500 mb-2">100%</p>
                <p className="text-sm text-neutral-500 font-medium">Materiales Ecológicos</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Process Section */}
      <section className="bg-surface-card py-24 border-y border-neutral-200 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">¿Cómo trabajamos?</h2>
            <div className="h-1 w-24 bg-brand-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: '1. Tu Idea', desc: 'Cuéntanos qué necesitas o elige un modelo de nuestro catálogo.' },
              { icon: Palette, title: '2. Diseño', desc: 'Preparamos el modelo 3D, ajustamos tamaños, colores y personalizaciones.' },
              { icon: Printer, title: '3. Fabricación', desc: 'Nuestras impresoras trabajan capa por capa con precisión milimétrica.' },
              { icon: Truck, title: '4. Entrega', desc: 'Empacamos cuidadosamente tu pieza y te la enviamos hasta tu puerta.' }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center flex flex-col items-center"
              >
                <div className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 mb-6 shadow-sm border border-brand-100">
                  <step.icon size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-neutral-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
