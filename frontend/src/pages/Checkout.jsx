import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { CheckCircle2, Truck, CreditCard, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems } = useCartStore();
  const { userInfo } = useAuthStore();
  
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(2); // 1: Cart, 2: Shipping, 3: Payment

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
    // Pre-fill if we have user info
    if (userInfo && !shippingAddress.fullName) {
      setShippingAddress(prev => ({ ...prev, fullName: userInfo.name }));
    }
  }, [cartItems, navigate, userInfo]);

  const total = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  const handlePayment = async (e) => {
    e.preventDefault();
    setStep(3);
    setIsProcessing(true);
    
    try {
      const { data: orderData } = await axios.post('/api/orders', {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod: 'MercadoPago',
        itemsPrice: total,
        shippingPrice: 0,
        totalPrice: total,
      });

      const { data: preferenceData } = await axios.post('/api/payments/create_preference', {
        items: cartItems,
        orderId: orderData._id
      });

      window.location.href = preferenceData.init_point;
    } catch (error) {
      console.error('Payment error:', error);
      alert('Hubo un error al conectar con MercadoPago. Por favor intenta nuevamente.');
      setIsProcessing(false);
      setStep(2);
    }
  };

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  if (cartItems.length === 0) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 mb-20 md:mb-0">
      
      {/* Stepper */}
      <div className="mb-12">
        <div className="flex items-center justify-center max-w-2xl mx-auto">
          <div className="flex items-center text-green-400">
            <div className="w-10 h-10 rounded-full bg-green-400/20 flex items-center justify-center border border-green-400">
              <CheckCircle2 size={20} />
            </div>
            <span className="hidden sm:block ml-3 font-medium">Carrito</span>
          </div>
          
          <div className="flex-1 h-px bg-white/20 mx-4"></div>
          
          <div className={`flex items-center ${step >= 2 ? 'text-primary' : 'text-gray-500'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${step >= 2 ? 'bg-primary/20 border-primary' : 'bg-darker border-gray-600'}`}>
              <Truck size={20} />
            </div>
            <span className="hidden sm:block ml-3 font-medium">Envío</span>
          </div>
          
          <div className="flex-1 h-px bg-white/20 mx-4"></div>
          
          <div className={`flex items-center ${step >= 3 ? 'text-accent' : 'text-gray-500'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${step >= 3 ? 'bg-accent/20 border-accent' : 'bg-darker border-gray-600'}`}>
              <CreditCard size={20} />
            </div>
            <span className="hidden sm:block ml-3 font-medium">Pago Seguro</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        {/* Left Col: Form */}
        <div className="lg:col-span-3">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-6 sm:p-8 rounded-3xl"
          >
            <h2 className="text-2xl font-bold mb-6">¿A dónde enviamos tu pedido?</h2>
            
            <form id="checkout-form" onSubmit={handlePayment} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Nombre de quien recibe</label>
                <input 
                  type="text" name="fullName" required
                  value={shippingAddress.fullName} onChange={handleChange}
                  className="input-field py-3 text-lg" placeholder="Ej. Juan Pérez"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Dirección completa</label>
                <input 
                  type="text" name="address" required
                  value={shippingAddress.address} onChange={handleChange}
                  className="input-field py-3 text-lg" placeholder="Calle Falsa 123, Depto 4"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Ciudad</label>
                  <input 
                    type="text" name="city" required
                    value={shippingAddress.city} onChange={handleChange}
                    className="input-field py-3 text-lg" placeholder="Ciudad"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Código Postal</label>
                  <input 
                    type="number" name="postalCode" required inputMode="numeric"
                    value={shippingAddress.postalCode} onChange={handleChange}
                    className="input-field py-3 text-lg" placeholder="12345"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Teléfono (WhatsApp)</label>
                <input 
                  type="tel" name="phone" required inputMode="tel"
                  value={shippingAddress.phone} onChange={handleChange}
                  className="input-field py-3 text-lg" placeholder="55 1234 5678"
                />
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <ShieldCheck size={14} className="text-green-400" />
                  Solo te contactaremos por actualizaciones de tu pedido.
                </p>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Right Col: Order Summary */}
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-6 sm:p-8 rounded-3xl sticky top-24"
          >
            <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Resumen del Pedido</h2>
            
            <div className="space-y-4 max-h-64 overflow-y-auto mb-6 pr-2 custom-scrollbar">
              {cartItems.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-dark shrink-0 border border-white/5">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-gray-400 mt-1">Cant: {item.qty}</p>
                  </div>
                  <div className="font-bold text-right text-sm">
                    ${(item.qty * item.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-white/10 pt-4 space-y-3 mb-6">
              <div className="flex justify-between text-gray-300 text-sm">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300 text-sm">
                <span>Envío estándar</span>
                <span className="text-green-400 font-medium">Gratis</span>
              </div>
            </div>
            
            <div className="flex justify-between items-end text-2xl font-bold border-t border-white/10 pt-4 mb-8">
              <span>Total</span>
              <span className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                ${total.toFixed(2)}
              </span>
            </div>

            {/* Desktop Submit */}
            <button 
              form="checkout-form"
              type="submit" 
              disabled={isProcessing}
              className={`hidden md:flex w-full py-4 text-xl font-bold rounded-xl shadow-lg transition-all justify-center items-center gap-2 ${
                isProcessing ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'btn-primary shadow-primary/30'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Procesando...
                </>
              ) : (
                <>Continuar al Pago <ChevronRight size={20} /></>
              )}
            </button>
            
            <div className="mt-6 flex flex-col items-center gap-3">
              <p className="text-xs text-gray-500 text-center">Pago seguro procesado a través de MercadoPago</p>
              <img src="https://logospng.org/download/mercado-pago/logo-mercado-pago-icone-1024.png" alt="Mercado Pago" className="h-6 opacity-50 grayscale" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-darker/90 backdrop-blur-md border-t border-white/10 md:hidden z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <button 
          form="checkout-form"
          type="submit" 
          disabled={isProcessing}
          className={`w-full py-4 text-lg font-bold flex justify-center items-center gap-2 rounded-xl transition-all ${
            isProcessing ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'btn-primary shadow-primary/30'
          }`}
        >
          {isProcessing ? 'Procesando...' : `Pagar $${total.toFixed(2)}`}
          {!isProcessing && <ChevronRight size={20} />}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
