import { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import Rating from '../components/Rating';
import { ShoppingCart, Package, Truck, ShieldCheck } from 'lucide-react';

// Lazy load the 3D viewer so it doesn't block the initial render
const Product3DViewer = lazy(() => import('../components/Product3DViewer'));

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [personalizationText, setPersonalizationText] = useState('');
  const [personalizationImage, setPersonalizationImage] = useState(null);
  
  // Reviews state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const addItem = useCartStore((state) => state.addItem);
  const { userInfo } = useAuthStore();

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

  useEffect(() => {
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

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewError('');
    try {
      await axios.post(
        `/api/products/${id}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${userInfo?.token}` } } // Fallback header just in case, though cookie is used
      );
      alert('¡Reseña enviada con éxito!');
      setRating(0);
      setComment('');
      fetchProduct();
    } catch (error) {
      setReviewError(error.response?.data?.message || 'Error al enviar la reseña');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  if (!product) return <div className="text-center py-20 text-2xl text-gray-400">Producto no encontrado</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-20 md:mb-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Left Col: Visuals (Image or 3D) */}
        <div className="h-[400px] sm:h-[500px] lg:h-[600px] w-full rounded-2xl overflow-hidden border border-white/10 bg-darker relative shadow-2xl">
          {product.model3D ? (
            <Suspense fallback={
              <div className="w-full h-full flex flex-col items-center justify-center bg-darker">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                <p className="text-gray-400 animate-pulse">Cargando experiencia 3D...</p>
              </div>
            }>
              <Product3DViewer modelUrl={product.model3D} />
            </Suspense>
          ) : (
            <img 
              src={(product.image && product.image !== '/images/sample.jpg') ? product.image : 'https://via.placeholder.com/600x600?text=Sube+una+Foto+o+Modelo+3D'} 
              alt={product.name} 
              className="w-full h-full object-cover" 
            />
          )}
        </div>

        {/* Right Col: Details & Actions */}
        <div className="flex flex-col">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <Rating value={product.rating} text={`${product.numReviews} reseñas verificadas`} />
          </div>

          <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-6">
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
                  className="input-field text-lg py-3"
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
                  className="block w-full text-sm text-gray-400 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 transition-colors"
                />
              </div>
            )}

            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-300">Cantidad:</label>
              <select 
                value={qty} 
                onChange={(e) => setQty(Number(e.target.value))}
                className="input-field w-24 bg-dark text-lg"
              >
                {[...Array(product.countInStock || 10).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>{x + 1}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Desktop Add to Cart */}
          <button 
            onClick={handleAddToCart}
            className="hidden md:flex btn-primary w-full py-5 text-xl font-bold justify-center items-center gap-3 transform hover:scale-[1.02] transition-transform shadow-primary/30 shadow-xl rounded-xl"
          >
            <ShoppingCart size={24} />
            Añadir al Carrito - ${(product.price * qty).toFixed(2)}
          </button>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10">
            <div className="flex flex-col items-center text-center text-gray-400">
              <Package size={24} className="mb-2 text-primary" />
              <span className="text-xs">Hecho a Medida</span>
            </div>
            <div className="flex flex-col items-center text-center text-gray-400">
              <Truck size={24} className="mb-2 text-primary" />
              <span className="text-xs">Envíos a todo el país</span>
            </div>
            <div className="flex flex-col items-center text-center text-gray-400">
              <ShieldCheck size={24} className="mb-2 text-primary" />
              <span className="text-xs">Pago Seguro</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-20 border-t border-white/10 pt-16">
        <h2 className="text-3xl font-bold mb-8">Opiniones de Clientes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Reviews List */}
          <div className="space-y-6">
            {product.reviews.length === 0 ? (
              <p className="text-gray-400 p-6 glass-panel rounded-xl">Todavía no hay opiniones para este producto. ¡Sé el primero en calificarlo!</p>
            ) : (
              product.reviews.map((review) => (
                <div key={review._id} className="glass-panel p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-lg">{review.name}</span>
                    <Rating value={review.rating} />
                  </div>
                  <p className="text-gray-300 text-sm mt-3 leading-relaxed">{review.comment}</p>
                  <p className="text-xs text-gray-500 mt-4">{review.createdAt.substring(0, 10)}</p>
                </div>
              ))
            )}
          </div>

          {/* Write a Review */}
          <div className="glass-panel p-8 rounded-2xl h-fit">
            <h3 className="text-2xl font-bold mb-6">Escribe tu opinión</h3>
            {reviewError && <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded mb-4 text-sm">{reviewError}</div>}
            
            {userInfo ? (
              <form onSubmit={submitReviewHandler} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Calificación</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="input-field bg-dark"
                    required
                  >
                    <option value="">Selecciona...</option>
                    <option value="1">1 - Pobre</option>
                    <option value="2">2 - Justo</option>
                    <option value="3">3 - Bueno</option>
                    <option value="4">4 - Muy Bueno</option>
                    <option value="5">5 - Excelente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Comentario</label>
                  <textarea
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="input-field resize-none"
                    placeholder="¿Qué te pareció el producto?"
                    required
                  ></textarea>
                </div>
                <button
                  disabled={reviewLoading}
                  type="submit"
                  className="btn-primary w-full py-3 disabled:opacity-50"
                >
                  {reviewLoading ? 'Enviando...' : 'Enviar Reseña'}
                </button>
              </form>
            ) : (
              <div className="bg-darker/50 p-6 rounded-xl text-center border border-white/5">
                <p className="text-gray-400 mb-4">Debes iniciar sesión para escribir una reseña.</p>
                <button onClick={() => navigate('/login')} className="btn-outline w-full py-2">
                  Iniciar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-darker/90 backdrop-blur-md border-t border-white/10 md:hidden z-50">
        <button 
          onClick={handleAddToCart}
          className="btn-primary w-full py-4 text-lg font-bold flex justify-center items-center gap-2 shadow-xl shadow-primary/20"
        >
          <ShoppingCart size={20} />
          Añadir - ${(product.price * qty).toFixed(2)}
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
