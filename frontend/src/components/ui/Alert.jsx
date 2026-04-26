import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { useState } from 'react';

/**
 * Alert — Design System ZAMIS Print
 * Usage: <Alert type="success" title="¡Listo!" message="Producto agregado al carrito." dismissible />
 */

const ICONS = {
  success: <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />,
  warning: <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />,
  danger:  <XCircle className="w-5 h-5 shrink-0 mt-0.5" />,
  info:    <Info className="w-5 h-5 shrink-0 mt-0.5" />,
};

const Alert = ({
  type = 'info',
  title = '',
  message = '',
  dismissible = false,
  className = '',
}) => {
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.25 }}
          className={`alert alert-${type} ${className}`}
          role="alert"
        >
          {ICONS[type]}
          <div className="flex-1 min-w-0">
            {title && <p className="font-semibold">{title}</p>}
            {message && <p className={`${title ? 'mt-0.5 opacity-90' : ''} text-sm`}>{message}</p>}
          </div>
          {dismissible && (
            <button
              onClick={() => setVisible(false)}
              className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Toast — Floating notification (fixed position)
 * Usage: <Toast type="success" message="¡Producto añadido!" onClose={() => {}} />
 */
export const Toast = ({ type = 'success', message, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 24, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 24, scale: 0.95 }}
    className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-medium max-w-sm alert-${type} alert`}
  >
    {ICONS[type]}
    <span className="flex-1">{message}</span>
    {onClose && (
      <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    )}
  </motion.div>
);

/**
 * EmptyState — For empty lists, carts, search results
 * Usage: <EmptyState icon={<ShoppingCart />} title="Tu carrito está vacío" cta={<Button>Ver productos</Button>} />
 */
export const EmptyState = ({ icon, title, description, cta, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex flex-col items-center justify-center text-center py-20 px-6 ${className}`}
  >
    {icon && (
      <div className="w-16 h-16 rounded-2xl bg-surface-raised flex items-center justify-center mb-6 text-neutral-500">
        {icon}
      </div>
    )}
    {title && <h3 className="text-xl font-bold text-white mb-2">{title}</h3>}
    {description && <p className="text-neutral-400 max-w-sm mb-6">{description}</p>}
    {cta}
  </motion.div>
);

export default Alert;
