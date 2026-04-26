import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import PriceDisplay from './PriceDisplay';
import QuantitySelector from './QuantitySelector';

/**
 * CartItem — Design System ZAMIS Print
 * A single item row in the shopping cart.
 *
 * Usage:
 *   <CartItem
 *     item={{ _id, name, image, price, countInStock, qty }}
 *     onQtyChange={(id, qty) => {}}
 *     onRemove={(id) => {}}
 *   />
 */
const CartItem = ({ item, onQtyChange, onRemove }) => {
  const { _id, name, image, price, countInStock, qty } = item;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16, height: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-4 p-4 rounded-2xl bg-surface-card border border-white/8 group"
    >
      {/* Thumbnail */}
      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-surface-raised">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => { e.target.src = '/placeholder.png'; }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <p className="font-semibold text-white text-sm leading-tight line-clamp-2">{name}</p>

        <PriceDisplay price={price} size="sm" />

        <div className="flex items-center justify-between gap-3 mt-auto">
          <QuantitySelector
            value={qty}
            onChange={(newQty) => onQtyChange(_id, newQty)}
            min={1}
            max={countInStock}
            size="sm"
          />

          <button
            onClick={() => onRemove(_id)}
            aria-label={`Eliminar ${name}`}
            className="btn-icon-sm btn-ghost text-neutral-500 hover:text-danger transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Subtotal (desktop) */}
      <div className="hidden sm:flex flex-col items-end justify-between shrink-0">
        <span className="text-xs text-neutral-500">Subtotal</span>
        <span className="price-current text-lg">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price * qty)}</span>
      </div>
    </motion.div>
  );
};

export default CartItem;
