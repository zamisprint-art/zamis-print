import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Paintbrush, PenTool, Zap } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import HeroSlider from '../components/HeroSlider';
import { Skeleton, Button, EmptyState } from '../components/ui';
import { TrustBadges } from '../components/ecommerce';
import SEOHead from '../components/SEOHead';
import { optimizeImage } from '../utils/cloudinary';

const SectionSkeleton = () => (
  <div className="flex gap-4 sm:gap-6 overflow-hidden pb-4 pt-2 px-4 sm:px-2 -mx-4 sm:-mx-2 relative items-stretch">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="w-[75vw] sm:w-[220px] lg:w-[240px] shrink-0 h-auto flex">
        <div className="card w-full p-4 flex flex-col gap-4 border border-neutral-100 rounded-2xl bg-white">
          <Skeleton className="w-full aspect-square rounded-2xl" />
          <div className="space-y-3 mt-2 flex-1">
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <Skeleton className="h-3 w-full rounded-md" />
          </div>
          <div className="pt-4 border-t border-neutral-100 mt-auto flex items-center justify-between">
            <Skeleton className="h-6 w-1/3 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const Home = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [homeSections, setHomeSections] = useState([]);
  const [categoryLinks, setCategoryLinks] = useState([]);
  const [customCta, setCustomCta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, secRes, catRes, ctaRes] = await Promise.all([
          axios.get('/api/products?limit=100'), // Necesitamos suficientes para llenar las categorías dinámicas
          axios.get('/api/homesections'),
          axios.get('/api/categorylinks'),
          axios.get('/api/customcta')
        ]);
        setAllProducts(prodRes.data.products || []);
        setHomeSections(secRes.data || []);
        setCategoryLinks(catRes.data.filter(link => link.isActive) || []);
        setCustomCta(ctaRes.data);
      } catch (error) {
        console.error('Error fetching data for Home:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Derived sections
  const featured = allProducts.filter(p => p.isFeatured && !p.requiresQuote).slice(0, 12);
  const newArrivals = allProducts.filter(p => p.isNewArrival && !p.requiresQuote).slice(0, 12);
  const onSale = allProducts.filter(p => p.isOnSale && p.salePrice && !p.requiresQuote).slice(0, 12);
  // Fallback: if admin hasn't configured flags yet, show most recent
  const recentProducts = allProducts.filter(p => !p.requiresQuote).slice(0, 12);

  const ProductCarousel = ({ items, fallback }) => {
    const list = items.length > 0 ? items : fallback;
    if (list.length === 0) return null;

    const scrollLeft = (e) => {
      e.currentTarget.parentElement.querySelector('.carousel-container').scrollBy({ left: -320, behavior: 'smooth' });
    };

    const scrollRight = (e) => {
      e.currentTarget.parentElement.querySelector('.carousel-container').scrollBy({ left: 320, behavior: 'smooth' });
    };

    return (
      <div className="relative group">
        {list.length > 4 && (
          <button aria-label="Slide anterior" onClick={scrollLeft} className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 md:-ml-6 z-10 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-2 md:p-3 rounded-full opacity-0 md:opacity-0 group-hover:opacity-100 transition-all text-neutral-600 hover:text-brand-600 hover:scale-110 disabled:opacity-0 border border-neutral-100 hidden sm:block">
            <ChevronLeft size={24} />
          </button>
        )}

        <div className="carousel-container flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-4 pt-2 px-4 sm:px-2 -mx-4 sm:-mx-2 hide-scrollbar scroll-smooth relative items-stretch">
          {list.map((product, index) => (
            <motion.div key={product._id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.08 }}
              className="w-[75vw] sm:w-[220px] lg:w-[240px] shrink-0 snap-start h-auto flex">
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {list.length > 4 && (
          <button aria-label="Slide siguiente" onClick={scrollRight} className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 md:-mr-6 z-10 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-2 md:p-3 rounded-full opacity-0 md:opacity-0 group-hover:opacity-100 transition-all text-neutral-600 hover:text-brand-600 hover:scale-110 disabled:opacity-0 border border-neutral-100 hidden sm:block">
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    );
  };

  const SectionHeader = ({ title, linkTo, linkLabel }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="flex items-center justify-between mb-6 px-2">
      <h2 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900">
        {title}
      </h2>
      <Link to={linkTo} className="shrink-0 text-xs md:text-sm font-semibold uppercase tracking-wider text-brand-600 hover:text-brand-700 transition-colors flex items-center gap-0.5 group pb-1 border-b border-transparent hover:border-brand-600/30">
        <span className="hidden sm:inline">{linkLabel}</span>
        <span className="sm:hidden">Ver más</span>
        <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </motion.div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <SEOHead
        title="ZAMIS Print | Impresión 3D Personalizada en Colombia"
        description="Funkos, llaveros, esculturas y figuras 3D 100% personalizadas. Envíos a todo Colombia. Diseña tu regalo perfecto hoy."
      />
      {/* 1. Hero Section */}
      <HeroSlider />

      {/* 2. Trust Badges (Compact, immediately after Hero) */}
      <div className="w-full bg-neutral-900 border-b border-neutral-800 text-white overflow-hidden py-3">
        <div className="max-w-7xl mx-auto px-4">
          <TrustBadges variant="compact" className="justify-center sm:justify-between text-xs sm:text-sm opacity-90" />
        </div>
      </div>

      {/* 3. Primer Carrusel (Lo Nuevo o Principal) */}
      <div className="w-full relative z-10 bg-white pt-10 pb-6">
        <section className="px-4 max-w-7xl mx-auto w-full">
          <SectionHeader title="Recién Salidos de la Impresora"
            linkTo="/shop?sort=newest" linkLabel="Ver Todo lo Nuevo" />
          <ProductCarousel items={newArrivals} fallback={recentProducts} />
        </section>
      </div>

      {/* 4. NUEVO: Categorías Bento Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold text-neutral-900 tracking-tight">Diseños por Colección</h2>
            <p className="text-neutral-500 mt-2 font-medium">Encuentra exactamente la temática que te apasiona.</p>
          </div>
          <Link to="/shop" className="text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 mt-4 md:mt-0 group">
            Ver catálogo completo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[240px]">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <Skeleton key={i} className={`rounded-3xl ${i === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`} />
            ))
          ) : categoryLinks.length > 0 ? (
            categoryLinks.slice(0, 5).map((link, i) => {
              const isLarge = i === 0; // Primer item ocupa más espacio en pantallas grandes
              return (
                <Link key={link._id} to={link.linkTo} 
                  className={`group relative overflow-hidden rounded-3xl isolate flex flex-col justify-end p-6 md:p-8 transition-transform duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-500/20
                    ${isLarge ? 'md:col-span-2 md:row-span-2' : 'col-span-1 row-span-1'}
                  `}>
                  
                  {/* Background Image */}
                  <div className="absolute inset-0 -z-10">
                    <img 
                      src={optimizeImage(link.image, isLarge ? 800 : 400)} 
                      alt={link.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1612815154858-60aa4c59abe6?q=80&w=800&auto=format&fit=crop' }} 
                    />
                  </div>
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 -z-10 transition-opacity duration-300
                    ${isLarge ? 'bg-gradient-to-t from-black/80 via-black/30 to-transparent' : 'bg-gradient-to-t from-black/80 to-black/10 group-hover:from-black/90'}
                  `}></div>

                  {/* Content */}
                  <div className="relative z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3 border border-white/10">Colección</span>
                    <h3 className={`font-bold text-white leading-tight ${isLarge ? 'text-3xl sm:text-4xl lg:text-5xl' : 'text-xl sm:text-2xl'}`} dangerouslySetInnerHTML={{ __html: link.title.replace('\\n', ' ') }}></h3>
                  </div>
                </Link>
              );
            })
          ) : (
            // Fallbacks si no hay categorias dinámicas configuradas
            <>
              <Link to="/shop?category=Figuras y Coleccionables" className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-3xl isolate flex flex-col justify-end p-6 md:p-8 transition-transform duration-500 hover:-translate-y-1 hover:shadow-2xl">
                <img src="https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 -z-10 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Figuras" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 bg-brand-500/80 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-widest mb-3">Popular</span>
                  <h3 className="font-bold text-white text-3xl md:text-5xl leading-tight">Figuras<br/>Coleccionables</h3>
                </div>
              </Link>

              <Link to="/shop?category=Hogar y Decoración" className="group relative overflow-hidden rounded-3xl isolate flex flex-col justify-end p-6 transition-transform duration-500 hover:-translate-y-1 hover:shadow-xl">
                <img src="https://images.unsplash.com/photo-1612815154858-60aa4c59abe6?q=80&w=400&auto=format&fit=crop" className="absolute inset-0 -z-10 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Hogar" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 to-black/10"></div>
                <div className="relative z-10 translate-y-2 group-hover:translate-y-0 transition-transform">
                  <h3 className="font-bold text-white text-2xl leading-tight">Decoración<br/>Hogar</h3>
                </div>
              </Link>

              <Link to="/shop?sort=newest" className="group relative overflow-hidden rounded-3xl isolate flex flex-col justify-end p-6 transition-transform duration-500 hover:-translate-y-1 hover:shadow-xl">
                <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-brand-600 to-orange-500"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
                <div className="relative z-10 translate-y-2 group-hover:translate-y-0 transition-transform">
                  <span className="text-3xl mb-2 block">✨</span>
                  <h3 className="font-bold text-white text-2xl leading-tight">Lo<br/>Nuevo</h3>
                </div>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* 5. Segundo Carrusel (Favoritos/Ofertas) */}
      <div className="w-full relative z-10 bg-neutral-50/50 pt-10 pb-16 border-t border-neutral-100">
        <section className="px-4 max-w-7xl mx-auto w-full">
          <SectionHeader title="Favoritos de la Comunidad"
            linkTo="/shop?sort=best-selling" linkLabel="Ver Más Vendidos" />
          <ProductCarousel items={featured} fallback={recentProducts} />
        </section>
      </div>

      {/* 6. NUEVO: Franja Inmersiva "Cotiza tu Idea" (Custom CTA) */}
      <section className="relative py-24 overflow-hidden isolate">
        <div className="absolute inset-0 -z-20 bg-neutral-900"></div>
        {/* Abstract glow */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-900/40 via-neutral-900 to-neutral-900"></div>
        
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12 lg:gap-24">
          <div className="w-full md:w-1/2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-300 text-sm font-bold uppercase tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
              {customCta?.badgeText || 'Servicio a Medida'}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
              {customCta?.title ? (
                <>
                  <span dangerouslySetInnerHTML={{ __html: customCta.title.split('<br/>')[0] }}></span>
                  {customCta.title.includes('<br/>') && (
                    <>
                      <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600" dangerouslySetInnerHTML={{ __html: customCta.title.split('<br/>').slice(1).join('<br/>') }}></span>
                    </>
                  )}
                </>
              ) : (
                <>¿Lo imaginas?<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">Nosotros lo imprimimos.</span></>
              )}
            </h2>
            <p className="text-lg text-neutral-400 mb-8 max-w-lg">
              {customCta?.description || 'Desde piezas de ingeniería hasta regalos únicos pintados a mano. Convierte tus ideas en plástico y resina de altísima calidad.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to={customCta?.buttonLink || "/contact"} className="w-full sm:w-auto">
                <Button variant="primary" className="h-14 px-8 text-lg font-bold shadow-brand-500/20 group flex items-center justify-center whitespace-nowrap w-full">
                  {customCta?.buttonText || 'Cotizar mi diseño'}
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 relative">
            {customCta?.images?.length === 5 ? (
              /* Asymmetric 5-Image Collage (CSS Grid) */
              <div className="grid grid-cols-3 grid-rows-3 gap-3 aspect-square w-full max-w-lg mx-auto relative z-10">
                {/* Center / Main Large Image */}
                <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden shadow-2xl shadow-brand-500/10 border border-white/5 group">
                  <img src={optimizeImage(customCta.images[0], 600)} alt="CTA 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                {/* Top Right Small */}
                <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden border border-white/5 group">
                  <img src={optimizeImage(customCta.images[1], 300)} alt="CTA 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                {/* Middle Right Small */}
                <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden border border-white/5 group">
                  <img src={optimizeImage(customCta.images[2], 300)} alt="CTA 3" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                {/* Bottom Left Small */}
                <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden border border-white/5 group">
                  <img src={optimizeImage(customCta.images[3], 300)} alt="CTA 4" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                {/* Bottom Middle/Right Wide */}
                <div className="col-span-2 row-span-1 rounded-2xl overflow-hidden border border-white/5 group">
                  <img src={optimizeImage(customCta.images[4], 500)} alt="CTA 5" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
            ) : (
              /* Fallback 1 Image (If 5 images are not uploaded) */
              <div className="relative w-full h-full">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-brand-500/10 border border-white/5 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1593376853899-fbb47a057fa0?q=80&w=1200&auto=format&fit=crop" 
                    alt="Impresión 3D trabajando" 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?q=80&w=1200&auto=format&fit=crop' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/20 to-transparent mix-blend-overlay"></div>
                </div>
                
                {/* Floating detail boxes (Only shown on single fallback image) */}
                <div className="absolute -bottom-6 -left-6 bg-neutral-800 border border-neutral-700 p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-float hidden sm:flex z-20">
                  <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center text-brand-400">
                    <Paintbrush size={24} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Pintado a Mano</p>
                    <p className="text-neutral-400 text-xs">Acabados Premium</p>
                  </div>
                </div>
                
                <div className="absolute -top-6 -right-6 bg-neutral-800 border border-neutral-700 p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-float hidden sm:flex z-20" style={{ animationDelay: '1s' }}>
                  <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center text-orange-400">
                    <Zap size={24} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Prototipado Rápido</p>
                    <p className="text-neutral-400 text-xs">Entrega en 48h</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. Value Proposition Section (Simplificada o mejorada visualmente) */}
      <section className="py-24 bg-surface-base relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">La Diferencia ZAMIS Print</h2>
            <div className="h-1 w-16 bg-primary mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-white p-10 rounded-3xl group hover:shadow-2xl hover:shadow-brand-500/5 border border-neutral-100 transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 mx-auto bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:scale-110 group-hover:bg-brand-100 transition-transform">✨</div>
              <h3 className="text-lg md:text-xl font-bold mb-2">Calidad Premium</h3>
              <p className="text-neutral-500 text-sm">Usamos resina y PLA de la más alta calidad para asegurar detalles perfectos y durabilidad incomparable.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="bg-white p-10 rounded-3xl group hover:shadow-2xl hover:shadow-accent/5 border border-neutral-100 transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 mx-auto bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:scale-110 group-hover:bg-accent/20 transition-transform">🎨</div>
              <h3 className="text-lg md:text-xl font-bold mb-2">100% Personalizable</h3>
              <p className="text-neutral-500 text-sm">Desde colores hasta grabados de texto o modelos a medida. Tu imaginación es nuestro único límite.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
              className="bg-white p-10 rounded-3xl group hover:shadow-2xl hover:shadow-green-500/5 border border-neutral-100 transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 mx-auto bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:scale-110 group-hover:bg-green-100 transition-transform">🚀</div>
              <h3 className="text-lg md:text-xl font-bold mb-2">Envíos Rápidos</h3>
              <p className="text-neutral-500 text-sm">Producimos y enviamos en tiempo récord a toda Colombia para que tengas tu pieza cuanto antes.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
