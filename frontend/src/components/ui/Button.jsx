import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Button — Design System ZAMIS Print
 * Usage: <Button variant="primary" size="lg" loading={false} fullWidth icon={<Icon />}>Label</Button>
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  isLoading = false,       // alias de loading (compatibilidad)
  loadingText = null,      // texto mientras carga
  disabled = false,
  fullWidth = false,
  icon = null,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const isActuallyLoading = loading || isLoading;

  const sizeClass = {
    xs: 'btn-xs',
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
    xl: 'btn-xl',
  }[size] || 'btn-md';

  const variantClass = {
    primary:   'btn-primary',
    secondary: 'btn-secondary',
    outline:   'btn-outline',
    ghost:     'btn-ghost',
    danger:    'btn-danger',
    success:   'btn-success',
  }[variant] || 'btn-primary';

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || isActuallyLoading}
      whileTap={!disabled && !isActuallyLoading ? { scale: 0.97 } : {}}
      className={`btn ${variantClass} ${sizeClass} ${fullWidth ? 'btn-full' : ''} ${className}`}
      {...props}
    >
      {isActuallyLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {loadingText && <span>{loadingText}</span>}
        </>
      ) : (
        icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>
      )}
      {!isActuallyLoading && children && <span>{children}</span>}
      {!isActuallyLoading && icon && iconPosition === 'right' && (
        <span className="shrink-0">{icon}</span>
      )}
    </motion.button>
  );
};

export default Button;
