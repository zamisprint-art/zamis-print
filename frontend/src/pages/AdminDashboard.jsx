import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, ShoppingBag, PlusCircle, Settings, Edit, Trash2, X, Upload, ClipboardList, DollarSign } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import InventoryTab from '../components/admin/InventoryTab';
import BillingTab from '../components/admin/BillingTab';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const { userInfo } = useAuthStore();

  // Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    _id: '', name: '', price: 0, category: '', countInStock: 0, description: '', image: '', model3D: '', gallery: []
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingModel, setUploadingModel] = useState(false);

  const fetchData = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        axios.get('/api/orders'),
        axios.get('/api/products')
      ]);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchData();
    }
  }, [userInfo]);

  // --- PRODUCT CRUD HANDLERS ---
  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setCurrentProduct({ _id: '', name: '', price: 0, category: '', countInStock: 0, description: '', image: '', model3D: '', gallery: [] });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setIsEditing(true);
    setCurrentProduct({ ...product });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Error al eliminar');
      }
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/api/products/${currentProduct._id}`, currentProduct);
      } else {
        // Create sample then update immediately
        const { data: created } = await axios.post('/api/products', {});
        await axios.put(`/api/products/${created._id}`, currentProduct);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al guardar');
    }
  };

  const uploadFileHandler = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    if (type === 'image' || type === 'gallery') setUploadingImage(true);
    else setUploadingModel(true);

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = await axios.post('/api/upload', formData, config);
      
      if (type === 'image') {
        setCurrentProduct({ ...currentProduct, image: data.filePath });
        setUploadingImage(false);
      } else if (type === 'gallery') {
        const newGallery = currentProduct.gallery ? [...currentProduct.gallery, data.filePath] : [data.filePath];
        setCurrentProduct({ ...currentProduct, gallery: newGallery });
        setUploadingImage(false);
      } else {
        setCurrentProduct({ ...currentProduct, model3D: data.filePath });
        setUploadingModel(false);
      }
    } catch (error) {
      console.error(error);
      alert('Error subiendo el archivo');
      if (type === 'image' || type === 'gallery') setUploadingImage(false);
      else setUploadingModel(false);
    }
  };

  const handleOrderStatusChange = async (id, status) => {
    try {
      await axios.put(`/api/orders/${id}/status`, { status });
      fetchData();
    } catch (error) {
      alert('Error cambiando estado');
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <div className="w-full md:w-64 flex flex-col gap-2">
        <div className="glass-panel p-6 rounded-2xl mb-4">
          <h2 className="text-xl font-bold mb-1">Panel Admin</h2>
          <p className="text-sm text-primary">ZAMIS Print</p>
        </div>
        
        <button 
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${activeTab === 'orders' ? 'bg-primary text-neutral-900' : 'glass-panel hover:bg-white/5'}`}
        >
          <ShoppingBag size={20} /> Órdenes
        </button>
        <button 
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${activeTab === 'products' ? 'bg-primary text-neutral-900' : 'glass-panel hover:bg-white/5'}`}
        >
          <Package size={20} /> Productos
        </button>
        <button 
          onClick={() => setActiveTab('inventario')}
          className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${activeTab === 'inventario' ? 'bg-primary text-neutral-900' : 'glass-panel hover:bg-white/5'}`}
        >
          <ClipboardList size={20} /> Inventario
        </button>
        <button 
          onClick={() => setActiveTab('cobros')}
          className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${activeTab === 'cobros' ? 'bg-primary text-neutral-900' : 'glass-panel hover:bg-white/5'}`}
        >
          <DollarSign size={20} /> Cobros
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-primary text-neutral-900' : 'glass-panel hover:bg-white/5'}`}
        >
          <Settings size={20} /> Configuración
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 glass-panel rounded-2xl p-6 md:p-8 min-h-[600px] relative">
        {activeTab === 'orders' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Gestión de Órdenes</h2>
            </div>
            
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
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-neutral-100 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-mono text-sm">{order._id.substring(0, 8)}...</td>
                      <td className="py-4 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-neutral-900">{order.user?.name || order.shippingAddress?.fullName || 'Invitado'}</div>
                        <div className="text-xs text-neutral-500">{order.shippingAddress?.phone || 'Sin teléfono'}</div>
                      </td>
                      <td className="py-4 px-4 font-bold">${order.totalPrice}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          order.orderStatus === 'Pendiente' ? 'bg-yellow-500/20 text-yellow-600' :
                          order.orderStatus === 'Pagado' ? 'bg-blue-500/20 text-blue-600' :
                          order.orderStatus === 'En Producción' ? 'bg-purple-500/20 text-purple-600' :
                          order.orderStatus === 'Enviado' ? 'bg-green-500/20 text-green-600' :
                          order.orderStatus === 'Entregado' ? 'bg-teal-500/20 text-teal-600' :
                          'bg-red-500/20 text-red-600'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <select 
                          className="bg-surface-card border border-neutral-300 rounded p-1 text-sm focus:outline-none focus:border-primary"
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
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'inventario' && (
          <InventoryTab />
        )}

        {activeTab === 'cobros' && (
          <BillingTab orders={orders} refreshData={fetchData} />
        )}

        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Catálogo</h2>
              <button onClick={handleOpenCreateModal} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
                <PlusCircle size={18} /> Nuevo Producto
              </button>
            </div>
            
            <div className="overflow-x-auto bg-white rounded-xl border border-neutral-200">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-600 bg-neutral-50/50">
                    <th className="py-4 px-4">Nombre</th>
                    <th className="py-4 px-4">Categoría</th>
                    <th className="py-4 px-4">Precio</th>
                    <th className="py-4 px-4">Stock</th>
                    <th className="py-4 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b border-neutral-100 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-bold">{product.name}</td>
                      <td className="py-4 px-4">{product.category}</td>
                      <td className="py-4 px-4">${product.price}</td>
                      <td className="py-4 px-4">{product.countInStock}</td>
                      <td className="py-4 px-4 flex justify-end gap-2">
                        <button onClick={() => handleOpenEditModal(product)} className="p-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500 hover:text-neutral-900 transition-colors">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDeleteProduct(product._id)} className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-neutral-900 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-2xl font-bold mb-8">Configuración Integraciones</h2>
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">MercadoPago Access Token</label>
                <input type="password" value="TEST-****************" disabled className="input-field opacity-50" />
                <p className="text-xs text-neutral-500 mt-1">Configurado vía variables de entorno (.env)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Resend API Key</label>
                <input type="password" value="re_****************" disabled className="input-field opacity-50" />
                <p className="text-xs text-neutral-500 mt-1">Configurado vía variables de entorno (.env)</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-base/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 relative shadow-2xl">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-neutral-900 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6">{isEditing ? 'Editar Producto' : 'Crear Producto'}</h2>
            
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Nombre</label>
                  <input type="text" required value={currentProduct.name} onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Categoría</label>
                  <input type="text" required value={currentProduct.category} onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Subcategoría (Opcional)</label>
                  <input type="text" value={currentProduct.subcategory || ''} onChange={(e) => setCurrentProduct({...currentProduct, subcategory: e.target.value})} className="input-field" placeholder="Ej: Macetas" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Precio ($)</label>
                  <input type="number" required value={currentProduct.price} onChange={(e) => setCurrentProduct({...currentProduct, price: e.target.value})} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Stock</label>
                  <input type="number" required value={currentProduct.countInStock} onChange={(e) => setCurrentProduct({...currentProduct, countInStock: e.target.value})} className="input-field" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Descripción</label>
                <textarea rows="3" required value={currentProduct.description} onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})} className="input-field"></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-neutral-200 rounded-xl bg-black/20">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                    <Upload size={16} className="text-primary"/> Subir Imagen (JPG/PNG)
                  </label>
                  <div className="flex items-start gap-4">
                    {currentProduct.image && (
                      <div className="w-16 h-16 rounded-xl bg-neutral-100 overflow-hidden border border-neutral-200 shrink-0 shadow-sm relative">
                        {uploadingImage ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        ) : null}
                        <img src={currentProduct.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <input type="file" onChange={(e) => uploadFileHandler(e, 'image')} className="w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
                      {uploadingImage && <p className="text-xs text-primary font-semibold mt-2 animate-pulse">Subiendo a Cloudinary...</p>}
                      {currentProduct.image && !uploadingImage && <p className="text-xs text-neutral-400 mt-2 truncate" title={currentProduct.image}>✅ Imagen lista</p>}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                    <Upload size={16} className="text-accent"/> Subir Modelo 3D (.GLB)
                  </label>
                  <input type="file" onChange={(e) => uploadFileHandler(e, 'model')} className="text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent/20 file:text-accent hover:file:bg-accent/30" />
                  {uploadingModel && <p className="text-xs text-blue-400 mt-1">Subiendo...</p>}
                  {currentProduct.model3D && <p className="text-xs text-green-400 mt-1 truncate">{currentProduct.model3D}</p>}
                </div>
              </div>
              
              {/* Gallery Section */}
              <div className="p-4 border border-neutral-200 rounded-xl bg-black/20 mt-4">
                <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2"><Upload size={16} className="text-brand-500"/> Galería de Imágenes (Opcional)</span>
                  <span className="text-xs font-normal text-neutral-500">Máximo 4 fotos</span>
                </label>
                
                <div className="flex flex-wrap gap-4 mb-4">
                  {currentProduct.gallery?.map((imgUrl, idx) => (
                    <div key={idx} className="w-16 h-16 rounded-xl bg-neutral-100 overflow-hidden border border-neutral-200 relative group">
                      <img src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => {
                          const newGallery = currentProduct.gallery.filter((_, i) => i !== idx);
                          setCurrentProduct({...currentProduct, gallery: newGallery});
                        }}
                        className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  
                  {(!currentProduct.gallery || currentProduct.gallery.length < 4) && (
                    <div className="w-16 h-16 rounded-xl border-2 border-dashed border-neutral-300 flex items-center justify-center relative hover:border-brand-500 hover:bg-brand-50 transition-colors">
                      {uploadingImage ? (
                        <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <PlusCircle size={20} className="text-neutral-400" />
                      )}
                      <input 
                        type="file" 
                        onChange={(e) => uploadFileHandler(e, 'gallery')} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        disabled={uploadingImage}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Advanced Attributes */}
              <div className="mt-4 p-4 border border-neutral-200 rounded-xl bg-neutral-50/50 space-y-4">
                <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wide">Atributos del Producto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Material</label>
                    <select value={currentProduct.material || ''} onChange={(e) => setCurrentProduct({...currentProduct, material: e.target.value})} className="input-field">
                      <option value="">Sin especificar</option>
                      <option value="PLA">PLA</option>
                      <option value="PETG">PETG</option>
                      <option value="ABS">ABS</option>
                      <option value="Resina">Resina</option>
                      <option value="Nylon">Nylon</option>
                      <option value="Flexible (TPU)">Flexible (TPU)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Tamaño</label>
                    <select value={currentProduct.size || ''} onChange={(e) => setCurrentProduct({...currentProduct, size: e.target.value})} className="input-field">
                      <option value="">Sin especificar</option>
                      <option value="Pequeño">Pequeño</option>
                      <option value="Mediano">Mediano</option>
                      <option value="Grande">Grande</option>
                      <option value="Extra Grande">Extra Grande</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Color principal</label>
                    <input type="text" value={currentProduct.color || ''} onChange={(e) => setCurrentProduct({...currentProduct, color: e.target.value})} className="input-field" placeholder="Ej: Negro, Blanco, Multicolor" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Medidas (cm)</label>
                    <input type="text" value={currentProduct.measurements || ''} onChange={(e) => setCurrentProduct({...currentProduct, measurements: e.target.value})} className="input-field" placeholder="Ej: 10 x 5 x 8 cm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Nivel de Personalización</label>
                    <select value={currentProduct.personalizationLevel || 'Ninguna'} onChange={(e) => setCurrentProduct({...currentProduct, personalizationLevel: e.target.value})} className="input-field">
                      <option value="Ninguna">Ninguna</option>
                      <option value="Básica">Básica (texto/color)</option>
                      <option value="Avanzada">Avanzada (imagen+texto)</option>
                      <option value="Premium">Premium (diseño completo)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Precio de Oferta ($)</label>
                    <input type="number" value={currentProduct.salePrice || ''} onChange={(e) => setCurrentProduct({...currentProduct, salePrice: e.target.value})} className="input-field" placeholder="Dejar vacío si no hay oferta" />
                  </div>
                </div>
              </div>

              {/* Merchandising Flags */}
              <div className="mt-4 p-4 border border-neutral-200 rounded-xl bg-brand-50/50 space-y-3">
                <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wide">Destacar Producto</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" id="isCustomizable" checked={currentProduct.isCustomizable || false} onChange={(e) => setCurrentProduct({...currentProduct, isCustomizable: e.target.checked})} className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500 border-neutral-300" />
                    <span className="text-sm font-medium text-neutral-900">⚡ Configurador Premium</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={currentProduct.isFeatured || false} onChange={(e) => setCurrentProduct({...currentProduct, isFeatured: e.target.checked})} className="w-5 h-5 text-amber-500 rounded focus:ring-amber-400 border-neutral-300" />
                    <span className="text-sm font-medium text-neutral-900">⭐ Producto Destacado</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={currentProduct.isNewArrival || false} onChange={(e) => setCurrentProduct({...currentProduct, isNewArrival: e.target.checked})} className="w-5 h-5 text-green-600 rounded focus:ring-green-500 border-neutral-300" />
                    <span className="text-sm font-medium text-neutral-900">🆕 Nueva llegada</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={currentProduct.isOnSale || false} onChange={(e) => setCurrentProduct({...currentProduct, isOnSale: e.target.checked})} className="w-5 h-5 text-red-500 rounded focus:ring-red-400 border-neutral-300" />
                    <span className="text-sm font-medium text-neutral-900">🏷️ En Oferta</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-outline" disabled={uploadingImage || uploadingModel}>Cancelar</button>
                <button type="submit" className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed" disabled={uploadingImage || uploadingModel}>
                  {uploadingImage || uploadingModel ? 'Subiendo archivos...' : 'Guardar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

