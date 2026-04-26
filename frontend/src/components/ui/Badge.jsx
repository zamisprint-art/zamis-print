/**
 * Badge — Design System ZAMIS Print
 * Usage: <Badge variant="new">Nuevo</Badge>
 *        <Badge variant="stock" stock={5} />
 *        <Badge variant="status" status="shipped" />
 */

const STOCK_VARIANTS = {
  high: { cls: 'badge stock-high', label: 'En Stock' },
  low:  { cls: 'badge stock-low',  label: null },       // label shown dynamically
  out:  { cls: 'badge stock-out',  label: 'Agotado' },
};

const STATUS_MAP = {
  pending:    { cls: 'badge status-pending',    label: 'Pendiente' },
  processing: { cls: 'badge status-processing', label: 'En proceso' },
  shipped:    { cls: 'badge status-shipped',    label: 'Enviado' },
  delivered:  { cls: 'badge status-delivered',  label: 'Entregado' },
  cancelled:  { cls: 'badge status-cancelled',  label: 'Cancelado' },
};

const Badge = ({
  variant = 'info',
  children,
  stock = null,     // number, used when variant="stock"
  status = null,    // string, used when variant="status"
  className = '',
}) => {
  // --- Stock Badge ---
  if (variant === 'stock' && stock !== null) {
    if (stock === 0) {
      const { cls, label } = STOCK_VARIANTS.out;
      return <span className={`${cls} ${className}`}>{label}</span>;
    }
    if (stock <= 5) {
      const { cls } = STOCK_VARIANTS.low;
      return <span className={`${cls} ${className}`}>Solo {stock} disponibles</span>;
    }
    const { cls, label } = STOCK_VARIANTS.high;
    return <span className={`${cls} ${className}`}>{label}</span>;
  }

  // --- Order Status Badge ---
  if (variant === 'status' && status) {
    const s = STATUS_MAP[status] || STATUS_MAP.pending;
    return <span className={`${s.cls} ${className}`}>{s.label}</span>;
  }

  // --- Standard Badges ---
  const variantClass = {
    new:      'badge badge-new',
    sale:     'badge badge-sale',
    featured: 'badge badge-featured',
    soldout:  'badge badge-sold-out',
    success:  'badge badge-success',
    info:     'badge badge-info',
    category: 'badge badge-category',
  }[variant] || 'badge badge-info';

  return (
    <span className={`${variantClass} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
