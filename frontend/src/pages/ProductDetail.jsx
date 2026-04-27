import { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import Rating from '../components/Rating';
import { Button } from '../components/ui';
import Alert from '../components/ui/Alert';
import { ProductDetailSkeleton } from '../components/ui/Skeleton';
import PriceDisplay from '../components/ecommerce/PriceDisplay';
import QuantitySelector from '../components/ecommerce/QuantitySelector';
import TrustBadges from '../components/ecommerce/TrustBadges';
import { fadeUp, fadeLeft, fadeRight } from '../design-system/tokens';

const Product3DViewer = lazy(() => import('../components/Product3DViewer'));

const ProductDetail = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [product, setProduct]                     = useState(null);
  const [loading, setLoading]                     = useState(true);
  const [qty, setQty]                             = useState(1);
  const [personalizationText, setPersonalizationText]   = useState('');
  const [personalizationImage, setPersonalizationImage] = useState(null);
  const [rating, setRating]                       = useState(0);
  const [comment, setComment]                     = useState('');
  const [reviewLoading, setReviewLoading]         = useState(false);
  const [reviewError, setReviewError]             = useState('');
  const [reviewSuccess, setReviewSuccess]         = useState(false);

  const addItem    = useCartStore((s) => s.addItem);
  const { userInfo } = useAuthStore();

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProduct(); }, [id]);

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
      countInStock: product.countInStock,
      qty,
      personalizationText,
      personalizationImage: personalizationImage ? 'uploaded_file_path' : null,
    });
    navigate('/cart');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewError('');
    setReviewSuccess(false);
    try {
      await axios.post(`/api/products/${id}/reviews`, { rating, comment });
      setReviewSuccess(true);
      setRating(0);
      setComment('');
      fetchProduct();
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Error al enviar la reseña');
    } finally {
      setReviewLoading(false);
    }
  };

  /* ---------- Loading ---------- */
  if (loading) return (
    <div className="container-xl py-12">
      <ProductDetailSkeleton />
    </div>
  );

  /* ---------- Not Found ---------- */
  if (!product) return (
    <div className="container-xl py-20 text-center">
      <h2 className="text-2xl font-bold text-neutral-400">Producto no encontrado</h2>
    </div>
  );

  const isOutOfStock = product.countInStock === 0;

  return (
    <div className="container-xl py-12 mb-20 md:mb-0">

      {/* Main Grid */}
      <div className="grid-detail mb-16">

        {/* LEFT — Visual */}
        <motion.div
          variants={fadeLeft}
          initial="hidden"
          animate="visible"
          className="h-[400px] sm:h-[500px] lg:h-[580px] rounded-2xl overflow-hidden border border-neutral-200 bg-surface-base shadow-2xl"
        >
          {/* Only show 3D viewer for valid remote URLs (Cloudinary). Local /uploads/ paths don't exist in production. */}
          {product.model3D && product.model3D.startsWith('http') ? (
            <Suspense fallback={
              <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-500" />
                <p className="text-neutral-400 animate-pulse text-sm">Cargando experiencia 3D...</p>
              </div>
            }>
              <Product3DViewer modelUrl={product.model3D} />
            </Suspense>
          ) : (
            <img
              src={
                product.image && product.image !== '/images/sample.jpg'
                  ? product.image
                  : 'https://via.placeholder.com/600x600?text=ZAMIS+Print'
              }
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/600x600?text=Imagen+No+Disponible';
              }}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          )}
        </motion.div>

        {/* RIGHT — Details */}
        <motion.div
          variants={fadeRight}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6"
        >
          {/* Category */}
          {product.category && (
            <span className="text-brand-400 text-sm font-semibold uppercase tracking-widest">
              {product.category}
            </span>
          )}

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">{product.name}</h1>

          {/* Rating */}
          <Rating value={product.rating} text={`${product.numReviews} reseñas verificadas`} />

          {/* Price */}
          <PriceDisplay price={product.price} size="lg" />

          {/* Description */}
          <p className="text-neutral-400 text-base leading-relaxed">{product.description}</p>

          <div className="divider" />

          {/* Personalization Options */}
          <div className="flex flex-col gap-4">
            {product.requiresTextPersonalization && (
              <div>
                <label className="label-base">Texto a incluir en el diseño</label>
                <input
                  type="text"
                  value={personalizationText}
                  onChange={(e) => setPersonalizationText(e.target.value)}
                  className="input-field"
                  placeholder="Ej: ZAMIS 2026"
                />
              </div>
            )}

            {product.requiresImagePersonalization && (
              <div>
                <label className="label-base">Foto de referencia (para modelado)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPersonalizationImage(e.target.files[0])}
                  className="block w-full text-sm text-neutral-400
                    file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0
                    file:text-sm file:font-semibold
                    file:bg-brand-500/20 file:text-brand-300
                    hover:file:bg-brand-500/30 transition-colors"
                />
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <label className="label-base mb-0">Cantidad:</label>
              <QuantitySelector
                value={qty}
                onChange={setQty}
                min={1}
                max={product.countInStock || 10}
                disabled={isOutOfStock}
              />
              {isOutOfStock && (
                <span className="badge stock-out">Agotado</span>
              )}
            </div>
          </div>

          {/* Desktop CTA */}
          <Button
            variant="primary"
            size="xl"
            fullWidth
            disabled={isOutOfStock}
            icon={<ShoppingCart className="w-5 h-5" />}
            onClick={handleAddToCart}
            className="hidden md:flex mt-2"
          >
            {isOutOfStock
              ? 'Sin Stock'
              : `Añadir al Carrito · ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(product.price * qty)}`
            }
          </Button>

          {/* Trust Badges */}
          <TrustBadges variant="compact" className="mt-2" />
        </motion.div>
      </div>

      {/* Reviews Section */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="border-t border-neutral-200 pt-16"
      >
        <h2 className="text-3xl font-bold mb-8">Opiniones de Clientes</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Reviews List */}
          <div className="space-y-4">
            {product.reviews.length === 0 ? (
              <div className="glass-panel p-6 rounded-xl text-neutral-400 text-sm">
                Todavía no hay opiniones. ¡Sé el primero en calificar!
              </div>
            ) : (
              product.reviews.map((review) => (
                <div key={review._id} className="glass-panel p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold">{review.name}</span>
                    <Rating value={review.rating} />
                  </div>
                  <p className="text-neutral-300 text-sm leading-relaxed mt-3">{review.comment}</p>
                  <p className="text-xs text-neutral-600 mt-3">{review.createdAt?.substring(0, 10)}</p>
                </div>
              ))
            )}
          </div>

          {/* Write Review */}
          <div className="glass-panel p-8 rounded-2xl h-fit">
            <h3 className="text-2xl font-bold mb-6">Escribe tu opinión</h3>

            {reviewSuccess && (
              <Alert type="success" title="¡Reseña enviada!" message="Gracias por tu opinión." dismissible className="mb-4" />
            )}
            {reviewError && (
              <Alert type="danger" message={reviewError} dismissible className="mb-4" />
            )}

            {userInfo ? (
              <form onSubmit={submitReview} className="flex flex-col gap-4">
                <div>
                  <label className="label-base">Calificación</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="input-field"
                    required
                  >
                    <option value="">Selecciona...</option>
                    <option value="1">1 — Pobre</option>
                    <option value="2">2 — Regular</option>
                    <option value="3">3 — Bueno</option>
                    <option value="4">4 — Muy Bueno</option>
                    <option value="5">5 — Excelente</option>
                  </select>
                </div>
                <div>
                  <label className="label-base">Comentario</label>
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="input-field resize-none"
                    placeholder="¿Qué te pareció el producto?"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={reviewLoading}
                >
                  Enviar Reseña
                </Button>
              </form>
            ) : (
              <div className="bg-surface-raised p-6 rounded-xl text-center border border-neutral-100">
                <p className="text-neutral-400 mb-4 text-sm">Debes iniciar sesión para escribir una reseña.</p>
                <Button variant="outline" fullWidth onClick={() => navigate('/login')}>
                  Iniciar Sesión
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface-base/90 backdrop-blur-md border-t border-neutral-200 md:hidden z-50">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={isOutOfStock}
          icon={<ShoppingCart className="w-5 h-5" />}
          onClick={handleAddToCart}
        >
          {isOutOfStock
            ? 'Sin Stock'
            : `Añadir · ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(product.price * qty)}`
          }
        </Button>
      </div>
    </div>
  );
};

export default ProductDetail;
