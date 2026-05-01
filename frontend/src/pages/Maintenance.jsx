import { motion } from 'framer-motion';
import { Settings, Clock, Mail, Wrench } from 'lucide-react';

const Maintenance = () => {
  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-xl w-full glass-panel border border-white/10 p-8 sm:p-12 rounded-3xl"
      >
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-500/30 blur-xl rounded-full" />
            <div className="relative w-20 h-20 bg-neutral-800 border border-neutral-700 rounded-2xl shadow-2xl flex items-center justify-center">
              <Settings className="w-10 h-10 text-brand-400 animate-spin-slow" style={{ animationDuration: '4s' }} />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-600 border border-brand-500 rounded-full flex items-center justify-center shadow-lg">
              <Wrench className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-black text-white tracking-tight mb-4 uppercase">
          ZAMIS<span className="text-brand-500">.</span>Print
        </h1>
        
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-200 mb-4">
          Estamos mejorando nuestra plataforma
        </h2>
        
        <p className="text-neutral-400 text-base sm:text-lg mb-8 leading-relaxed">
          Actualmente estamos realizando mantenimiento programado para ofrecerte una mejor experiencia. Volveremos a estar en línea muy pronto.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-neutral-800/50 rounded-xl p-4 border border-white/5 flex items-center justify-center gap-3">
            <Clock className="w-5 h-5 text-brand-400" />
            <span className="text-neutral-300 font-medium">De regreso pronto</span>
          </div>
          <a 
            href="mailto:hola@zamisprint.com" 
            className="bg-brand-500/10 hover:bg-brand-500/20 transition-colors rounded-xl p-4 border border-brand-500/30 flex items-center justify-center gap-3 group cursor-pointer"
          >
            <Mail className="w-5 h-5 text-brand-400 group-hover:scale-110 transition-transform" />
            <span className="text-brand-300 font-medium">Contáctanos</span>
          </a>
        </div>

        <p className="text-sm text-neutral-500">
          Agradecemos tu paciencia. El equipo de ZAMIS Print.
        </p>
      </motion.div>
    </div>
  );
};

export default Maintenance;
