import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCartStore();
  const { userInfo } = useAuthStore();
  
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });
  
  const [isProcessing, setIsProcessing] = useState(false);

  const total = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  const handlePayment = async (e) => {
    e.preventDefault();

    setIsProcessing(true);
    
    try {
      // 1. Create Order in Database
      const { data: orderData } = await axios.post('/api/orders', {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod: 'MercadoPago',
        itemsPrice: total,
        shippingPrice: 0,
        totalPrice: total,
      });

      // 2. Create MercadoPago Preference
      const { data: preferenceData } = await axios.post('/api/payments/create_preference', {
        items: cartItems,
        orderId: orderData._id
      });

      // 3. Redirect to MercadoPago checkout URL
      window.location.href = preferenceData.init_point;
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('Hubo un error al procesar el pago. Por favor intenta nuevamente.');
      setIsProcessing(false);
    }
  };

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Col: Form */}
        <div>
          <h1 className="text-3xl font-extrabold mb-8">Datos de Envío</h1>
          
          <form onSubmit={handlePayment} className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nombre Completo</label>
                <input 
                  type="text" name="fullName" required
                  value={shippingAddress.fullName} onChange={handleChange}
                  className="input-field" placeholder="Juan Pérez"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Dirección de Envío</label>
                <input 
                  type="text" name="address" required
                  value={shippingAddress.address} onChange={handleChange}
                  className="input-field" placeholder="Calle Falsa 123, Depto 4"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Ciudad</label>
                  <input 
                    type="text" name="city" required
                    value={shippingAddress.city} onChange={handleChange}
                    className="input-field" placeholder="Ciudad de México"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Código Postal</label>
                  <input 
                    type="text" name="postalCode" required
                    value={shippingAddress.postalCode} onChange={handleChange}
                    className="input-field" placeholder="01234"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Teléfono (WhatsApp)</label>
                <input 
                  type="tel" name="phone" required
                  value={shippingAddress.phone} onChange={handleChange}
                  className="input-field" placeholder="+52 55 1234 5678"
                />
                <p className="text-xs text-gray-400 mt-2">Te enviaremos actualizaciones de tu pedido de impresión 3D a este número.</p>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isProcessing}
              className={`w-full py-4 text-xl font-bold rounded-lg shadow-lg transition-colors ${
                isProcessing ? 'bg-gray-600 text-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
              }`}
            >
              {isProcessing ? 'Conectando con MercadoPago...' : `Pagar $${total.toFixed(2)} con MercadoPago`}
            </button>
          </form>
        </div>

        {/* Right Col: Order Summary */}
        <div>
          <div className="glass-panel p-6 rounded-2xl sticky top-24">
            <h2 className="text-2xl font-bold mb-6 border-b border-white/10 pb-4">Resumen del Pedido</h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto mb-6 pr-2">
              {cartItems.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-dark shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-gray-400 mt-1">Cant: {item.qty} x ${item.price}</p>
                    {item.personalizationText && <p className="text-xs text-primary mt-1">Texto: {item.personalizationText}</p>}
                  </div>
                  <div className="font-bold text-right">
                    ${(item.qty * item.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-white/10 pt-4 space-y-2 mb-4">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Envío</span>
                <span className="text-green-400">Gratis</span>
              </div>
            </div>
            
            <div className="flex justify-between text-2xl font-bold border-t border-white/10 pt-4">
              <span>Total</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                ${total.toFixed(2)}
              </span>
            </div>
            
            <div className="mt-8 flex justify-center">
              <img src="https://logospng.org/download/mercado-pago/logo-mercado-pago-icone-1024.png" alt="Mercado Pago" className="h-8 opacity-70 grayscale hover:grayscale-0 transition-all" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
