/**
 * Spinner — Design System ZAMIS Print
 * Usage: <Spinner size="md" color="brand" />
 */
const Spinner = ({ size = 'md', color = 'brand', className = '' }) => {
  const sizeMap = {
    xs: 'w-3 h-3 border-[1.5px]',
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-[3px]',
    xl: 'w-12 h-12 border-4',
  };

  const colorMap = {
    brand:   'border-brand-500/20 border-t-brand-500',
    accent:  'border-accent-500/20 border-t-accent-500',
    white:   'border-white/20 border-t-white',
    success: 'border-success/20 border-t-success',
    danger:  'border-danger/20 border-t-danger',
  };

  return (
    <span
      role="status"
      aria-label="Cargando..."
      className={`inline-block rounded-full animate-spin ${sizeMap[size] || sizeMap.md} ${colorMap[color] || colorMap.brand} ${className}`}
    />
  );
};

/**
 * FullPageSpinner — Centered loading overlay
 * Usage: <FullPageSpinner />
 */
export const FullPageSpinner = ({ message = 'Cargando...' }) => (
  <div className="fixed inset-0 bg-surface-base/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 gap-4">
    <Spinner size="xl" color="brand" />
    <p className="text-neutral-400 text-sm animate-pulse">{message}</p>
  </div>
);

/**
 * InlineSpinner — For use inside buttons or small areas
 */
export const InlineSpinner = ({ size = 'sm' }) => <Spinner size={size} />;

export default Spinner;
