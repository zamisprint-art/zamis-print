import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { Trash2 } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeItem, addItem } = useCartStore();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold mb-8">Tu Carrito de Compras</h1>
      
      {cartItems.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl">
          <p className="text-2xl text-gray-400 mb-6">Tu carrito está vacío</p>
          <Link to="/shop" className="btn-primary">Explorar Tienda</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.product} className="glass-panel p-4 flex flex-col sm:flex-row items-center gap-6 rounded-2xl">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
                
                <div className="flex-1 text-center sm:text-left">
                  <Link to={`/product/${item.product}`} className="text-xl font-bold hover:text-primary transition-colors">
                    {item.name}
                  </Link>
                  <div className="text-sm text-gray-400 mt-1">
                    {item.personalizationText && <p>Texto: {item.personalizationText}</p>}
                    {item.personalizationImage && <p>Foto: Incluida</p>}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <select 
                    value={item.qty} 
                    onChange={(e) => addItem({ ...item, qty: Number(e.target.value) })}
                    className="input-field w-20 bg-dark"
                  >
                    {[...Array(10).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                    ))}
                  </select>
                  
                  <div className="text-xl font-bold w-24 text-right">
                    ${item.price}
                  </div>
                  
                  <button 
                    onClick={() => removeItem(item.product)}
                    className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="lg:col-span-1">
            <div className="glass-panel p-6 rounded-2xl sticky top-24">
              <h2 className="text-2xl font-bold mb-6 border-b border-white/10 pb-4">Resumen</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                  <span>${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Envío</span>
                  <span>Calculado en checkout</span>
                </div>
              </div>
              
              <div className="flex justify-between text-xl font-bold border-t border-white/10 pt-4 mb-8">
                <span>Total Estimado</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                </span>
              </div>
              
              <button 
                onClick={handleCheckout}
                className="btn-primary w-full py-4 text-lg font-bold"
              >
                Proceder al Pago
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
