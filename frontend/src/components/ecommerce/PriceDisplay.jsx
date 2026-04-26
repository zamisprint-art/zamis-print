/**
 * PriceDisplay — Design System ZAMIS Print
 * Shows current price, original (crossed), discount % and currency.
 * 
 * Usage:
 *   <PriceDisplay price={299} />
 *   <PriceDisplay price={199} originalPrice={299} currency="COP" size="lg" />
 */

const formatPrice = (value, currency = 'COP') => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const PriceDisplay = ({
  price,
  originalPrice = null,
  currency = 'COP',
  size = 'md',        // 'sm' | 'md' | 'lg'
  showDiscount = true,
  className = '',
}) => {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPct = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const priceClass = size === 'lg' ? 'price-lg' : 'price-current';
  const origClass  = size === 'lg' ? 'font-price text-lg text-neutral-500 line-through' : 'price-original';

  return (
    <div className={`flex items-center flex-wrap gap-2 ${className}`}>
      <span className={priceClass}>{formatPrice(price, currency)}</span>

      {hasDiscount && (
        <>
          <span className={origClass}>{formatPrice(originalPrice, currency)}</span>
          {showDiscount && (
            <span className="badge badge-sale">-{discountPct}%</span>
          )}
        </>
      )}
    </div>
  );
};

export default PriceDisplay;
