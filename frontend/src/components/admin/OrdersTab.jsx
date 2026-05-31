import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, MapPin, FileText, Phone, Mail, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const formatCOP = (v) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);

const STATUS_COLORS = {
  'Intento':       'bg-neutral-100 text-neutral-500 border border-neutral-200',
  'Pendiente':     'bg-yellow-100 text-yellow-700',
  'Pagado':        'bg-blue-100 text-blue-700',
  'En Producción': 'bg-purple-100 text-purple-700',
  'Enviado':       'bg-green-100 text-green-700',
  'Entregado':     'bg-teal-100 text-teal-700',
  'Pago Fallido':  'bg-red-100 text-red-700',
};

const InfoRow = ({ label, value, icon }) => (
  value ? (
    <div className="flex items-start gap-2 text-sm">
      <span className="text-neutral-400 mt-0.5 shrink-0">{icon}</span>
      <span className="text-neutral-500 shrink-0 w-36">{label}</span>
      <span className="text-neutral-900 font-medium">{value}</span>
    </div>
  ) : null
);

const OrdersTab = () => {
  const [data, setData] = useState({ orders: [], page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [orderStatus, setOrderStatus] = useState('all');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data: resData } = await axios.get(`/api/orders?page=${page}&limit=20&search=${encodeURIComponent(search)}&orderStatus=${orderStatus}`);
      setData(resData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [page, orderStatus]);

  const handleSearchSubmit = (e) => { e.preventDefault(); setPage(1); fetchOrders(); };

  const handleOrderStatusChange = async (id, status) => {
    try {
      await axios.put(`/api/orders/${id}/status`, { status });
      fetchOrders();
    } catch (error) {
      toast.error('Error cambiando estado');
    }
  };

  const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id);

  return (
    <div>
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Gestión de Órdenes ({data.total})</h2>
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Buscar por ID, nombre, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-neutral-400" />
          </div>
          <select
            value={orderStatus}
            onChange={(e) => { setOrderStatus(e.target.value); setPage(1); }}
            className="px-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white"
          >
            <option value="all">Todos los estados</option>
            <option value="Intento">Intento de Pago</option>
            <option value="Pendiente">Pendiente (Aprobado/Manual)</option>
            <option value="Pagado">Pagado</option>
            <option value="En Producción">En Producción</option>
            <option value="Enviado">Enviado</option>
            <option value="Entregado">Entregado</option>
          </select>
          <button type="submit" className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl font-bold transition-colors">
            Buscar
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 text-neutral-500">Cargando órdenes...</div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_1fr_2fr_1fr_1.5fr_1.5fr_36px] text-xs font-bold text-neutral-500 uppercase tracking-wide bg-neutral-50 border-b border-neutral-200 px-4 py-3 gap-3">
              <span>ID Pedido</span>
              <span>Fecha</span>
              <span>Cliente</span>
              <span>Total</span>
              <span>Estado</span>
              <span>Cambiar Estado</span>
              <span></span>
            </div>

            {data.orders.length === 0 && (
              <div className="text-center py-12 text-neutral-500">No se encontraron órdenes con esos filtros.</div>
            )}

            {data.orders.map((order) => {
              const sa = order.shippingAddress || {};
              const isExpanded = expandedId === order._id;
              return (
                <div key={order._id} className="border-b border-neutral-100 last:border-0">
                  {/* Main Row */}
                  <div className="grid grid-cols-[1fr_1fr_2fr_1fr_1.5fr_1.5fr_36px] items-center px-4 py-3 gap-3 hover:bg-neutral-50 transition-colors">
                    <span className="font-mono text-sm text-neutral-700">#{String(order._id).slice(-8).toUpperCase()}</span>
                    <span className="text-sm text-neutral-600">{new Date(order.createdAt).toLocaleDateString('es-CO')}</span>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-neutral-900 truncate">{order.user?.name || sa.fullName || 'Invitado'}</div>
                      <div className="text-xs text-neutral-400 truncate">{sa.email || order.user?.email || '—'}</div>
                      {sa.documentType && (
                        <div className="text-xs text-brand-500 font-medium">{sa.documentType} · {sa.documentNumber}</div>
                      )}
                    </div>
                    <span className="font-bold text-sm">{formatCOP(order.totalPrice)}</span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold w-fit ${STATUS_COLORS[order.orderStatus] || 'bg-gray-100 text-gray-700'}`}>
                      {order.orderStatus}
                    </span>
                    <select
                      className="bg-white border border-neutral-300 rounded-lg p-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
                      value={order.orderStatus}
                      onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                    >
                      <option value="Intento">Intento</option>
                      <option value="Pendiente">Pendiente</option>
                      <option value="Pagado">Pagado</option>
                      <option value="En Producción">En Producción</option>
                      <option value="Enviado">Enviado</option>
                      <option value="Entregado">Entregado</option>
                    </select>
                    <button
                      onClick={() => toggleExpand(order._id)}
                      className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-brand-600 transition-colors"
                      title={isExpanded ? 'Ocultar detalle' : 'Ver detalle completo'}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div className="bg-neutral-50 border-t border-dashed border-neutral-200 px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Datos del Receptor */}
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                          <FileText size={12} /> Datos del Receptor
                        </h4>
                        <InfoRow icon={<FileText size={14}/>} label="Nombre" value={sa.fullName || order.user?.name} />
                        <InfoRow icon={<Mail size={14}/>} label="Correo" value={sa.email || order.user?.email} />
                        <InfoRow icon={<Phone size={14}/>} label="Teléfono" value={sa.phone} />
                        <InfoRow icon={<FileText size={14}/>} label="Tipo Documento" value={sa.documentType} />
                        <InfoRow icon={<FileText size={14}/>} label="Nº Documento" value={sa.documentNumber} />
                      </div>

                      {/* Dirección de Envío */}
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                          <MapPin size={12} /> Dirección de Envío
                        </h4>
                        <InfoRow icon={<MapPin size={14}/>} label="Dirección" value={sa.address} />
                        <InfoRow icon={<MapPin size={14}/>} label="Departamento" value={sa.department} />
                        <InfoRow icon={<MapPin size={14}/>} label="Ciudad" value={sa.city} />
                        <InfoRow icon={<MapPin size={14}/>} label="Código Postal" value={sa.postalCode} />
                      </div>

                      {/* Productos */}
                      <div className="md:col-span-2">
                        <h4 className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                          <Package size={12} /> Productos ({order.orderItems?.length})
                        </h4>
                        <div className="flex flex-col gap-2">
                          {order.orderItems?.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-white rounded-xl border border-neutral-200 px-4 py-2.5">
                              <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-neutral-100 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-neutral-900 truncate">{item.name}</p>
                                {item.personalizationText && (
                                  <p className="text-xs text-brand-500 mt-0.5 truncate">✏️ {item.personalizationText}</p>
                                )}
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-xs text-neutral-500">x{item.qty}</p>
                                <p className="text-sm font-bold text-neutral-900">{formatCOP(item.price * item.qty)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {data.pages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <span className="text-sm text-neutral-500">Página {data.page} de {data.pages} ({data.total} registros)</span>
              <div className="flex gap-2">
                <button disabled={data.page === 1} onClick={() => setPage(p => p - 1)}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg border border-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors">
                  <ChevronLeft size={16} /> Anterior
                </button>
                <button disabled={data.page === data.pages} onClick={() => setPage(p => p + 1)}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg border border-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors">
                  Siguiente <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrdersTab;
