import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { Button } from '../components/ui';
import { EmptyState } from '../components/ui/Alert';
import CartItem from '../components/ecommerce/CartItem';
import TrustBadges from '../components/ecommerce/TrustBadges';
import { fadeUp, staggerContainer, staggerItem } from '../design-system/tokens';

const formatCOP = (value) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeItem, addItem } = useCartStore();

  const totalItems    = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice    = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  const handleQtyChange = (productId, newQty) => {
    const item = cartItems.find((i) => i.product === productId);
    if (item) addItem({ ...item, qty: newQty });
  };

  return (
    <div className="container-xl py-12 mb-20 md:mb-0">

      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-10">
        <p className="text-brand-600 text-sm font-semibold uppercase tracking-widest mb-2">Resumen</p>
        <h1 className="text-4xl font-extrabold text-neutral-900">
          Tu Carrito
          {totalItems > 0 && (
            <span className="ml-3 badge badge-info text-base normal-case tracking-normal">{totalItems} {totalItems === 1 ? 'ítem' : 'ítems'}</span>
          )}
        </h1>
      </motion.div>

      {cartItems.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="w-8 h-8" />}
          title="Tu carrito está vacío"
          description="Aún no has añadido productos. Explora nuestra tienda y encuentra algo que te encante."
          cta={
            <Link to="/shop" className="btn btn-primary btn-lg">
              Explorar Tienda
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Cart Items */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 flex flex-col gap-3"
          >
            <AnimatePresence mode="popLayout">
              {cartItems.map((item) => (
                <motion.div key={item.product} variants={staggerItem}>
                  <CartItem
                    item={item}
                    onQtyChange={handleQtyChange}
                    onRemove={removeItem}
                  />
                  {/* Personalization notes */}
                  {(item.personalizationText || item.personalizationImage) && (
                    <div className="ml-24 mt-1 px-4 py-2 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-300 flex flex-col gap-0.5">
                      {item.personalizationText && <span>✏️ Texto: {item.personalizationText}</span>}
                      {item.personalizationImage && <span>📎 Foto de referencia incluida</span>}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-brand-600 transition-colors mt-4 self-start font-medium"
            >
              ← Continuar comprando
            </Link>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="lg:col-span-1"
          >
            <div className="bg-surface-card p-6 rounded-2xl border border-neutral-200 shadow-sm sticky top-24 flex flex-col gap-5">
              <h2 className="text-xl font-bold border-b border-neutral-200 pb-4 text-neutral-900">Resumen del Pedido</h2>

              {/* Line items */}
              <div className="flex flex-col gap-2 text-sm">
                {cartItems.map((item) => (
                  <div key={item.product} className="flex justify-between text-neutral-600">
                    <span className="truncate max-w-[160px]">{item.name} × {item.qty}</span>
                    <span className="shrink-0 ml-2 font-medium">{formatCOP(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>

              <div className="divider my-0" />

              {/* Subtotal */}
              <div className="flex justify-between text-sm text-neutral-600">
                <span>Subtotal ({totalItems} {totalItems === 1 ? 'ítem' : 'ítems'})</span>
                <span className="font-medium">{formatCOP(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm text-neutral-500">
                <span>Envío</span>
                <span className="text-green-600 font-medium">Calculado en checkout</span>
              </div>

              <div className="divider my-0" />

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="font-bold text-neutral-900">Total Estimado</span>
                <span className="price-current text-xl">{formatCOP(totalPrice)}</span>
              </div>

              {/* CTA */}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                icon={<ArrowRight className="w-5 h-5" />}
                iconPosition="right"
                onClick={() => navigate('/checkout')}
              >
                Proceder al Pago
              </Button>

              {/* Trust badges (checkout variant) */}
              <TrustBadges variant="compact" className="justify-center" />
            </div>
          </motion.div>

        </div>
      )}
    </div>
  );
};

export default Cart;
