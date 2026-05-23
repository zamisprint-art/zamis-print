import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle, X } from 'lucide-react';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirmar Acción', 
  message = '¿Estás seguro de continuar?', 
  confirmText = 'Aceptar', 
  cancelText = 'Cancelar', 
  variant = 'primary' 
}) => {
  
  if (!isOpen) return null;

  const variants = {
    danger: {
      icon: <AlertTriangle className="w-8 h-8 text-red-500" />,
      bgIcon: 'bg-red-100',
      btnConfirm: 'bg-red-500 hover:bg-red-600 focus:ring-red-500',
      textConfirm: 'text-white'
    },
    warning: {
      icon: <Info className="w-8 h-8 text-amber-500" />,
      bgIcon: 'bg-amber-100',
      btnConfirm: 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500',
      textConfirm: 'text-white'
    },
    primary: {
      icon: <CheckCircle className="w-8 h-8 text-brand-500" />,
      bgIcon: 'bg-brand-100',
      btnConfirm: 'bg-brand-500 hover:bg-brand-600 focus:ring-brand-500',
      textConfirm: 'text-white'
    }
  };

  const style = variants[variant] || variants.primary;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
        />

        {/* Modal Panel */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>

          <div className="p-6 sm:p-8 flex flex-col items-center text-center">
            {/* Icon */}
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 ${style.bgIcon}`}>
              {style.icon}
            </div>

            {/* Text */}
            <h3 className="text-xl font-bold text-neutral-900 mb-2">{title}</h3>
            <p className="text-neutral-600">{message}</p>
          </div>

          {/* Actions */}
          <div className="p-4 sm:p-6 bg-neutral-50 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end border-t border-neutral-100">
            <button 
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl border-2 border-neutral-200 text-neutral-700 font-bold hover:bg-neutral-100 focus:outline-none focus:ring-4 focus:ring-neutral-100 transition-all"
            >
              {cancelText}
            </button>
            <button 
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold shadow-sm focus:outline-none focus:ring-4 focus:ring-opacity-50 transition-all ${style.btnConfirm} ${style.textConfirm}`}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmModal;
