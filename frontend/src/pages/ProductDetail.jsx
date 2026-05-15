import { useState, useEffect, lazy, Suspense, useRef } from 'react';
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
import ProductCard from '../components/ProductCard';
import { fadeUp, fadeLeft, fadeRight } from '../design-system/tokens';

const Product3DViewer = lazy(() => import('../components/Product3DViewer'));

const ProductDetail = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [product, setProduct]                     = useState(null);
  const [relatedProducts, setRelatedProducts]     = useState([]);
  const [activeMedia, setActiveMedia]             = useState(null); // '3d' | 'main' | url
  const [loading, setLoading]                     = useState(true);
  const [qty, setQty]                             = useState(1);
  const [customMaterial, setCustomMaterial]         = useState('Estándar');
  const [customSize, setCustomSize]                 = useState('100%');
  const [customFinish, setCustomFinish]             = useState('Limpiado');
  const [customFont, setCustomFont]                 = useState('Clásica');
  const [customTextColor, setCustomTextColor]       = useState('Blanco');
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
      setLoading(true);
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
      
      // Fetch related products (same category)
      const { data: allProductsData } = await axios.get('/api/products?limit=20');
      const allProducts = allProductsData.products || [];
      const related = allProducts.filter(p => p.category === data.category && p._id !== data._id).slice(0, 3);
      setRelatedProducts(related);
      
      window.scrollTo(0, 0); // Scroll to top when changing product
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProduct(); }, [id]);

  const containerRef = useRef(null);

  // --- Pricing Logic ---
  const basePrice = product?.price || 0;
  const getCustomPriceAdditions = () => {
    if (!product?.isCustomizable) return 0;
    let extra = 0;
    if (customMaterial === 'Premium') extra += 15000;
    if (customMaterial === 'Especial') extra += 20000;
    if (customSize === '150%') extra += 35000;
    if (customFinish === 'Pintado a mano') extra += 50000;
    if (personalizationText.trim() !== '') extra += 10000;
    return extra;
  };
  const finalPrice = basePrice + getCustomPriceAdditions();

  const handleAddToCart = () => {
    if (product.requiresTextPersonalization && !product.isCustomizable && !personalizationText) {
      alert('Por favor ingresa el texto de personalización.');
      return;
    }
    
    // Format custom details if customizable
    let finalPersonalizationText = personalizationText;
    if (product.isCustomizable) {
      const details = [
        `Material: ${customMaterial}`,
        `Tamaño: ${customSize}`,
        `Acabado: ${customFinish}`,
      ];
      if (personalizationText) details.push(`Texto: "${personalizationText}" | Fuente: ${customFont} | Color: ${customTextColor} (Ubicación según arrastre)`);
      finalPersonalizationText = details.join(' | ');
    }

    addItem({
      product: product._id,
      name: product.name,
      image: product.image,
      price: finalPrice, // Use the computed price
      countInStock: product.countInStock,
      qty,
      personalizationText: finalPersonalizationText,
      personalizationImage: personalizationImage ? 'uploaded_file_path' : null,
    });
    // navigate('/cart'); // Removido para que se abra el CartDrawer en su lugar
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
        <div className="flex flex-col gap-4">
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            animate="visible"
            className="h-[400px] sm:h-[500px] lg:h-[580px] rounded-2xl overflow-hidden border border-neutral-200 bg-surface-base shadow-2xl relative"
          >
            {(!activeMedia && product.model3D?.startsWith('http')) || activeMedia === '3d' ? (
              <Suspense fallback={
                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-500" />
                  <p className="text-neutral-400 animate-pulse text-sm">Cargando experiencia 3D...</p>
                </div>
              }>
                <Product3DViewer modelUrl={product.model3D} />
              </Suspense>
            ) : (
              <div ref={containerRef} className="relative w-full h-full group overflow-hidden touch-none">
                <img
                  src={
                    activeMedia && activeMedia !== 'main' 
                      ? activeMedia 
                      : (product.image && product.image !== '/images/sample.jpg' ? product.image : 'https://via.placeholder.com/600x600?text=ZAMIS+Print')
                  }
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/600x600?text=Imagen+No+Disponible'; }}
                  alt={product.name}
                  className={`w-full h-full object-cover pointer-events-none transition-all duration-500 ${
                    customMaterial === 'Especial' ? 'contrast-125 saturate-150 hue-rotate-15' : 
                    customMaterial === 'Premium' ? 'sepia-[.2] contrast-110' : ''
                  } ${customSize === '150%' ? 'scale-110' : 'scale-100'}`}
                />
                
                {/* Live Text Engraving Overlay - Draggable */}
                {product.isCustomizable && personalizationText && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    drag
                    dragConstraints={containerRef}
                    dragElastic={0.1}
                    dragMomentum={false}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center cursor-move z-10 group"
                  >
                    <div className="px-6 py-4 rounded-xl border-2 border-transparent group-hover:border-white/30 group-hover:bg-black/10 transition-all flex flex-col items-center">
                      <div 
                        className={`relative text-5xl md:text-7xl select-none leading-none ${
                          customFont === 'Clásica' ? 'font-serif font-bold tracking-wider' : 
                          customFont === 'Divertida' ? 'font-black tracking-normal' : 
                          customFont === 'Cursiva' ? 'italic font-semibold tracking-normal' : 'font-black uppercase tracking-[0.2em]'
                        }`}
                        style={{
                          transform: 'perspective(500px) rotateX(15deg) rotateZ(-2deg)',
                          fontFamily: customFont === 'Divertida' ? '"Comic Sans MS", "Marker Felt", sans-serif' : customFont === 'Cursiva' ? '"Brush Script MT", "Lucida Handwriting", cursive' : undefined
                        }}
                      >
                        {/* BASE LAYER: 3D Extrusion and Drop Shadow */}
                        <span 
                          className="block"
                          style={{ 
                            color: customTextColor === 'Dorado' ? '#b45309' 
                                 : customTextColor === 'Negro' ? '#0a0a0a' 
                                 : customTextColor === 'Rojo' ? '#991b1b' 
                                 : customTextColor === 'Azul' ? '#1e3a8a' 
                                 : customTextColor === 'Verde' ? '#14532d' 
                                 : '#94a3b8',
                            textShadow: customTextColor === 'Dorado' 
                              ? '0px 1px 0px #d97706, 0px 2px 0px #b45309, 0px 3px 0px #92400e, 0px 4px 0px #78350f, 0px 12px 20px rgba(0,0,0,0.7)'
                              : customTextColor === 'Negro'
                              ? '0px 1px 0px #171717, 0px 2px 0px #0a0a0a, 0px 3px 0px #000000, 0px 12px 20px rgba(0,0,0,0.9)'
                              : customTextColor === 'Rojo'
                              ? '0px 1px 0px #dc2626, 0px 2px 0px #b91c1c, 0px 3px 0px #991b1b, 0px 4px 0px #7f1d1d, 0px 12px 20px rgba(0,0,0,0.7)'
                              : customTextColor === 'Azul'
                              ? '0px 1px 0px #2563eb, 0px 2px 0px #1d4ed8, 0px 3px 0px #1e40af, 0px 4px 0px #1e3a8a, 0px 12px 20px rgba(0,0,0,0.7)'
                              : customTextColor === 'Verde'
                              ? '0px 1px 0px #16a34a, 0px 2px 0px #15803d, 0px 3px 0px #166534, 0px 4px 0px #14532d, 0px 12px 20px rgba(0,0,0,0.7)'
                              : '0px 1px 0px #cbd5e1, 0px 2px 0px #94a3b8, 0px 3px 0px #64748b, 0px 4px 0px #475569, 0px 12px 20px rgba(0,0,0,0.6)',
                          }}
                        >
                          {personalizationText}
                        </span>
                        
                        {/* TOP LAYER: Metallic/Glossy Gradient Material */}
                        <span 
                          className="absolute inset-0 top-0 left-0 w-full h-full pointer-events-none"
                          style={{
                            backgroundImage: customTextColor === 'Dorado'
                              ? 'linear-gradient(180deg, #fef08a 0%, #eab308 30%, #b45309 80%, #451a03 100%)'
                              : customTextColor === 'Negro'
                              ? 'linear-gradient(180deg, #737373 0%, #262626 40%, #000000 80%, #000000 100%)'
                              : customTextColor === 'Rojo'
                              ? 'linear-gradient(180deg, #fca5a5 0%, #ef4444 30%, #b91c1c 80%, #7f1d1d 100%)'
                              : customTextColor === 'Azul'
                              ? 'linear-gradient(180deg, #93c5fd 0%, #3b82f6 30%, #1d4ed8 80%, #1e3a8a 100%)'
                              : customTextColor === 'Verde'
                              ? 'linear-gradient(180deg, #86efac 0%, #22c55e 30%, #15803d 80%, #14532d 100%)'
                              : 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 30%, #94a3b8 80%, #475569 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            color: 'transparent',
                          }}
                        >
                          {personalizationText}
                        </span>
                      </div>
                      <p className="opacity-0 group-hover:opacity-100 text-white/90 text-[10px] uppercase tracking-widest text-center mt-3 flex items-center justify-center gap-1 select-none transition-opacity bg-black/50 px-2 py-1 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span> Arrastra para ubicar
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>

          {/* Thumbnails Gallery */}
          <motion.div variants={fadeLeft} className="flex gap-3 overflow-x-auto pb-2 snap-x hide-scrollbar">
            {/* 3D Thumbnail */}
            {product.model3D?.startsWith('http') && (
              <button
                onClick={() => setActiveMedia('3d')}
                className={`w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                  (!activeMedia || activeMedia === '3d') ? 'border-brand-500 shadow-md ring-2 ring-brand-500/20' : 'border-neutral-200 hover:border-brand-300 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="w-full h-full bg-neutral-100 flex flex-col items-center justify-center text-brand-500">
                  <span className="font-bold text-lg leading-none">3D</span>
                  <span className="text-[10px] font-semibold mt-1">Visor</span>
                </div>
              </button>
            )}
            
            {/* Main Image Thumbnail */}
            {product.image && product.image !== '/images/sample.jpg' && (
              <button
                onClick={() => setActiveMedia('main')}
                className={`w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                  (activeMedia === 'main' || (!activeMedia && !product.model3D?.startsWith('http'))) ? 'border-brand-500 shadow-md ring-2 ring-brand-500/20' : 'border-neutral-200 hover:border-brand-300 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={product.image} alt="Principal" className="w-full h-full object-cover" />
              </button>
            )}

            {/* Extra Gallery Thumbnails */}
            {product.gallery?.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveMedia(imgUrl)}
                className={`w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                  activeMedia === imgUrl ? 'border-brand-500 shadow-md ring-2 ring-brand-500/20' : 'border-neutral-200 hover:border-brand-300 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={imgUrl} alt={`Galería ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </motion.div>
        </div>

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
          <PriceDisplay price={finalPrice} size="lg" />

          {/* Description */}
          <p className="text-neutral-400 text-base leading-relaxed">{product.description}</p>

          <div className="divider" />

          {/* Personalization Options */}
          <div className="flex flex-col gap-6">
            {product.isCustomizable ? (
              <div className="bg-brand-50/50 border border-brand-100 rounded-2xl p-5 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-brand-500 text-white text-xs font-bold px-2 py-1 rounded">PRO</span>
                  <h3 className="font-bold text-neutral-900">Configurador Premium</h3>
                </div>

                {/* Step 1: Material */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">1. Material y Color</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {['Estándar', 'Premium', 'Especial'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => setCustomMaterial(opt)}
                        className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${customMaterial === opt ? 'bg-brand-500 text-white border-brand-500 shadow-md' : 'bg-white text-neutral-600 border-neutral-200 hover:border-brand-300'}`}
                      >
                        {opt}
                        <span className="block text-[10px] opacity-80 font-normal">
                          {opt === 'Estándar' ? 'Incluido' : opt === 'Premium' ? '+$15.000' : '+$20.000'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Size */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">2. Escala / Tamaño</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['100%', '150%'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => setCustomSize(opt)}
                        className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${customSize === opt ? 'bg-brand-500 text-white border-brand-500 shadow-md' : 'bg-white text-neutral-600 border-neutral-200 hover:border-brand-300'}`}
                      >
                        {opt === '100%' ? 'Original (100%)' : 'Extra Grande (150%)'}
                        <span className="block text-[10px] opacity-80 font-normal">
                          {opt === '100%' ? 'Incluido' : '+$35.000'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 3: Finish */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">3. Acabado</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Limpiado', 'Pintado a mano'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => setCustomFinish(opt)}
                        className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${customFinish === opt ? 'bg-brand-500 text-white border-brand-500 shadow-md' : 'bg-white text-neutral-600 border-neutral-200 hover:border-brand-300'}`}
                      >
                        {opt}
                        <span className="block text-[10px] opacity-80 font-normal">
                          {opt === 'Limpiado' ? 'Incluido' : '+$50.000'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 4: Text */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">4. Nombre de la Mascota (+$10.000)</label>
                  <input
                    type="text"
                    value={personalizationText}
                    onChange={(e) => setPersonalizationText(e.target.value.substring(0, 15))}
                    className="input-field bg-white"
                    placeholder="Ej: MAX (Máximo 15 letras)"
                  />
                </div>

                {/* Step 5: Typography & Color (Conditional based on text) */}
                {personalizationText && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-brand-200/50 pt-5 mt-2">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">Estilo de Letra</label>
                      <select value={customFont} onChange={(e) => setCustomFont(e.target.value)} className="w-full border border-neutral-200 rounded-lg p-2.5 bg-white text-sm focus:ring-2 focus:ring-brand-500 outline-none">
                        <option value="Clásica">Clásica (Elegante)</option>
                        <option value="Divertida">Divertida (Estilo Cómic)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">Color del Relieve</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {[
                          { name: 'Blanco', bg: 'bg-white', border: 'border-neutral-300' },
                          { name: 'Negro', bg: 'bg-neutral-900', border: 'border-neutral-900' },
                          { name: 'Dorado', bg: 'bg-amber-400', border: 'border-amber-400' },
                          { name: 'Rojo', bg: 'bg-red-500', border: 'border-red-600' },
                          { name: 'Azul', bg: 'bg-blue-500', border: 'border-blue-600' },
                          { name: 'Verde', bg: 'bg-green-500', border: 'border-green-600' },
                        ].map(c => (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => setCustomTextColor(c.name)}
                            title={c.name}
                            className={`w-8 h-8 rounded-full border shadow-sm transition-all ${c.bg} ${c.border} ${customTextColor === c.name ? 'scale-125 ring-2 ring-brand-500 ring-offset-2' : 'hover:scale-110 opacity-80 hover:opacity-100'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              /* Legacy Personalization */
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
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mt-2">
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
              : `Añadir al Carrito · ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(finalPrice * qty)}`
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

      {/* Recommendations Section */}
      {relatedProducts.length > 0 && (
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
                También te podría gustar
              </h2>
              <p className="text-neutral-500 mt-2">Productos relacionados que otros clientes compraron</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </motion.div>
      )}

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
            : `Añadir · ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(finalPrice * qty)}`
          }
        </Button>
      </div>
    </div>
  );
};

export default ProductDetail;
