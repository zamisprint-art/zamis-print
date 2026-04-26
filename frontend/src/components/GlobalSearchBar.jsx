import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

const GlobalSearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="max-w-3xl mx-auto -mt-8 relative z-30 px-4"
    >
      <form 
        onSubmit={handleSearch} 
        className="bg-white p-2 rounded-2xl shadow-xl flex items-center gap-2 border border-neutral-100"
      >
        <div className="flex-1 relative flex items-center pl-4">
          <Search className="w-6 h-6 text-brand-500 absolute left-4" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="¿Qué estás buscando hoy? (ej. Figura de dragón, maceta)"
            className="w-full py-4 pl-12 pr-4 bg-transparent outline-none text-neutral-900 text-lg placeholder-neutral-400 font-medium"
          />
        </div>
        <button 
          type="submit" 
          className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-xl font-bold transition-colors shadow-md"
        >
          Buscar
        </button>
      </form>
    </motion.div>
  );
};

export default GlobalSearchBar;
