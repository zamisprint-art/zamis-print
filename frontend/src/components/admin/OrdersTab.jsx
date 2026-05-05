import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

const OrdersTab = () => {
  const [data, setData] = useState({ orders: [], page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  
  // Filters state
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [orderStatus, setOrderStatus] = useState('all');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data: resData } = await axios.get(`/api/orders?page=${page}&limit=20&search=${search}&orderStatus=${orderStatus}`);
      setData(resData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, orderStatus]); // No lo ejecutamos en cada tecla de 'search' para evitar spam a la API

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  const handleOrderStatusChange = async (id, status) => {
    try {
      await axios.put(`/api/orders/${id}/status`, { status });
      fetchOrders();
    } catch (error) {
      alert('Error cambiando estado');
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Gestión de Órdenes ({data.total})</h2>
        
        {/* Filters and Search */}
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
            <option value="Pendiente">Pendiente</option>
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
          <div className="overflow-x-auto bg-white rounded-xl border border-neutral-200">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-600 bg-neutral-50/50">
                  <th className="py-4 px-4">ID Pedido</th>
                  <th className="py-4 px-4">Fecha</th>
                  <th className="py-4 px-4">Cliente</th>
                  <th className="py-4 px-4">Total</th>
                  <th className="py-4 px-4">Estado</th>
                  <th className="py-4 px-4">Acción</th>
                </tr>
              </thead>
              <tbody>
                {data.orders.map((order) => (
                  <tr key={order._id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                    <td className="py-4 px-4 font-mono text-sm">#{order._id.substring(0, 8).toUpperCase()}</td>
                    <td className="py-4 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-neutral-900">{order.user?.name || order.shippingAddress?.fullName || 'Invitado'}</div>
                      <div className="text-xs text-neutral-500">{order.shippingAddress?.phone || 'Sin teléfono'}</div>
                    </td>
                    <td className="py-4 px-4 font-bold">${order.totalPrice.toLocaleString('es-CO')}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.orderStatus === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' :
                        order.orderStatus === 'Pagado' ? 'bg-blue-100 text-blue-700' :
                        order.orderStatus === 'En Producción' ? 'bg-purple-100 text-purple-700' :
                        order.orderStatus === 'Enviado' ? 'bg-green-100 text-green-700' :
                        order.orderStatus === 'Entregado' ? 'bg-teal-100 text-teal-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <select 
                        className="bg-white border border-neutral-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
                        value={order.orderStatus}
                        onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="Pagado">Pagado</option>
                        <option value="En Producción">En Producción</option>
                        <option value="Enviado">Enviado</option>
                        <option value="Entregado">Entregado</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {data.orders.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-neutral-500">No se encontraron órdenes con esos filtros.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {data.pages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <span className="text-sm text-neutral-500">
                Página {data.page} de {data.pages} ({data.total} registros)
              </span>
              <div className="flex gap-2">
                <button 
                  disabled={data.page === 1} 
                  onClick={() => setPage(p => p - 1)}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg border border-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
                >
                  <ChevronLeft size={16} /> Anterior
                </button>
                <button 
                  disabled={data.page === data.pages} 
                  onClick={() => setPage(p => p + 1)}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg border border-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
                >
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
