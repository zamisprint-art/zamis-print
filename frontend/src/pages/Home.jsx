import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import HeroSlider from '../components/HeroSlider';

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
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">Explora nuestras últimas creaciones. Cada pieza es única y puede ser adaptada a tus gustos exactos.</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
          <div className="text-center text-gray-500 py-10">
            No hay productos disponibles por ahora.
          </div>
        )}

        <div className="text-center mt-16">
          <Link to="/shop" className="inline-flex items-center gap-2 text-primary hover:text-white font-bold text-lg transition-colors group">
            Ver Todos los Productos 
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </section>
      
      {/* Value Proposition Section */}
      <section className="py-24 bg-dark/50 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-panel p-8 rounded-3xl"
            >
              <div className="w-16 h-16 mx-auto bg-primary/20 text-primary rounded-2xl flex items-center justify-center mb-6 text-2xl">✨</div>
              <h3 className="text-2xl font-bold mb-4">Calidad Premium</h3>
              <p className="text-gray-400">Usamos resina y PLA de la más alta calidad para asegurar detalles perfectos y durabilidad.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-panel p-8 rounded-3xl"
            >
              <div className="w-16 h-16 mx-auto bg-accent/20 text-accent rounded-2xl flex items-center justify-center mb-6 text-2xl">🎨</div>
              <h3 className="text-2xl font-bold mb-4">100% Personalizable</h3>
              <p className="text-gray-400">Desde colores hasta grabados de texto. Tu imaginación es el único límite.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="glass-panel p-8 rounded-3xl"
            >
              <div className="w-16 h-16 mx-auto bg-green-500/20 text-green-400 rounded-2xl flex items-center justify-center mb-6 text-2xl">🚀</div>
              <h3 className="text-2xl font-bold mb-4">Envíos Rápidos</h3>
              <p className="text-gray-400">Producimos y enviamos en tiempo récord para que tengas tu pieza cuanto antes.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
