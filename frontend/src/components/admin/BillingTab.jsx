import { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, CheckCircle, Clock, AlertTriangle, FileText, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const BillingTab = () => {
  const [data, setData] = useState({ orders: [], page: 1, pages: 1, total: 0, stats: { totalCobrado: 0, totalPendiente: 0 } });
  const [loading, setLoading] = useState(true);
  
  // Filters state
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [estadoCobro, setEstadoCobro] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExternalSaleModalOpen, setIsExternalSaleModalOpen] = useState(false);
  const [isSubmittingExternal, setIsSubmittingExternal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data: resData } = await axios.get(`/api/orders?page=${page}&limit=20&search=${search}&estadoCobro=${estadoCobro}`);
      setData(resData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, estadoCobro]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  const [formData, setFormData] = useState({
    estadoCobro: 'pendiente',
    metodoPagoCobro: 'mercadopago',
    notaCobroInterna: ''
  });
  const [externalFormData, setExternalFormData] = useState({
    description: '',
    canalVenta: 'WhatsApp',
    totalPrice: '',
    metodoPagoCobro: 'transferencia',
    notaCobroInterna: ''
  });

  const handleExternalSaleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingExternal(true);
    try {
      await axios.post('/api/orders/external', {
        ...externalFormData,
        totalPrice: Number(externalFormData.totalPrice),
        fechaCobro: new Date()
      }, { withCredentials: true });
      setIsExternalSaleModalOpen(false);
      setExternalFormData({
        description: '',
        canalVenta: 'WhatsApp',
        totalPrice: '',
        metodoPagoCobro: 'transferencia',
        notaCobroInterna: ''
      });
      refreshData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al registrar la venta externa');
    } finally {
      setIsSubmittingExternal(false);
    }
  };

  const openBillingModal = (order) => {
    setSelectedOrder(order);
    setFormData({
      estadoCobro: order.estadoCobro || 'pendiente',
      metodoPagoCobro: order.metodoPagoCobro || order.paymentMethod || 'mercadopago',
      notaCobroInterna: order.notaCobroInterna || ''
    });
    setIsModalOpen(true);
  };

  const handleBillingSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/orders/${selectedOrder._id}/billing`, {
        ...formData,
        fechaCobro: formData.estadoCobro === 'pagado' ? new Date() : null
      }, { withCredentials: true });
      setIsModalOpen(false);
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al actualizar el cobro');
    }
  };

  const totalPendiente = data.stats.totalPendiente;
  const totalCobrado = data.stats.totalCobrado;

  const exportToCSV = async () => {
    // Para exportar todo, llamamos al backend sin límite de página
    try {
      const { data: allData } = await axios.get(`/api/orders?limit=10000`);
      const headers = ['ID Pedido', 'Cliente', 'Telefono', 'Fecha', 'Total', 'Estado Cobro', 'Metodo Pago', 'Canal Venta', 'Nota Interna'];
      const csvRows = [
        headers.join(','),
        ...allData.orders.map(o => {
          return [
            o._id,
            `"${o.user?.name || o.shippingAddress?.fullName || 'Invitado'}"`,
            `"${o.shippingAddress?.phone || ''}"`,
            new Date(o.createdAt).toLocaleDateString(),
            o.totalPrice,
            o.estadoCobro || 'pendiente',
            o.metodoPagoCobro || o.paymentMethod || '',
            o.canalVenta || 'Web',
            `"${(o.notaCobroInterna || '').replace(/"/g, '""')}"`
          ].join(',');
        })
      ].join('\n');

      const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `reporte_cobros_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      alert("Error exportando reporte");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <DollarSign size={28} className="text-brand-600" /> Cobros y Finanzas
        </h2>
        <button 
          onClick={() => setIsExternalSaleModalOpen(true)}
          className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl font-bold transition-colors shadow-sm"
        >
          + Registrar Venta Externa
        </button>
      </div>

      {/* Resumen Financiero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex flex-col gap-2">
          <span className="text-neutral-500 font-semibold text-sm uppercase tracking-wider">Total Cobrado</span>
          <span className="text-3xl font-black text-green-600">${totalCobrado.toLocaleString('es-CO')}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex flex-col gap-2">
          <span className="text-neutral-500 font-semibold text-sm uppercase tracking-wider">Por Cobrar</span>
          <span className="text-3xl font-black text-yellow-600">${totalPendiente.toLocaleString('es-CO')}</span>
        </div>
        <div 
          onClick={exportToCSV}
          className="bg-brand-50 p-5 rounded-2xl border border-brand-200 flex flex-col justify-center items-center cursor-pointer hover:bg-brand-100 transition-colors"
        >
          <FileText size={28} className="text-brand-600 mb-2" />
          <span className="font-bold text-brand-800">Exportar Reporte (Todo)</span>
        </div>
      </div>

      {/* Filters and Search */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
        <div className="relative w-full sm:w-64">
          <input 
            type="text" 
            placeholder="Buscar por ID, nombre, teléfono..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
          <Search size={18} className="absolute left-3 top-2.5 text-neutral-400" />
        </div>
        <select 
          value={estadoCobro} 
          onChange={(e) => { setEstadoCobro(e.target.value); setPage(1); }}
          className="px-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white"
        >
          <option value="all">Todos los cobros</option>
          <option value="pendiente">Pendiente</option>
          <option value="pagado">Pagado</option>
          <option value="vencido">Vencido</option>
        </select>
        <button type="submit" className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl font-bold transition-colors">
          Buscar
        </button>
      </form>

      {/* Tabla de Cobros */}
      {loading ? (
        <div className="flex justify-center items-center h-64 text-neutral-500">Cargando cobros...</div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-xl border border-neutral-200">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-600 bg-neutral-50/50">
                  <th className="py-4 px-4">Pedido / Cliente</th>
                  <th className="py-4 px-4">Fecha</th>
                  <th className="py-4 px-4">Total</th>
                  <th className="py-4 px-4">Estado Cobro</th>
                  <th className="py-4 px-4">Nota / Método</th>
                  <th className="py-4 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody>
                {data.orders.map(order => {
                  const estado = order.estadoCobro || 'pendiente';
                  return (
                    <tr key={order._id} className="border-b border-neutral-100 hover:bg-neutral-50">
                      <td className="py-4 px-4">
                        <div className="font-bold font-mono text-sm">#{String(order._id).slice(-8).toUpperCase()}</div>
                        <div className="text-sm text-neutral-600">{order.user?.name || order.shippingAddress?.fullName}</div>
                      </td>
                      <td className="py-4 px-4 text-sm text-neutral-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 font-bold text-lg">
                        ${order.totalPrice.toLocaleString('es-CO')}
                      </td>
                      <td className="py-4 px-4">
                        {estado === 'pagado' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 font-bold text-xs rounded-full">
                            <CheckCircle size={14} /> PAGADO
                          </span>
                        ) : estado === 'vencido' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 font-bold text-xs rounded-full">
                            <AlertTriangle size={14} /> VENCIDO
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 font-bold text-xs rounded-full">
                            <Clock size={14} /> PENDIENTE
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-sm text-neutral-500 max-w-xs truncate">
                        {order.metodoPagoCobro && <div className="font-semibold capitalize">{order.metodoPagoCobro}</div>}
                        {order.notaCobroInterna && <div className="text-xs truncate" title={order.notaCobroInterna}>{order.notaCobroInterna}</div>}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button 
                          onClick={() => openBillingModal(order)}
                          className="text-brand-600 hover:text-brand-800 font-bold text-sm bg-brand-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Gestionar Pago
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {data.orders.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-neutral-500">No se encontraron cobros con esos filtros.</td>
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

      {/* Modal Gestionar Pago */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-1">Gestionar Cobro</h3>
            <p className="text-sm text-neutral-500 mb-4 font-mono">Pedido #{String(selectedOrder?._id).slice(-8).toUpperCase()}</p>
            
            <form onSubmit={handleBillingSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Estado de Cobro</label>
                <select 
                  value={formData.estadoCobro} 
                  onChange={e => setFormData({...formData, estadoCobro: e.target.value})} 
                  className="w-full border rounded-lg p-2 font-bold"
                >
                  <option value="pendiente">🟡 Pendiente</option>
                  <option value="pagado">✅ Pagado</option>
                  <option value="vencido">🔴 Vencido (Mora)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-1">Método de Pago Real</label>
                <select 
                  value={formData.metodoPagoCobro} 
                  onChange={e => setFormData({...formData, metodoPagoCobro: e.target.value})} 
                  className="w-full border rounded-lg p-2"
                >
                  <option value="mercadopago">MercadoPago (Pasarela)</option>
                  <option value="transferencia">Transferencia Bancaria (Nequi/Bancolombia)</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Nota Interna (Opcional)</label>
                <textarea 
                  placeholder="Ej. Pagó la mitad por Nequi y la mitad en efectivo. / Comprobante enviado por WhatsApp."
                  value={formData.notaCobroInterna} 
                  onChange={e => setFormData({...formData, notaCobroInterna: e.target.value})} 
                  className="w-full border rounded-lg p-2 text-sm min-h-[80px]"
                />
              </div>

              <div className="flex gap-3 justify-end mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg font-semibold">Cancelar</button>
                <button type="submit" className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 py-2 rounded-lg transition-colors shadow-md">Guardar Cobro</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Registrar Venta Externa */}
      {isExternalSaleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Registrar Venta Externa</h3>
            
            <form onSubmit={handleExternalSaleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Descripción del Pedido</label>
                <input 
                  type="text"
                  required
                  placeholder="Ej. Figura personalizada - WhatsApp"
                  value={externalFormData.description} 
                  onChange={e => setExternalFormData({...externalFormData, description: e.target.value})} 
                  className="w-full border border-neutral-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Canal de Venta</label>
                <select 
                  value={externalFormData.canalVenta} 
                  onChange={e => setExternalFormData({...externalFormData, canalVenta: e.target.value})} 
                  className="w-full border border-neutral-300 rounded-lg p-2"
                >
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Feria">Feria / Evento</option>
                  <option value="Local">Local Físico</option>
                  <option value="Otro">Otro Canal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Monto Total Cobrado (COP)</label>
                <input 
                  type="number"
                  required
                  min="0"
                  placeholder="Ej. 150000"
                  value={externalFormData.totalPrice} 
                  onChange={e => setExternalFormData({...externalFormData, totalPrice: e.target.value})} 
                  className="w-full border border-neutral-300 rounded-lg p-2 font-bold"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Método de Pago Recibido</label>
                <select 
                  value={externalFormData.metodoPagoCobro} 
                  onChange={e => setExternalFormData({...externalFormData, metodoPagoCobro: e.target.value})} 
                  className="w-full border border-neutral-300 rounded-lg p-2"
                >
                  <option value="transferencia">Transferencia Bancaria (Nequi/Bancolombia)</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="mercadopago">MercadoPago (Enlace Manual)</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Nota Interna (Opcional)</label>
                <textarea 
                  placeholder="Ej. Entregado en estación de TransMilenio / Comprobante enviado."
                  value={externalFormData.notaCobroInterna} 
                  onChange={e => setExternalFormData({...externalFormData, notaCobroInterna: e.target.value})} 
                  className="w-full border border-neutral-300 rounded-lg p-2 text-sm min-h-[60px]"
                />
              </div>

              <div className="flex gap-3 justify-end mt-4">
                <button type="button" onClick={() => setIsExternalSaleModalOpen(false)} className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg font-semibold">Cancelar</button>
                <button type="submit" disabled={isSubmittingExternal} className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-lg transition-colors shadow-md">
                  {isSubmittingExternal ? 'Guardando...' : 'Registrar Venta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingTab;
