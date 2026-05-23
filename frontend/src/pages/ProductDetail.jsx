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
import { optimizeImage } from '../utils/cloudinary';
import { PRODUCT_COLORS } from '../utils/colors';

const Product3DViewer = lazy(() => import('../components/Product3DViewer'));

const ProductDetail = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [product, setProduct]                     = useState(null);
  const [relatedProducts, setRelatedProducts]     = useState([]);
  const [activeMedia, setActiveMedia]             = useState(null); // '3d' | 'main' | url
  const [loading, setLoading]                     = useState(true);
  const [qty, setQty]                             = useState(1);
  const [customSize, setCustomSize]                 = useState('15 cms');
  const [customFont, setCustomFont]                 = useState('Clásica');
  const [customTextColor, setCustomTextColor]       = useState('Blanco');
  const [personalizationText, setPersonalizationText]   = useState('');
  const [personalizationImage, setPersonalizationImage] = useState(null);
  const [selectedColor, setSelectedColor]         = useState(null);
  
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
    if (customSize === '20 cms') extra += 20000;
    if (personalizationText.trim() !== '') extra += 10000;
    return extra;
  };
  const finalPrice = basePrice + getCustomPriceAdditions();

  const handleAddToCart = () => {
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      alert('Por favor selecciona un color antes de añadir al carrito.');
      return;
    }

    if (product.requiresTextPersonalization && !product.isCustomizable && !personalizationText) {
      alert('Por favor ingresa el texto de personalización.');
      return;
    }
    
    // Format custom details if customizable
    let finalPersonalizationText = personalizationText;
    if (product.isCustomizable) {
      const details = [
        `Tamaño: ${customSize}`
      ];
      if (personalizationText) details.push(`Texto: "${personalizationText}" | Fuente: ${customFont} | Color: ${customTextColor}`);
      finalPersonalizationText = details.join(' | ');
    }

    addItem({
      product: product._id,
      name: product.name,
      image: product.image,
      price: finalPrice, // Use the computed price
      countInStock: product.countInStock,
      qty,
      selectedColor,
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
                      ? optimizeImage(activeMedia, 800) 
                      : (product.image && product.image !== '/images/sample.jpg' ? optimizeImage(product.image, 800) : 'https://via.placeholder.com/600x600?text=ZAMIS+Print')
                  }
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/600x600?text=Imagen+No+Disponible'; }}
                  alt={product.name}
                  className={`w-full h-full object-cover pointer-events-none transition-all duration-500`}
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
                <img src={optimizeImage(product.image, 150)} alt="Principal" className="w-full h-full object-cover" />
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
                <img src={optimizeImage(imgUrl, 150)} alt={`Galería ${idx}`} className="w-full h-full object-cover" />
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
          {/* Breadcrumb Category */}
          {product.category && (
            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-400 mb-1">
              <span className="hover:text-neutral-900 cursor-pointer transition-colors">Catálogo</span>
              <span>/</span>
              <span className="text-brand-600">{product.category}</span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 leading-[1.1] tracking-tight">{product.name}</h1>

          {/* Rating */}
          <Rating value={product.rating} text={`${product.numReviews} reseñas verificadas`} />

          {/* Price */}
          <div className="mt-2">
            <PriceDisplay price={finalPrice} size="xl" />
            <p className="text-sm text-neutral-500 font-medium mt-1">IVA Incluido. Envío calculado en el checkout.</p>
          </div>

          {/* Description */}
          <p className="text-neutral-600 text-base leading-relaxed max-w-xl">{product.description}</p>

          <div className="w-full h-px bg-neutral-200/60 my-2" />

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-bold text-neutral-900 mb-3">Color: <span className="font-medium text-neutral-500">{selectedColor || 'Selecciona uno'}</span></h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map(colorName => {
                  const colorData = PRODUCT_COLORS.find(c => c.name === colorName);
                  if (!colorData) return null;
                  const isSelected = selectedColor === colorName;
                  
                  return (
                    <button
                      key={colorName}
                      onClick={() => setSelectedColor(colorName)}
                      className={`relative w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center ${isSelected ? 'ring-2 ring-offset-2 ring-brand-500 scale-110' : ''}`}
                      style={{ background: colorData.hex, borderColor: isSelected ? 'transparent' : '#e5e7eb' }}
                      title={colorName}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Personalization Options */}
          <div className="flex flex-col gap-6">
            {product.isCustomizable ? (
              <div className="bg-white border-2 border-brand-100 rounded-[2rem] p-6 sm:p-8 shadow-sm space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
                
                <div className="flex items-center gap-3 mb-2 relative z-10">
                  <span className="bg-brand-500 text-white text-[10px] font-black px-2.5 py-1 rounded-md tracking-widest uppercase">PRO</span>
                  <h3 className="text-lg font-bold text-neutral-900">Configurador Premium</h3>
                </div>

                {/* Step 1: Size */}
                <div className="relative z-10">
                  <label className="flex items-center gap-2 text-sm font-bold text-neutral-900 mb-3">
                    <span className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center text-xs text-neutral-500">1</span>
                    Tamaño de la Figura
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['15 cms', '20 cms'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => setCustomSize(opt)}
                        className={`relative py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all flex flex-col items-start gap-1 overflow-hidden ${
                          customSize === opt 
                            ? 'bg-brand-50 border-brand-500 text-brand-900 shadow-md ring-1 ring-brand-500/20' 
                            : 'bg-white border-neutral-200 text-neutral-600 hover:border-brand-300 hover:bg-neutral-50'
                        }`}
                      >
                        {customSize === opt && (
                          <div className="absolute top-0 right-0 w-0 h-0 border-t-[28px] border-l-[28px] border-t-brand-500 border-l-transparent">
                            <span className="absolute -top-[24px] -left-[14px] text-white text-[10px] font-bold">✓</span>
                          </div>
                        )}
                        <span>{opt}</span>
                        <span className={`text-[11px] font-medium ${customSize === opt ? 'text-brand-600' : 'text-neutral-400'}`}>
                          {opt === '15 cms' ? 'Incluido' : '+$20.000'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Text */}
                <div className="relative z-10">
                  <label className="flex items-center gap-2 text-sm font-bold text-neutral-900 mb-3">
                    <span className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center text-xs text-neutral-500">2</span>
                    Grabado Personalizado (+$10.000)
                  </label>
                  <input
                    type="text"
                    value={personalizationText}
                    onChange={(e) => setPersonalizationText(e.target.value.substring(0, 15))}
                    className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 bg-neutral-50 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all font-medium text-neutral-900 placeholder-neutral-400 outline-none"
                    placeholder="Ej: MAX (Máximo 15 letras)"
                  />
                </div>

                {/* Step 5: Typography & Color (Conditional based on text) */}
                {personalizationText && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-brand-200 pt-6 mt-2">
                    <div>
                      <label className="block text-sm font-bold text-neutral-900 mb-3">Estilo de Letra</label>
                      <select value={customFont} onChange={(e) => setCustomFont(e.target.value)} className="w-full border-2 border-neutral-200 rounded-xl px-4 py-2.5 bg-white text-sm font-semibold text-neutral-700 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none cursor-pointer transition-all">
                        <option value="Clásica">Clásica (Elegante)</option>
                        <option value="Divertida">Divertida (Estilo Cómic)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-neutral-900 mb-3">Color del Relieve</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {[
                          { name: 'Blanco', bg: 'bg-white', border: 'border-neutral-200' },
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
                            className={`w-9 h-9 rounded-full shadow-sm transition-all relative ${c.bg} ${c.border} ${customTextColor === c.name ? 'scale-110 ring-4 ring-brand-100 border-2 border-brand-500 z-10' : 'hover:scale-105 border opacity-80 hover:opacity-100'}`}
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
              <div className="bg-neutral-50 border border-neutral-100 p-8 rounded-2xl text-neutral-500 text-sm text-center">
                Todavía no hay opiniones. ¡Sé el primero en calificar este producto!
              </div>
            ) : (
              product.reviews.map((review) => (
                <div key={review._id} className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-neutral-900">{review.name}</span>
                    <Rating value={review.rating} />
                  </div>
                  <p className="text-neutral-600 text-sm leading-relaxed">{review.comment}</p>
                  <p className="text-xs font-semibold text-neutral-400 mt-4 uppercase tracking-wider">{review.createdAt?.substring(0, 10)}</p>
                </div>
              ))
            )}
          </div>

          {/* Write Review */}
          <div className="bg-neutral-50 border border-neutral-100 p-8 rounded-[2rem] h-fit">
            <h3 className="text-2xl font-bold mb-6 text-neutral-900">Escribe tu opinión</h3>

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
