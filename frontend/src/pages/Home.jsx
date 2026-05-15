import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import HeroSlider from '../components/HeroSlider';
import { Skeleton, Button, EmptyState } from '../components/ui';
import { TrustBadges } from '../components/ecommerce';
import SEOHead from '../components/SEOHead';

const SectionSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="card p-4 h-full flex flex-col gap-4 border border-neutral-100">
        <Skeleton className="w-full aspect-[4/5] rounded-2xl" />
        <div className="space-y-3 mt-2">
          <Skeleton className="h-4 w-3/4 rounded-md" />
          <Skeleton className="h-3 w-full rounded-md" />
        </div>
      </div>
    ))}
  </div>
);

const Home = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products?limit=20'); // Solo necesitamos unos pocos para el home
        setAllProducts(data.products || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Derived sections
  const featured   = allProducts.filter(p => p.isFeatured).slice(0, 4);
  const newArrivals = allProducts.filter(p => p.isNewArrival).slice(0, 4);
  const onSale     = allProducts.filter(p => p.isOnSale && p.salePrice).slice(0, 4);
  // Fallback: if admin hasn't configured flags yet, show most recent
  const recentProducts = allProducts.slice(0, 4);

  const ProductGrid = ({ items, fallback }) => {
    const list = items.length > 0 ? items : fallback;
    if (list.length === 0) return null;
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {list.map((product, index) => (
          <motion.div key={product._id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.08 }} className="h-full">
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    );
  };

  const SectionHeader = ({ emoji, label, title, desc, linkTo, linkLabel }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
      <div>
        <span className="text-brand-600 text-sm font-bold uppercase tracking-widest">{emoji} {label}</span>
        <h2 className="text-3xl md:text-4xl font-extrabold mt-1">{title}</h2>
        {desc && <p className="text-neutral-500 mt-2 max-w-lg">{desc}</p>}
      </div>
      <Link to={linkTo} className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-brand-500 text-brand-600 font-bold hover:bg-brand-500 hover:text-white transition-all duration-200 text-sm group">
        {linkLabel} <span className="group-hover:translate-x-1 transition-transform">→</span>
      </Link>
    </motion.div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <SEOHead
        title="ZAMIS Print | Impresión 3D Personalizada en Colombia"
        description="Funkos, llaveros, esculturas y figuras 3D 100% personalizadas. Envíos a todo Colombia. Diseña tu regalo perfecto hoy."
      />
      {/* Hero Section */}
      <HeroSlider />

      {/* ⭐ Productos Destacados — El ancla de precio */}
      <section id="featured" className="py-20 px-4 max-w-7xl mx-auto w-full">
        <SectionHeader emoji="⭐" label="Lo Mejor de ZAMIS" title="Productos Destacados"
          desc="Seleccionados a mano por su calidad, originalidad y popularidad."
          linkTo="/shop?sort=best-selling" linkLabel="Ver Más Vendidos" />
        {loading ? <SectionSkeleton /> : <ProductGrid items={featured} fallback={recentProducts} />}
      </section>

      {/* 🏷️ Ofertas — El gancho emocional (2do para máxima conversión) */}
      {(loading || onSale.length > 0) && (
        <section className="py-20 px-4 max-w-7xl mx-auto w-full border-t border-red-100 bg-gradient-to-b from-red-50/40 to-transparent">
          <SectionHeader emoji="🏷️" label="Precios Especiales · Tiempo Limitado" title="Ofertas de Temporada"
            desc="Piezas premium a precios que no duran mucho. ¡No te quedes sin la tuya!"
            linkTo="/shop" linkLabel="Ver Todas las Ofertas" />
          {loading ? <SectionSkeleton /> : <ProductGrid items={onSale} fallback={[]} />}
        </section>
      )}

      {/* 🆕 Nuevas Llegadas — El FOMO al final */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full border-t border-neutral-100">
        <SectionHeader emoji="🆕" label="Recién Llegados" title="Novedades"
          desc="Las últimas creaciones salidas de nuestra impresora. ¡Sé de los primeros en tenerlas!"
          linkTo="/shop?sort=newest" linkLabel="Ver Todo lo Nuevo" />
        {loading ? <SectionSkeleton /> : <ProductGrid items={newArrivals} fallback={recentProducts} />}
      </section>
      
      {/* Value Proposition Section */}
      <section className="py-24 bg-surface-card/50 border-t border-neutral-100 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Por qué elegir ZAMIS Print?</h2>
            <div className="h-1 w-16 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 text-center mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-panel p-10 rounded-3xl group hover:border-primary/30 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-16 h-16 mx-auto bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:scale-110 group-hover:bg-primary/20 transition-transform">✨</div>
              <h3 className="text-2xl font-bold mb-4">Calidad Premium</h3>
              <p className="text-neutral-500">Usamos resina y PLA de la más alta calidad para asegurar detalles perfectos y durabilidad incomparable.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-panel p-10 rounded-3xl group hover:border-accent/30 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-16 h-16 mx-auto bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:scale-110 group-hover:bg-accent/20 transition-transform">🎨</div>
              <h3 className="text-2xl font-bold mb-4">100% Personalizable</h3>
              <p className="text-neutral-500">Desde colores hasta grabados de texto o modelos a medida. Tu imaginación es nuestro único límite.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="glass-panel p-10 rounded-3xl group hover:border-green-500/30 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-16 h-16 mx-auto bg-green-500/10 text-green-400 rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:scale-110 group-hover:bg-green-500/20 transition-transform">🚀</div>
              <h3 className="text-2xl font-bold mb-4">Envíos Rápidos</h3>
              <p className="text-neutral-500">Producimos y enviamos en tiempo récord a toda Colombia para que tengas tu pieza cuanto antes.</p>
            </motion.div>
          </div>

          <div className="max-w-4xl mx-auto">
            <TrustBadges variant="default" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
