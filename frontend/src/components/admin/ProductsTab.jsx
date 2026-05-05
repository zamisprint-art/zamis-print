import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, PlusCircle, Edit, Trash2, X, Upload, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductsTab = () => {
  const [data, setData] = useState({ products: [], page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  // Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    _id: '', name: '', price: 0, category: '', countInStock: 0, description: '', image: '', model3D: '', gallery: []
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingModel, setUploadingModel] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data: resData } = await axios.get(`/api/products?page=${page}&limit=20&search=${search}&category=${category}`);
      setData(resData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

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
        await axios.delete(`/api/products/${id}`, { withCredentials: true });
        fetchProducts();
      } catch (error) {
        alert(error.response?.data?.message || 'Error al eliminar');
      }
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/api/products/${currentProduct._id}`, currentProduct, { withCredentials: true });
      } else {
        const { data: created } = await axios.post('/api/products', {}, { withCredentials: true });
        await axios.put(`/api/products/${created._id}`, currentProduct, { withCredentials: true });
      }
      setIsModalOpen(false);
      fetchProducts();
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
      const config = { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true };
      const { data: responseData } = await axios.post('/api/upload', formData, config);
      
      if (type === 'image') {
        setCurrentProduct({ ...currentProduct, image: responseData.filePath });
        setUploadingImage(false);
      } else if (type === 'gallery') {
        const newGallery = currentProduct.gallery ? [...currentProduct.gallery, responseData.filePath] : [responseData.filePath];
        setCurrentProduct({ ...currentProduct, gallery: newGallery });
        setUploadingImage(false);
      } else {
        setCurrentProduct({ ...currentProduct, model3D: responseData.filePath });
        setUploadingModel(false);
      }
    } catch (error) {
      console.error(error);
      alert('Error subiendo el archivo');
      if (type === 'image' || type === 'gallery') setUploadingImage(false);
      else setUploadingModel(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Catálogo ({data.total})</h2>
        <button onClick={handleOpenCreateModal} className="bg-brand-500 hover:bg-brand-600 text-white font-bold flex items-center gap-2 py-2 px-4 rounded-xl shadow-sm transition-colors">
          <PlusCircle size={18} /> Nuevo Producto
        </button>
      </div>

      {/* Filters and Search */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 w-full mb-6">
        <div className="relative w-full sm:w-64">
          <input 
            type="text" 
            placeholder="Buscar producto por nombre..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
          <Search size={18} className="absolute left-3 top-2.5 text-neutral-400" />
        </div>
        <select 
          value={category} 
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="px-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand-500 bg-white"
        >
          <option value="all">Todas las Categorías</option>
          {/* Opciones extraídas dinámicamente o quemadas si ya se conocen */}
          <option value="Figuras">Figuras</option>
          <option value="Llaveros">Llaveros</option>
          <option value="Accesorios">Accesorios</option>
          <option value="Decoración">Decoración</option>
          <option value="Test">Test (Oculto)</option>
        </select>
        <button type="submit" className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl font-bold transition-colors">
          Buscar
        </button>
      </form>
      
      {loading ? (
        <div className="flex justify-center items-center h-64 text-neutral-500">Cargando catálogo...</div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-xl border border-neutral-200">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-600 bg-neutral-50/50">
                  <th className="py-4 px-4">Producto</th>
                  <th className="py-4 px-4">Categoría</th>
                  <th className="py-4 px-4">Precio</th>
                  <th className="py-4 px-4">Stock</th>
                  <th className="py-4 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.products.map((product) => (
                  <tr key={product._id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="font-bold text-neutral-900">{product.name}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-neutral-600">{product.category}</td>
                    <td className="py-4 px-4 font-bold">${product.price.toLocaleString('es-CO')}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${product.countInStock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.countInStock}
                      </span>
                    </td>
                    <td className="py-4 px-4 flex justify-end gap-2">
                      <button onClick={() => handleOpenEditModal(product)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDeleteProduct(product._id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {data.products.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-neutral-500">No se encontraron productos con esos filtros.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {data.pages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <span className="text-sm text-neutral-500">
                Página {data.page} de {data.pages} ({data.total} productos)
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

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 relative shadow-2xl my-auto">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-neutral-500 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6">{isEditing ? 'Editar Producto' : 'Crear Producto'}</h2>
            
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Nombre</label>
                  <input type="text" required value={currentProduct.name} onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})} className="w-full border rounded-lg p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Categoría</label>
                  <input type="text" required value={currentProduct.category} onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})} className="w-full border rounded-lg p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Subcategoría (Opcional)</label>
                  <input type="text" value={currentProduct.subcategory || ''} onChange={(e) => setCurrentProduct({...currentProduct, subcategory: e.target.value})} className="w-full border rounded-lg p-2" placeholder="Ej: Macetas" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Precio ($)</label>
                  <input type="number" required value={currentProduct.price} onChange={(e) => setCurrentProduct({...currentProduct, price: e.target.value})} className="w-full border rounded-lg p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Stock</label>
                  <input type="number" required value={currentProduct.countInStock} onChange={(e) => setCurrentProduct({...currentProduct, countInStock: e.target.value})} className="w-full border rounded-lg p-2" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Descripción</label>
                <textarea rows="3" required value={currentProduct.description} onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})} className="w-full border rounded-lg p-2"></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-neutral-200 rounded-xl bg-neutral-50">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                    <Upload size={16} className="text-brand-500"/> Subir Imagen (JPG/PNG)
                  </label>
                  <div className="flex items-start gap-4">
                    {currentProduct.image && (
                      <div className="w-16 h-16 rounded-xl bg-neutral-100 overflow-hidden border border-neutral-200 shrink-0 shadow-sm relative">
                        {uploadingImage ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                            <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        ) : null}
                        <img src={currentProduct.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <input type="file" onChange={(e) => uploadFileHandler(e, 'image')} className="w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-600 hover:file:bg-brand-100 cursor-pointer" />
                      {uploadingImage && <p className="text-xs text-brand-600 font-semibold mt-2 animate-pulse">Subiendo a Cloudinary...</p>}
                      {currentProduct.image && !uploadingImage && <p className="text-xs text-neutral-400 mt-2 truncate" title={currentProduct.image}>✅ Imagen lista</p>}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                    <Upload size={16} className="text-neutral-500"/> Subir Modelo 3D (.GLB)
                  </label>
                  <input type="file" onChange={(e) => uploadFileHandler(e, 'model')} className="text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-neutral-100 file:text-neutral-600 hover:file:bg-neutral-200" />
                  {uploadingModel && <p className="text-xs text-blue-400 mt-1">Subiendo...</p>}
                  {currentProduct.model3D && <p className="text-xs text-green-600 mt-1 truncate">{currentProduct.model3D}</p>}
                </div>
              </div>
              
              {/* Gallery Section */}
              <div className="p-4 border border-neutral-200 rounded-xl bg-neutral-50 mt-4">
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
                    <select value={currentProduct.material || ''} onChange={(e) => setCurrentProduct({...currentProduct, material: e.target.value})} className="w-full border rounded-lg p-2">
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
                    <select value={currentProduct.size || ''} onChange={(e) => setCurrentProduct({...currentProduct, size: e.target.value})} className="w-full border rounded-lg p-2">
                      <option value="">Sin especificar</option>
                      <option value="Pequeño">Pequeño</option>
                      <option value="Mediano">Mediano</option>
                      <option value="Grande">Grande</option>
                      <option value="Extra Grande">Extra Grande</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Color principal</label>
                    <input type="text" value={currentProduct.color || ''} onChange={(e) => setCurrentProduct({...currentProduct, color: e.target.value})} className="w-full border rounded-lg p-2" placeholder="Ej: Negro, Blanco, Multicolor" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Medidas (cm)</label>
                    <input type="text" value={currentProduct.measurements || ''} onChange={(e) => setCurrentProduct({...currentProduct, measurements: e.target.value})} className="w-full border rounded-lg p-2" placeholder="Ej: 10 x 5 x 8 cm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Nivel de Personalización</label>
                    <select value={currentProduct.personalizationLevel || 'Ninguna'} onChange={(e) => setCurrentProduct({...currentProduct, personalizationLevel: e.target.value})} className="w-full border rounded-lg p-2">
                      <option value="Ninguna">Ninguna</option>
                      <option value="Básica">Básica (texto/color)</option>
                      <option value="Avanzada">Avanzada (imagen+texto)</option>
                      <option value="Premium">Premium (diseño completo)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Precio de Oferta ($)</label>
                    <input type="number" value={currentProduct.salePrice || ''} onChange={(e) => setCurrentProduct({...currentProduct, salePrice: e.target.value})} className="w-full border rounded-lg p-2" placeholder="Dejar vacío si no hay oferta" />
                  </div>
                </div>
              </div>

              {/* Merchandising Flags */}
              <div className="mt-4 p-4 border border-brand-100 rounded-xl bg-brand-50/30 space-y-3">
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

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-neutral-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border border-neutral-300 rounded-lg font-bold text-neutral-600 hover:bg-neutral-50" disabled={uploadingImage || uploadingModel}>Cancelar</button>
                <button type="submit" className="px-6 py-2 bg-brand-500 text-white rounded-lg font-bold hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed" disabled={uploadingImage || uploadingModel}>
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

export default ProductsTab;
