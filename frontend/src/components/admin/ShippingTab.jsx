import { useState, useEffect } from 'react';
import axios from 'axios';
import { Truck, Plus, Edit2, Trash2, Check, X, MapPin } from 'lucide-react';
import { COLOMBIA } from '../../data/colombia';

const ShippingTab = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [currentZone, setCurrentZone] = useState({
    name: '',
    baseCost: 0,
    freeShippingThreshold: '',
    estimatedDays: '3 a 5 días hábiles',
    isDefault: false,
    departments: [],
    cities: []
  });

  const [deptInput, setDeptInput] = useState('');
  const [cityInput, setCityInput] = useState('');

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/shipping-zones', { withCredentials: true });
      setZones(data);
    } catch (err) {
      setError('Error al cargar zonas de envío');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setCurrentZone({
      name: '', baseCost: 0, freeShippingThreshold: '', estimatedDays: '3 a 5 días hábiles', isDefault: false, departments: [], cities: []
    });
    setDeptInput('');
    setCityInput('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (zone) => {
    setIsEditing(true);
    setCurrentZone({
      ...zone,
      freeShippingThreshold: zone.freeShippingThreshold === null ? '' : zone.freeShippingThreshold
    });
    setDeptInput('');
    setCityInput('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta zona de envío?')) {
      try {
        await axios.delete(`/api/shipping-zones/${id}`, { withCredentials: true });
        fetchZones();
      } catch (err) {
        alert(err.response?.data?.message || 'Error al eliminar');
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...currentZone,
        freeShippingThreshold: currentZone.freeShippingThreshold === '' ? null : Number(currentZone.freeShippingThreshold)
      };
      
      if (isEditing) {
        await axios.put(`/api/shipping-zones/${currentZone._id}`, payload, { withCredentials: true });
      } else {
        await axios.post('/api/shipping-zones', payload, { withCredentials: true });
      }
      setIsModalOpen(false);
      fetchZones();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al guardar la zona');
    }
  };

  const addDepartment = () => {
    if (deptInput && !currentZone.departments.includes(deptInput)) {
      setCurrentZone({ ...currentZone, departments: [...currentZone.departments, deptInput] });
      setDeptInput('');
    }
  };

  const removeDepartment = (dept) => {
    setCurrentZone({ ...currentZone, departments: currentZone.departments.filter(d => d !== dept) });
  };

  const addCity = () => {
    if (cityInput && !currentZone.cities.includes(cityInput)) {
      setCurrentZone({ ...currentZone, cities: [...currentZone.cities, cityInput] });
      setCityInput('');
    }
  };

  const removeCity = (city) => {
    setCurrentZone({ ...currentZone, cities: currentZone.cities.filter(c => c !== city) });
  };

  if (loading) return <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Zonas de Envío</h2>
          <p className="text-sm text-neutral-500">Configura los costos y tiempos de entrega por región</p>
        </div>
        <button onClick={handleOpenCreateModal} className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus className="w-5 h-5" /> Nueva Zona
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase text-xs font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Zona</th>
                <th className="px-6 py-4">Tarifa Base</th>
                <th className="px-6 py-4">Envío Gratis (Compras &gt;)</th>
                <th className="px-6 py-4">Tiempo Estimado</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {zones.map((zone) => (
                <tr key={zone._id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-neutral-900 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-brand-500" />
                      {zone.name}
                    </div>
                    <div className="text-xs text-neutral-500 mt-1 line-clamp-1">
                      {zone.isDefault ? 'Aplica para el resto del país' : `${zone.departments.length} Deptos, ${zone.cities.length} Ciudades`}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-neutral-900">
                    ${zone.baseCost.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-green-600 font-semibold">
                    {zone.freeShippingThreshold !== null ? `$${zone.freeShippingThreshold.toLocaleString()}` : 'No aplica'}
                  </td>
                  <td className="px-6 py-4 text-neutral-600">
                    {zone.estimatedDays}
                  </td>
                  <td className="px-6 py-4">
                    {zone.isDefault ? (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">Por Defecto</span>
                    ) : (
                      <span className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded text-xs font-medium">Específica</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenEditModal(zone)} className="p-2 text-neutral-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-colors" title="Editar">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(zone._id)} className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar" disabled={zone.isDefault}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-neutral-100">
              <h3 className="text-xl font-bold text-neutral-900">{isEditing ? 'Editar Zona de Envío' : 'Nueva Zona de Envío'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-semibold text-neutral-700 mb-1">Nombre de la Zona *</label>
                  <input
                    type="text"
                    required
                    value={currentZone.name}
                    onChange={(e) => setCurrentZone({ ...currentZone, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    placeholder="Ej: Eje Cafetero"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-semibold text-neutral-700 mb-1">Tiempo Estimado *</label>
                  <input
                    type="text"
                    required
                    value={currentZone.estimatedDays}
                    onChange={(e) => setCurrentZone({ ...currentZone, estimatedDays: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    placeholder="Ej: 2 a 3 días hábiles"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-semibold text-neutral-700 mb-1">Costo Base ($) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={currentZone.baseCost}
                    onChange={(e) => setCurrentZone({ ...currentZone, baseCost: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-semibold text-neutral-700 mb-1">Monto para Envío Gratis ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={currentZone.freeShippingThreshold}
                    onChange={(e) => setCurrentZone({ ...currentZone, freeShippingThreshold: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    placeholder="Dejar vacío si no aplica"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={currentZone.isDefault}
                  onChange={(e) => setCurrentZone({ ...currentZone, isDefault: e.target.checked })}
                  className="w-4 h-4 text-brand-600 border-neutral-300 rounded focus:ring-brand-500"
                />
                <label htmlFor="isDefault" className="text-sm font-semibold text-neutral-700 cursor-pointer">
                  Zona por defecto (Aplica si la dirección no coincide con otras reglas)
                </label>
              </div>

              {!currentZone.isDefault && (
                <div className="pt-4 border-t border-neutral-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Departments */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Departamentos (Aplica a todo el depto)</label>
                    <div className="flex gap-2 mb-2">
                      <select
                        value={deptInput}
                        onChange={(e) => setDeptInput(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-neutral-300"
                      >
                        <option value="">Seleccionar...</option>
                        {COLOMBIA.map(d => <option key={d.dep} value={d.dep}>{d.dep}</option>)}
                      </select>
                      <button type="button" onClick={addDepartment} className="px-3 py-2 bg-neutral-900 text-white rounded-lg text-sm">Añadir</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentZone.departments.map(d => (
                        <span key={d} className="inline-flex items-center gap-1 bg-neutral-100 px-2 py-1 rounded text-xs">
                          {d}
                          <button type="button" onClick={() => removeDepartment(d)} className="text-red-500"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Cities */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Ciudades Específicas</label>
                    <div className="flex gap-2 mb-2">
                      <select
                        value={cityInput}
                        onChange={(e) => setCityInput(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-neutral-300"
                      >
                        <option value="">Seleccionar ciudad (Requiere depto)...</option>
                        {deptInput && COLOMBIA.find(d => d.dep === deptInput)?.cities.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <button type="button" onClick={addCity} className="px-3 py-2 bg-neutral-900 text-white rounded-lg text-sm">Añadir</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentZone.cities.map(c => (
                        <span key={c} className="inline-flex items-center gap-1 bg-neutral-100 px-2 py-1 rounded text-xs">
                          {c}
                          <button type="button" onClick={() => removeCity(c)} className="text-red-500"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-neutral-600 font-medium hover:bg-neutral-100 rounded-lg transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-6 py-2.5 bg-brand-600 text-white font-medium hover:bg-brand-700 rounded-lg transition-colors flex items-center gap-2">
                  <Check className="w-5 h-5" /> Guardar Zona
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingTab;
