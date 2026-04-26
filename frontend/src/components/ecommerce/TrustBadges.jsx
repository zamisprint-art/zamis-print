import { Shield, Truck, RefreshCcw, Star, CreditCard, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * TrustBadges — Design System ZAMIS Print
 * Security and trust indicators for product pages and checkout.
 *
 * Usage:
 *   <TrustBadges />                         ← default set
 *   <TrustBadges variant="checkout" />      ← checkout focused
 *   <TrustBadges variant="compact" />       ← inline row
 */

const BADGES_DEFAULT = [
  { icon: Shield,       label: 'Pago 100% Seguro' },
  { icon: Truck,        label: 'Envío a todo el país' },
  { icon: RefreshCcw,   label: 'Devolución fácil' },
  { icon: Star,         label: 'Calidad Premium' },
];

const BADGES_CHECKOUT = [
  { icon: Shield,       label: 'Transacción encriptada' },
  { icon: CreditCard,   label: 'Múltiples métodos de pago' },
  { icon: Headphones,   label: 'Soporte 7 días' },
  { icon: RefreshCcw,   label: '30 días de garantía' },
];

const TrustBadges = ({ variant = 'default', className = '' }) => {
  const badges = variant === 'checkout' ? BADGES_CHECKOUT : BADGES_DEFAULT;

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap items-center gap-4 ${className}`}>
        {badges.map(({ icon: Icon, label }) => (
          <span key={label} className="trust-badge">
            <Icon className="w-3.5 h-3.5 text-brand-400" />
            {label}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${className}`}>
      {badges.map(({ icon: Icon, label }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
          className="flex flex-col items-center gap-2 p-3 rounded-xl bg-surface-card border border-neutral-100 text-center"
        >
          <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-brand-400" />
          </div>
          <span className="text-xs text-neutral-400 font-medium leading-tight">{label}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default TrustBadges;
