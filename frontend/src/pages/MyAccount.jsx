import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { Package, User, LogOut } from 'lucide-react';

const MyAccount = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const { data } = await axios.get('/api/orders/mine');
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [userInfo, navigate]);

  const handleLogout = async () => {
    try {
      await axios.post('/api/users/logout');
      logout();
      navigate('/');
    } catch (error) {
      logout();
      navigate('/');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8">
      {/* Sidebar Profile */}
      <div className="w-full md:w-64 flex flex-col gap-4">
        <div className="glass-panel p-6 rounded-2xl text-center">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/50">
            <User size={32} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold">{userInfo?.name}</h2>
          <p className="text-sm text-neutral-500 mb-6">{userInfo?.email}</p>
          
          <button 
            onClick={handleLogout}
            className="w-full btn-outline flex justify-center items-center gap-2 text-red-400 hover:text-red-300 hover:border-red-500/50"
          >
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main Content: Orders */}
      <div className="flex-1 glass-panel rounded-2xl p-6 md:p-8 min-h-[500px]">
        <div className="flex items-center gap-3 mb-8">
          <Package className="text-primary" size={28} />
          <h2 className="text-2xl font-bold">Mis Compras</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-500 mb-4">Aún no has realizado ninguna compra con esta cuenta.</p>
            <button onClick={() => navigate('/shop')} className="btn-primary">Explorar Tienda</button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="border border-neutral-200 rounded-xl p-6 hover:bg-white/5 transition-colors">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4 border-b border-neutral-100 pb-4">
                  <div>
                    <p className="text-sm text-neutral-500">Pedido #{order._id.substring(0, 8)}</p>
                    <p className="text-sm font-bold mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-sm text-neutral-500">Total</p>
                    <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                      ${order.totalPrice}
                    </p>
                  </div>
                  <div>
                    <span className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center ${
                      order.orderStatus === 'Pendiente' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      order.orderStatus === 'En Producción' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded bg-surface-card overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">{item.name}</p>
                        <p className="text-xs text-neutral-500">Cant: {item.qty}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAccount;
