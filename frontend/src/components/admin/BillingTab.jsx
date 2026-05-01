import { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, CheckCircle, Clock, AlertTriangle, FileText } from 'lucide-react';

const BillingTab = ({ orders, refreshData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({
    estadoCobro: 'pendiente',
    metodoPagoCobro: 'mercadopago',
    notaCobroInterna: ''
  });

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
      refreshData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al actualizar el cobro');
    }
  };

  const totalPendiente = orders.filter(o => o.estadoCobro !== 'pagado').reduce((acc, o) => acc + o.totalPrice, 0);
  const totalCobrado = orders.filter(o => o.estadoCobro === 'pagado').reduce((acc, o) => acc + o.totalPrice, 0);

  const exportToCSV = () => {
    const headers = ['ID Pedido', 'Cliente', 'Telefono', 'Fecha', 'Total', 'Estado Cobro', 'Metodo Pago', 'Nota Interna'];
    const csvRows = [
      headers.join(','),
      ...orders.map(o => {
        return [
          o._id,
          `"${o.user?.name || o.shippingAddress?.fullName || 'Invitado'}"`,
          `"${o.shippingAddress?.phone || ''}"`,
          new Date(o.createdAt).toLocaleDateString(),
          o.totalPrice,
          o.estadoCobro || 'pendiente',
          o.metodoPagoCobro || o.paymentMethod || '',
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
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <DollarSign size={28} className="text-brand-600" /> Cobros y Finanzas
        </h2>
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
          <span className="font-bold text-brand-800">Exportar Reporte</span>
        </div>
      </div>

      {/* Tabla de Cobros */}
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
            {orders.map(order => {
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
          </tbody>
        </table>
      </div>

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
                <button type="submit" className="btn-primary px-6 py-2">Guardar Cobro</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingTab;
