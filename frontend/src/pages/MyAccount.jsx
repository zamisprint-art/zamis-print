import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, User, LogOut, ShoppingBag, ChevronRight, CheckCircle2, Clock, Truck, XCircle, Search, Filter, ChevronLeft, ChevronDown } from 'lucide-react';

const formatCOP = (v) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);

const STATUS_STYLES = {
  'Pendiente':      { bg: 'bg-yellow-50',  text: 'text-yellow-700',  border: 'border-yellow-200', icon: <Clock size={14} /> },
  'Pagado':         { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',   icon: <CheckCircle2 size={14} /> },
  'En Producción':  { bg: 'bg-purple-50',  text: 'text-purple-700',  border: 'border-purple-200', icon: <Package size={14} /> },
  'Enviado':        { bg: 'bg-green-50',   text: 'text-green-700',   border: 'border-green-200',  icon: <Truck size={14} /> },
  'Pago Fallido':   { bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',    icon: <XCircle size={14} /> },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_STYLES[status] || STATUS_STYLES['Pendiente'];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${s.bg} ${s.text} ${s.border}`}>
      {s.icon} {status}
    </span>
  );
};

const MyAccount = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo, logout } = useAuthStore();
  const navigate = useNavigate();

  // Filters & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Derived State
  const filteredOrders = orders
    .filter(order => {
      if (filterStatus !== 'Todos' && order.orderStatus !== filterStatus) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchId = order._id.toLowerCase().includes(term);
        const matchProduct = order.orderItems.some(item => item.name.toLowerCase().includes(term));
        if (!matchId && !matchProduct) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOrder === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortOrder === 'price-desc') return b.totalPrice - a.totalPrice;
      if (sortOrder === 'price-asc') return a.totalPrice - b.totalPrice;
      return 0;
    });

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset to page 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, sortOrder]);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    const fetchMyOrders = async () => {
      try {
        const { data } = await axios.get('/api/orders/mine');
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, [userInfo, navigate]);

  const handleLogout = async () => {
    try { await axios.post('/api/users/logout'); } catch (_) {}
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-surface-base py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start">

        {/* ── Left Sidebar ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-72 shrink-0"
        >
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden sticky top-24">
            {/* Avatar Header */}
            <div className="bg-gradient-to-br from-brand-500 to-brand-600 px-6 py-8 text-center">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3 text-white">
                <User size={36} />
              </div>
              <h2 className="text-xl font-extrabold text-white">{userInfo?.name}</h2>
              <p className="text-brand-100 text-sm mt-1">{userInfo?.email}</p>
            </div>

            {/* Nav Items */}
            <div className="p-4 flex flex-col gap-1">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-50 text-brand-700 font-semibold text-sm">
                <Package size={18} /> Mis Pedidos
                <span className="ml-auto bg-brand-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {orders.length}
                </span>
              </div>
              <Link to="/shop" className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-600 hover:bg-neutral-50 hover:text-brand-600 font-medium text-sm transition-colors">
                <ShoppingBag size={18} /> Explorar Tienda
                <ChevronRight size={16} className="ml-auto" />
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium text-sm transition-colors w-full text-left mt-2"
              >
                <LogOut size={18} /> Cerrar Sesión
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Main Content ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 w-full"
        >
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-neutral-900">Mis Pedidos</h1>
              <p className="text-neutral-500 mt-1">Historial completo de tus compras en ZAMIS Print</p>
            </div>
            
            {/* Toolbar: Buscador y Filtros */}
            {!loading && orders.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <input 
                    type="text" 
                    placeholder="Buscar por ID o producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all"
                  />
                  <Search size={16} className="absolute left-3 top-2.5 text-neutral-400" />
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="flex-1 sm:flex-none px-3 py-2 bg-white border border-neutral-200 rounded-xl text-sm text-neutral-700 focus:outline-none focus:border-brand-500 cursor-pointer appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                  >
                    <option value="Todos">Todos los estados</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Pagado">Pagado</option>
                    <option value="En Producción">En Producción</option>
                    <option value="Enviado">Enviado</option>
                    <option value="Pago Fallido">Pago Fallido</option>
                  </select>

                  <select 
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="flex-1 sm:flex-none px-3 py-2 bg-white border border-neutral-200 rounded-xl text-sm text-neutral-700 focus:outline-none focus:border-brand-500 cursor-pointer appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                  >
                    <option value="newest">Más recientes</option>
                    <option value="oldest">Más antiguos</option>
                    <option value="price-desc">Mayor precio</option>
                    <option value="price-asc">Menor precio</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-16 text-center">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={36} className="text-neutral-400" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Aún no tienes pedidos</h3>
              <p className="text-neutral-500 mb-8">¡Explora nuestro catálogo y encuentra tu primera pieza 3D!</p>
              <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-colors">
                Ir a la Tienda <ChevronRight size={18} />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {paginatedOrders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-12 text-center text-neutral-500">
                  <Search size={32} className="mx-auto mb-4 text-neutral-300" />
                  <p>No se encontraron pedidos con estos filtros.</p>
                  <button onClick={() => { setSearchTerm(''); setFilterStatus('Todos'); }} className="mt-4 text-brand-600 font-semibold hover:underline">Limpiar filtros</button>
                </div>
              ) : paginatedOrders.map((order, i) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-neutral-100 bg-neutral-50">
                    <div>
                      <p className="text-xs text-neutral-500 font-mono">Pedido #{order._id.slice(-10).toUpperCase()}</p>
                      <p className="text-sm font-medium text-neutral-700 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <StatusBadge status={order.orderStatus} />
                      <span className="text-lg font-extrabold text-neutral-900">{formatCOP(order.totalPrice)}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="px-6 py-4 flex flex-col gap-3">
                    {order.orderItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-surface-base overflow-hidden border border-neutral-100 shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/56?text=3D'; }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-neutral-900 text-sm truncate">{item.name}</p>
                          <p className="text-xs text-neutral-500 mt-0.5">Cantidad: {item.qty} · {formatCOP(item.price)} c/u</p>
                        </div>
                        <p className="font-bold text-neutral-900 text-sm shrink-0">{formatCOP(item.price * item.qty)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-100 flex justify-between items-center text-xs text-neutral-500">
                    <span>Envío: {order.shippingAddress?.city || 'N/A'}</span>
                    <span>Método: {order.paymentMethod}</span>
                  </div>
                </motion.div>
              ))}
              
              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white border border-neutral-200 rounded-2xl px-6 py-4 mt-2 shadow-sm">
                  <p className="text-sm text-neutral-500">
                    Mostrando <span className="font-semibold text-neutral-900">{(currentPage - 1) * itemsPerPage + 1}</span> a <span className="font-semibold text-neutral-900">{Math.min(currentPage * itemsPerPage, filteredOrders.length)}</span> de <span className="font-semibold text-neutral-900">{filteredOrders.length}</span> pedidos
                  </p>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm font-semibold text-neutral-700 px-2">{currentPage} / {totalPages}</span>
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
};

export default MyAccount;
