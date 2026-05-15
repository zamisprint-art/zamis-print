import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

const CartDrawer = () => {
  const { cartItems, isDrawerOpen, toggleDrawer, removeItem } = useCartStore();
  const navigate = useNavigate();

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  
  // Envío gratis a partir de $150.000 COP
  const freeShippingThreshold = 150000;
  const missingForFreeShipping = Math.max(0, freeShippingThreshold - totalAmount);
  const progressPercentage = Math.min(100, (totalAmount / freeShippingThreshold) * 100);

  const formatPrice = (val) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(val);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Fondo oscuro (Backdrop) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]"
            onClick={() => toggleDrawer(false)}
          />

          {/* Cajón lateral */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-[90] flex flex-col"
          >
            {/* Header del cajón */}
            <div className="flex items-center justify-between p-5 border-b border-neutral-100">
              <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <ShoppingBag size={20} className="text-brand-500" />
                Tu Carrito ({cartItems.reduce((a, c) => a + c.qty, 0)})
              </h2>
              <button 
                onClick={() => toggleDrawer(false)}
                className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Barra de progreso de envío gratis */}
            <div className="bg-brand-50/50 p-4 border-b border-neutral-100">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-semibold text-brand-700">
                  {missingForFreeShipping > 0 
                    ? `¡Te faltan ${formatPrice(missingForFreeShipping)} para envío gratis!` 
                    : '¡Felicidades! Tienes envío gratis.'}
                </span>
              </div>
              <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                  className={`h-full rounded-full ${missingForFreeShipping === 0 ? 'bg-green-500' : 'bg-brand-500'}`}
                />
              </div>
            </div>

            {/* Lista de productos */}
            <div className="flex-1 overflow-y-auto p-5">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center">
                    <ShoppingBag size={40} className="text-neutral-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">Tu carrito está vacío</h3>
                    <p className="text-sm text-neutral-500 mt-1">¡Añade algunas figuras o impresiones personalizadas!</p>
                  </div>
                  <button 
                    onClick={() => { toggleDrawer(false); navigate('/shop'); }}
                    className="px-6 py-2 bg-brand-500 text-white font-bold rounded-xl hover:bg-brand-600 transition-colors"
                  >
                    Ir a la tienda
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.product} className="flex gap-4 p-3 bg-white border border-neutral-100 rounded-2xl hover:border-brand-200 transition-colors group">
                      <div className="w-20 h-20 bg-neutral-100 rounded-xl overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-neutral-900 line-clamp-2 leading-tight">
                            {item.name}
                          </h4>
                          <p className="text-xs text-neutral-500 mt-1">Cant: {item.qty}</p>
                          {item.personalizationText && (
                            <p className="text-[10px] text-brand-600 mt-1 line-clamp-2 bg-brand-50 inline-block px-2 py-0.5 rounded-md border border-brand-100">
                              ✏️ {item.personalizationText}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-bold text-brand-600">
                            {formatPrice(item.price * item.qty)}
                          </span>
                          <button 
                            onClick={() => removeItem(item.product)}
                            className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Zona de Cross-Selling Básica */}
                  <div className="mt-8 pt-6 border-t border-neutral-100">
                    <h5 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">Quizás te interese...</h5>
                    <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between cursor-pointer hover:border-brand-300 transition-colors" onClick={() => { toggleDrawer(false); navigate('/shop'); }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600">✨</div>
                        <div>
                          <p className="text-sm font-bold text-neutral-900">Bases Personalizadas</p>
                          <p className="text-xs text-neutral-500">Acompaña tus figuras</p>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-neutral-400" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer con Total y Botones */}
            {cartItems.length > 0 && (
              <div className="p-5 bg-white border-t border-neutral-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-neutral-500 font-semibold">Subtotal</span>
                  <span className="text-xl font-bold text-neutral-900">{formatPrice(totalAmount)}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => { toggleDrawer(false); navigate('/cart'); }}
                    className="w-full py-3 px-4 rounded-xl font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 transition-colors text-sm"
                  >
                    Ver Carrito
                  </button>
                  <button 
                    onClick={() => { toggleDrawer(false); navigate('/checkout'); }}
                    className="w-full py-3 px-4 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30 text-sm flex items-center justify-center gap-2"
                  >
                    Pagar Ahora <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
