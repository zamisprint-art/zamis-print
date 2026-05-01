import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, AlertTriangle, ArrowUpCircle, ArrowDownCircle, PlusCircle, Edit } from 'lucide-react';

const InventoryTab = () => {
  const [products, setProducts] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('products'); // 'products' or 'materials'
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'adjust_product', 'edit_material', 'create_material'
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, matRes] = await Promise.all([
        axios.get('/api/inventory/products', { withCredentials: true }),
        axios.get('/api/inventory/materials', { withCredentials: true })
      ]);
      setProducts(prodRes.data);
      setMaterials(matRes.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAdjustModal = (product) => {
    setSelectedItem(product);
    setModalType('adjust_product');
    setFormData({ newStock: product.countInStock, stockMinimo: product.stockMinimo || 5, motivo: '' });
    setIsModalOpen(true);
  };

  const openMaterialModal = (material = null) => {
    setSelectedItem(material);
    setModalType(material ? 'edit_material' : 'create_material');
    setFormData(material ? { ...material } : { nombre: '', tipo: 'filamento', unidad: 'kg', stockActual: 0, stockMinimo: 1, proveedor: '', precioUnitario: 0 });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'adjust_product') {
        await axios.put(`/api/inventory/products/${selectedItem._id}`, formData, { withCredentials: true });
      } else if (modalType === 'create_material') {
        await axios.post('/api/inventory/materials', formData, { withCredentials: true });
      } else if (modalType === 'edit_material') {
        // Enviar tipoMovimiento y motivo si hubo ajuste de stock
        await axios.put(`/api/inventory/materials/${selectedItem._id}`, formData, { withCredentials: true });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error guardando datos');
    }
  };

  if (loading) return <div className="p-8 text-center text-neutral-500">Cargando inventario...</div>;

  const lowStockProducts = products.filter(p => p.countInStock <= (p.stockMinimo || 5));
  const lowStockMaterials = materials.filter(m => m.stockActual <= (m.stockMinimo || 1));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Control de Inventario</h2>
      </div>

      {/* Alertas */}
      {(lowStockProducts.length > 0 || lowStockMaterials.length > 0) && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-start gap-3">
          <AlertTriangle className="shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-bold">Alertas de Stock</h4>
            <p className="text-sm">
              Tienes {lowStockProducts.length} producto(s) y {lowStockMaterials.length} materia(s) prima(s) con stock crítico.
            </p>
          </div>
        </div>
      )}

      {/* Sub-tabs */}
      <div className="flex gap-4 border-b border-neutral-200 pb-2">
        <button 
          onClick={() => setActiveSubTab('products')}
          className={`font-semibold pb-2 border-b-2 transition-colors ${activeSubTab === 'products' ? 'border-brand-500 text-brand-700' : 'border-transparent text-neutral-500 hover:text-neutral-800'}`}
        >
          Productos Terminados
        </button>
        <button 
          onClick={() => setActiveSubTab('materials')}
          className={`font-semibold pb-2 border-b-2 transition-colors ${activeSubTab === 'materials' ? 'border-brand-500 text-brand-700' : 'border-transparent text-neutral-500 hover:text-neutral-800'}`}
        >
          Materias Primas
        </button>
      </div>

      {/* Content: Products */}
      {activeSubTab === 'products' && (
        <div className="overflow-x-auto bg-white rounded-xl border border-neutral-200">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-600 bg-neutral-50/50">
                <th className="py-4 px-4">Producto</th>
                <th className="py-4 px-4 text-center">Stock Actual</th>
                <th className="py-4 px-4 text-center">Mínimo</th>
                <th className="py-4 px-4">Estado</th>
                <th className="py-4 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                const min = product.stockMinimo || 5;
                const isLow = product.countInStock <= min;
                return (
                  <tr key={product._id} className={`border-b border-neutral-100 hover:bg-neutral-50 ${isLow ? 'bg-red-50/30' : ''}`}>
                    <td className="py-4 px-4 font-medium flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                      {product.name}
                    </td>
                    <td className="py-4 px-4 text-center font-mono font-bold text-lg">{product.countInStock}</td>
                    <td className="py-4 px-4 text-center text-neutral-500">{min}</td>
                    <td className="py-4 px-4">
                      {isLow ? (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">Bajo Stock</span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Ok</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button onClick={() => openAdjustModal(product)} className="text-brand-600 hover:text-brand-800 font-semibold text-sm">
                        Ajustar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Content: Materials */}
      {activeSubTab === 'materials' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => openMaterialModal()} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm rounded-lg">
              <PlusCircle size={18} /> Nueva Materia Prima
            </button>
          </div>
          <div className="overflow-x-auto bg-white rounded-xl border border-neutral-200">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-600 bg-neutral-50/50">
                  <th className="py-4 px-4">Material</th>
                  <th className="py-4 px-4">Tipo</th>
                  <th className="py-4 px-4 text-center">Stock Actual</th>
                  <th className="py-4 px-4 text-center">Mínimo</th>
                  <th className="py-4 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {materials.map(mat => {
                  const isLow = mat.stockActual <= mat.stockMinimo;
                  return (
                    <tr key={mat._id} className={`border-b border-neutral-100 hover:bg-neutral-50 ${isLow ? 'bg-red-50/30' : ''}`}>
                      <td className="py-4 px-4 font-medium">{mat.nombre}</td>
                      <td className="py-4 px-4 capitalize text-sm text-neutral-500">{mat.tipo}</td>
                      <td className="py-4 px-4 text-center font-mono font-bold text-lg">{mat.stockActual} <span className="text-xs text-neutral-400">{mat.unidad}</span></td>
                      <td className="py-4 px-4 text-center text-neutral-500">{mat.stockMinimo} {mat.unidad}</td>
                      <td className="py-4 px-4 flex justify-end gap-2">
                        <button onClick={() => openMaterialModal(mat)} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                          <Edit size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {materials.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-neutral-500">No hay materias primas registradas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Reusable */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4">
              {modalType === 'adjust_product' && `Ajustar Stock: ${selectedItem?.name}`}
              {modalType === 'create_material' && 'Nueva Materia Prima'}
              {modalType === 'edit_material' && `Editar: ${selectedItem?.nombre}`}
            </h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {modalType === 'adjust_product' ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Stock Actual (Físico)</label>
                    <input type="number" required value={formData.newStock} onChange={e => setFormData({...formData, newStock: Number(e.target.value)})} className="w-full border rounded-lg p-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Stock Mínimo (Alerta)</label>
                    <input type="number" required value={formData.stockMinimo} onChange={e => setFormData({...formData, stockMinimo: Number(e.target.value)})} className="w-full border rounded-lg p-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Motivo del Ajuste</label>
                    <input type="text" placeholder="Ej. Inventario físico, Producto dañado..." value={formData.motivo} onChange={e => setFormData({...formData, motivo: e.target.value})} className="w-full border rounded-lg p-2" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Nombre</label>
                    <input type="text" required value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className="w-full border rounded-lg p-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Tipo</label>
                      <select value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})} className="w-full border rounded-lg p-2">
                        <option value="filamento">Filamento</option>
                        <option value="pintura">Pintura</option>
                        <option value="resina">Resina</option>
                        <option value="empaque">Empaque</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Unidad</label>
                      <input type="text" placeholder="kg, ml, uds..." required value={formData.unidad} onChange={e => setFormData({...formData, unidad: e.target.value})} className="w-full border rounded-lg p-2" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Stock Actual</label>
                      <input type="number" step="0.01" required value={formData.stockActual} onChange={e => setFormData({...formData, stockActual: Number(e.target.value)})} className="w-full border rounded-lg p-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Stock Mínimo</label>
                      <input type="number" step="0.01" required value={formData.stockMinimo} onChange={e => setFormData({...formData, stockMinimo: Number(e.target.value)})} className="w-full border rounded-lg p-2" />
                    </div>
                  </div>
                  {modalType === 'edit_material' && (
                    <div>
                      <label className="block text-sm font-semibold mb-1">Motivo del cambio de stock (Opcional)</label>
                      <input type="text" placeholder="Ej. Compra, Uso en pedido #X..." value={formData.motivo || ''} onChange={e => setFormData({...formData, motivo: e.target.value})} className="w-full border rounded-lg p-2" />
                    </div>
                  )}
                </>
              )}

              <div className="flex gap-3 justify-end mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg">Cancelar</button>
                <button type="submit" className="btn-primary px-6 py-2">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryTab;
