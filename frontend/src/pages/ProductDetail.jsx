import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Product3DViewer from '../components/Product3DViewer';
import { useCartStore } from '../store/useCartStore';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [personalizationText, setPersonalizationText] = useState('');
  const [personalizationImage, setPersonalizationImage] = useState(null);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product.requiresTextPersonalization && !personalizationText) {
      alert('Por favor ingresa el texto de personalización.');
      return;
    }
    
    addItem({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      qty,
      personalizationText,
      personalizationImage: personalizationImage ? 'uploaded_file_path' : null,
    });
    
    navigate('/cart');
  };

  if (!product) return <div className="text-center py-20">Cargando...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Col: Visuals (Image or 3D) */}
        <div className="h-[500px] lg:h-[600px] w-full">
          {product.model3D ? (
            <Product3DViewer modelUrl={product.model3D} />
          ) : (
            <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10">
              <img 
                src={(product.image && product.image !== '/images/sample.jpg') ? product.image : 'https://via.placeholder.com/600x600?text=Sube+una+Foto+o+Modelo+3D'} 
                alt={product.name} 
                className="w-full h-full object-cover" 
              />
            </div>
          )}
        </div>

        {/* Right Col: Details & Actions */}
        <div className="flex flex-col">
          <h1 className="text-4xl font-extrabold mb-4">{product.name}</h1>
          <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-6">
            ${product.price}
          </p>
          
          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-gray-300 text-lg leading-relaxed">{product.description}</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl mb-8 space-y-6">
            {product.requiresTextPersonalization && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Texto a incluir en el diseño
                </label>
                <input 
                  type="text" 
                  value={personalizationText}
                  onChange={(e) => setPersonalizationText(e.target.value)}
                  className="input-field"
                  placeholder="Ej: ZAMIS 2026"
                  required
                />
              </div>
            )}

            {product.requiresImagePersonalization && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Foto de referencia (para modelado)
                </label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setPersonalizationImage(e.target.files[0])}
                  className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark transition-colors"
                />
              </div>
            )}

            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-300">Cantidad:</label>
              <select 
                value={qty} 
                onChange={(e) => setQty(Number(e.target.value))}
                className="input-field w-24 bg-dark"
              >
                {[...Array(product.countInStock).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>{x + 1}</option>
                ))}
              </select>
            </div>
          </div>

          <button 
            onClick={handleAddToCart}
            className="btn-primary w-full py-4 text-xl font-bold flex justify-center items-center gap-2"
          >
            Añadir al Carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
