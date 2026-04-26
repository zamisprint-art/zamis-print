import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import HeroSlider from '../components/HeroSlider';
import { Skeleton, Button, EmptyState } from '../components/ui';
import { TrustBadges } from '../components/ecommerce';
import GlobalSearchBar from '../components/GlobalSearchBar';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        // Get only the first 3 products for the featured section
        setProducts(data.slice(0, 3));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSlider />

      {/* Floating Search Bar */}
      <GlobalSearchBar />

      {/* Featured Products Section */}
      <section id="featured" className="py-24 px-4 max-w-7xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Recién Salidos de la Impresora</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-6"></div>
          <p className="text-neutral-500 max-w-2xl mx-auto text-lg">Explora nuestras últimas creaciones. Cada pieza es única y puede ser adaptada a tus gustos exactos.</p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-4 h-full flex flex-col gap-4 border border-neutral-100">
                <Skeleton className="w-full aspect-square rounded-2xl" />
                <div className="space-y-3 mt-2">
                  <Skeleton className="h-6 w-3/4 rounded-md" />
                  <Skeleton className="h-4 w-full rounded-md" />
                </div>
                <div className="mt-auto flex justify-between items-center pt-4">
                  <Skeleton className="h-8 w-24 rounded-lg" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
        
        {!loading && products.length === 0 && (
          <EmptyState 
            title="Sin productos disponibles"
            description="Actualmente no hay productos destacados, pero vuelve pronto para ver novedades."
            icon="📦"
          />
        )}

        {!loading && products.length > 0 && (
          <div className="text-center mt-16">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-brand-500 text-brand-600 font-bold hover:bg-brand-500 hover:text-white transition-all duration-200 group"
            >
              Ver Todos los Productos
              <span className="inline-block transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        )}
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
