import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';

/**
 * QuantitySelector — Design System ZAMIS Print
 * Animated quantity picker with min/max constraints.
 *
 * Usage:
 *   <QuantitySelector value={qty} onChange={setQty} min={1} max={stock} />
 */
const QuantitySelector = ({
  value = 1,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  size = 'md',     // 'sm' | 'md' | 'lg'
  className = '',
}) => {
  const btnSize = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';
  const textSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base';

  const decrement = () => {
    if (value > min && !disabled) onChange(value - 1);
  };

  const increment = () => {
    if (value < max && !disabled) onChange(value + 1);
  };

  return (
    <div
      className={`qty-selector ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`}
      role="group"
      aria-label="Cantidad"
    >
      <motion.button
        type="button"
        whileTap={{ scale: 0.88 }}
        onClick={decrement}
        disabled={value <= min || disabled}
        aria-label="Disminuir cantidad"
        className={`qty-btn ${btnSize} disabled:opacity-30 disabled:cursor-not-allowed`}
      >
        <Minus className="w-3.5 h-3.5" />
      </motion.button>

      <motion.span
        key={value}
        initial={{ scale: 1.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.15 }}
        className={`qty-value ${textSize}`}
        aria-live="polite"
      >
        {value}
      </motion.span>

      <motion.button
        type="button"
        whileTap={{ scale: 0.88 }}
        onClick={increment}
        disabled={value >= max || disabled}
        aria-label="Aumentar cantidad"
        className={`qty-btn ${btnSize} disabled:opacity-30 disabled:cursor-not-allowed`}
      >
        <Plus className="w-3.5 h-3.5" />
      </motion.button>
    </div>
  );
};

export default QuantitySelector;
