import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/Alert';
import { staggerContainer } from '../design-system/tokens';

const SORT_OPTIONS = [
  { value: 'newest',    label: 'Más Recientes' },
  { value: 'price-asc', label: 'Precio: Menor a Mayor' },
  { value: 'price-desc', label: 'Precio: Mayor a Menor' },
  { value: 'rating',    label: 'Mejor Calificados' },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts]   = useState([]);
  const [filtered, setFiltered]   = useState([]);
  const [loading, setLoading]     = useState(true);
  
  // States derived from URL
  const querySearch = searchParams.get('q') || '';
  const queryCategory = searchParams.get('category') || 'All';
  const querySort = searchParams.get('sort') || 'newest';

  const [search, setSearch]       = useState(querySearch);
  const [category, setCategory]   = useState(queryCategory);
  const [sort, setSort]           = useState(querySort);

  // Sync state to URL without overriding immediately on load
  const updateUrl = (q, c, s) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (c && c !== 'All') params.set('category', c);
    if (s && s !== 'newest') params.set('sort', s);
    setSearchParams(params);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Sync internal state if URL changes externally (e.g., from Home search)
  useEffect(() => {
    setSearch(querySearch);
    setCategory(queryCategory);
    setSort(querySort);
  }, [querySearch, queryCategory, querySort]);

  // Extract unique categories from products
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['All', ...Array.from(cats)].filter(Boolean);
  }, [products]);

  // Filter + Sort Logic
  useEffect(() => {
    let result = [...products];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (category && category !== 'All') {
      result = result.filter(p => p.category === category);
    }

    // Sort
    if (sort === 'price-asc')  result.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sort === 'rating')     result.sort((a, b) => b.rating - a.rating);
    if (sort === 'newest')     result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFiltered(result);
  }, [search, category, sort, products]);

  // Handlers to update state and URL together
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    updateUrl(e.target.value, category, sort);
  };

  const handleCategoryChange = (c) => {
    setCategory(c);
    updateUrl(search, c, sort);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    updateUrl(search, category, e.target.value);
  };

  return (
    <div className="container-xl py-12">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <p className="text-brand-600 text-sm font-semibold uppercase tracking-widest mb-2">
            Catálogo
          </p>
          <h1 className="text-4xl font-extrabold text-neutral-900 leading-tight">
            {querySearch ? `Resultados para "${querySearch}"` : 'Todos los Productos'}
          </h1>
          <p className="text-neutral-500 mt-2 max-w-xl">
            Descubre nuestras creaciones de impresión 3D. Cada pieza puede ser adaptada a tus gustos.
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Buscar productos..."
              className="input-field pl-10 bg-white"
            />
          </div>
          <div className="relative w-full sm:w-auto">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            <select
              value={sort}
              onChange={handleSortChange}
              className="input-field pl-10 pr-8 appearance-none w-full sm:w-56 cursor-pointer bg-white"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Advanced Filters (Categories) */}
      {!loading && categories.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 mb-8 pb-6 border-b border-neutral-200">
          <span className="text-sm font-semibold text-neutral-600 mr-2">Filtrar por:</span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                category === cat 
                  ? 'bg-brand-500 text-white shadow-md' 
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:border-brand-300 hover:text-brand-600'
              }`}
            >
              {cat === 'All' ? 'Todos' : cat}
            </button>
          ))}
        </div>
      )}

      {/* Result count */}
      {!loading && (
        <p className="text-sm text-neutral-500 mb-6">
          {filtered.length} {filtered.length === 1 ? 'producto encontrado' : 'productos encontrados'}
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="w-8 h-8" />}
          title="Sin resultados"
          description={`No encontramos productos para "${search}". Intenta con otro término.`}
        />
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid-products"
        >
          {filtered.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Shop;
