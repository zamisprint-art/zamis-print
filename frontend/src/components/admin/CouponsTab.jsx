import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Tag, Check, X } from 'lucide-react';

const CouponsTab = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [currentCoupon, setCurrentCoupon] = useState({
    code: '',
    discountType: 'percent',
    discountValue: 0,
    expiryDate: '',
    isActive: true,
    usageLimit: '',
    usageLimitPerUser: 1
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/coupons', { withCredentials: true });
      setCoupons(data);
    } catch (err) {
      setError('Error al cargar cupones');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setCurrentCoupon({
      code: '', discountType: 'percent', discountValue: 0, expiryDate: '', isActive: true, usageLimit: '', usageLimitPerUser: 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (coupon) => {
    setIsEditing(true);
    setCurrentCoupon({
      ...coupon,
      expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : '',
      usageLimit: coupon.usageLimit || '',
      usageLimitPerUser: coupon.usageLimitPerUser || 1
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este cupón?')) {
      try {
        await axios.delete(`/api/coupons/${id}`, { withCredentials: true });
        fetchCoupons();
      } catch (err) {
        alert('Error al eliminar cupón');
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...currentCoupon,
        usageLimit: currentCoupon.usageLimit ? parseInt(currentCoupon.usageLimit) : null,
        usageLimitPerUser: currentCoupon.usageLimitPerUser ? parseInt(currentCoupon.usageLimitPerUser) : 1
      };
      
      if (isEditing) {
        await axios.put(`/api/coupons/${currentCoupon._id}`, payload, { withCredentials: true });
      } else {
        await axios.post('/api/coupons', payload, { withCredentials: true });
      }
      setIsModalOpen(false);
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al guardar el cupón');
    }
  };

  const toggleStatus = async (coupon) => {
    try {
      await axios.put(`/api/coupons/${coupon._id}`, { isActive: !coupon.isActive }, { withCredentials: true });
      fetchCoupons();
    } catch (err) {
      alert('Error al cambiar el estado');
    }
  };

  if (loading) return <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Cupones de Descuento</h2>
          <p className="text-sm text-neutral-500">Administra los códigos promocionales y fidelización</p>
        </div>
        <button onClick={handleOpenCreateModal} className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus className="w-5 h-5" /> Nuevo Cupón
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase text-xs font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Código</th>
                <th className="px-6 py-4">Descuento</th>
                <th className="px-6 py-4">Usos</th>
                <th className="px-6 py-4">Límites</th>
                <th className="px-6 py-4">Vencimiento</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {coupons.map((coupon) => (
                <tr key={coupon._id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-brand-600 text-lg flex items-center gap-2">
                    <Tag className="w-4 h-4 text-brand-400" />
                    {coupon.code}
                  </td>
                  <td className="px-6 py-4 font-medium text-neutral-900">
                    {coupon.discountType === 'percent' ? `${coupon.discountValue}%` : `$${coupon.discountValue.toLocaleString()}`}
                  </td>
                  <td className="px-6 py-4 text-neutral-600">
                    <span className="font-semibold text-neutral-900">{coupon.usedCount}</span> veces
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-neutral-500 flex flex-col gap-1">
                      <span>Global: {coupon.usageLimit ? `${coupon.usedCount}/${coupon.usageLimit}` : 'Ilimitado'}</span>
                      <span>Por persona: {coupon.usageLimitPerUser || '1'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-600">
                    {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString('es-CO') : 'Nunca'}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(coupon)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${coupon.isActive ? 'bg-brand-500' : 'bg-neutral-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${coupon.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenEditModal(coupon)} className="p-2 text-neutral-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-colors" title="Editar">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(coupon._id)} className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-neutral-500">
                    No has creado ningún cupón de descuento todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Creación/Edición */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg my-8">
            <div className="flex justify-between items-center p-6 border-b border-neutral-100">
              <h3 className="text-xl font-bold text-neutral-900">{isEditing ? 'Editar Cupón' : 'Nuevo Cupón'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1">Código del Cupón *</label>
                <input
                  type="text"
                  required
                  value={currentCoupon.code}
                  onChange={(e) => setCurrentCoupon({ ...currentCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-mono text-lg uppercase"
                  placeholder="Ej: NAVIDAD20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1">Tipo de Descuento</label>
                  <select
                    value={currentCoupon.discountType}
                    onChange={(e) => setCurrentCoupon({ ...currentCoupon, discountType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
                  >
                    <option value="percent">Porcentaje (%)</option>
                    <option value="fixed">Monto Fijo ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1">Valor *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={currentCoupon.discountValue}
                    onChange={(e) => setCurrentCoupon({ ...currentCoupon, discountValue: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1">Fecha de Expiración (Opcional)</label>
                <input
                  type="date"
                  value={currentCoupon.expiryDate}
                  onChange={(e) => setCurrentCoupon({ ...currentCoupon, expiryDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1">Límite Global de Usos</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Ej: 50"
                    value={currentCoupon.usageLimit}
                    onChange={(e) => setCurrentCoupon({ ...currentCoupon, usageLimit: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Dejar vacío para usos ilimitados en la tienda</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1">Límite por Persona *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={currentCoupon.usageLimitPerUser}
                    onChange={(e) => setCurrentCoupon({ ...currentCoupon, usageLimitPerUser: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Generalmente es 1 por persona.</p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-neutral-600 font-medium hover:bg-neutral-100 rounded-lg transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-6 py-2.5 bg-brand-600 text-white font-medium hover:bg-brand-700 rounded-lg transition-colors flex items-center gap-2">
                  <Check className="w-5 h-5" /> Guardar Cupón
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsTab;
