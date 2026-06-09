import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Search, CornerDownRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/Alert';
import { staggerContainer } from '../design-system/tokens';
import SEOHead from '../components/SEOHead';

const SORT_OPTIONS = [
  { value: 'newest',       label: 'Más Recientes' },
  { value: 'best-selling', label: '⭐ Más Vendidos' },
  { value: 'price-asc',   label: 'Precio: Menor a Mayor' },
  { value: 'price-desc',  label: 'Precio: Mayor a Menor' },
  { value: 'rating',      label: 'Mejor Calificados' },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts]   = useState([]);
  const [filtered, setFiltered]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  
  const querySearch = searchParams.get('q') || '';
  const queryCategory = searchParams.get('category') || 'All';
  const querySubcategory = searchParams.get('subcategory') || '';
  const querySort = searchParams.get('sort') || 'newest';
  const queryPersonalization = searchParams.get('personalization') || '';

  const [search, setSearch]       = useState(querySearch);
  const [category, setCategory]   = useState(queryCategory);
  const [subcategory, setSubcategory] = useState(querySubcategory);
  const [sort, setSort]           = useState(querySort);
  const [filterPersonalization, setFilterPersonalization] = useState(queryPersonalization);

  // Sync state to URL without overriding immediately on load
  const updateUrl = (q, c, sub, s, p) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (c && c !== 'All') params.set('category', c);
    if (sub) params.set('subcategory', sub);
    if (s && s !== 'newest') params.set('sort', s);
    if (p) params.set('personalization', p);
    setSearchParams(params);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products?limit=1000');
        setProducts(data.products || []);
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
    setSubcategory(querySubcategory);
    setSort(querySort);
    setFilterPersonalization(queryPersonalization);
  }, [querySearch, queryCategory, querySubcategory, querySort, queryPersonalization]);

  // Advanced filter states
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [filterMaterial, setFilterMaterial] = useState('');
  const [filterSize, setFilterSize] = useState('');
  const [showOnlyOffers, setShowOnlyOffers] = useState(false);

  // Extract unique categories and subcategories from products
  const categoryTree = useMemo(() => {
    const tree = { All: [] };
    products.forEach(p => {
      if (!p.category) return;
      if (!tree[p.category]) tree[p.category] = new Set();
      if (p.subcategory) tree[p.category].add(p.subcategory);
    });
    const formatted = Object.keys(tree).reduce((acc, cat) => {
      acc[cat] = Array.from(tree[cat] || []);
      return acc;
    }, {});
    return formatted;
  }, [products]);

  // Derived filter options from actual products
  const materialOptions = useMemo(() => [...new Set(products.map(p => p.material).filter(Boolean))], [products]);
  const sizeOptions = useMemo(() => [...new Set(products.map(p => p.size).filter(Boolean))], [products]);
  const maxPrice = useMemo(() => Math.max(...products.map(p => p.price), 1000), [products]);

  // Sincronizar el slider con el precio máximo real del sitio al cargar los productos
  useEffect(() => {
    if (maxPrice > 1000) {
      setPriceRange([0, maxPrice]);
    }
  }, [maxPrice]);

  // Filter + Sort Logic
  useEffect(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    }
    if (category && category !== 'All') {
      result = result.filter(p => p.category === category);
      if (subcategory) result = result.filter(p => p.subcategory === subcategory);
    }
    // Advanced filters
    result = result.filter(p => {
      const effectivePrice = p.isOnSale && p.salePrice ? p.salePrice : p.price;
      return effectivePrice >= priceRange[0] && effectivePrice <= priceRange[1];
    });
    if (filterMaterial) result = result.filter(p => p.material === filterMaterial);
    if (filterSize) result = result.filter(p => p.size === filterSize);
    if (filterPersonalization) {
      if (filterPersonalization === 'Estándar') {
        result = result.filter(p => !p.isCustomizable && !p.requiresQuote);
      } else if (filterPersonalization === 'Configurable') {
        result = result.filter(p => p.isCustomizable && !p.requiresQuote);
      } else if (filterPersonalization === 'Diseños Exclusivos') {
        result = result.filter(p => p.requiresQuote);
      }
    }
    if (showOnlyOffers) result = result.filter(p => p.isOnSale);

    if (sort === 'price-asc') {
      result.sort((a, b) => {
        if (a.requiresQuote && !b.requiresQuote) return 1;
        if (!a.requiresQuote && b.requiresQuote) return -1;
        return a.price - b.price;
      });
    }
    if (sort === 'price-desc') {
      result.sort((a, b) => {
        if (a.requiresQuote && !b.requiresQuote) return 1;
        if (!a.requiresQuote && b.requiresQuote) return -1;
        return b.price - a.price;
      });
    }
    if (sort === 'rating') {
      result.sort((a, b) => {
        if (a.requiresQuote && !b.requiresQuote) return 1;
        if (!a.requiresQuote && b.requiresQuote) return -1;
        return b.rating - a.rating;
      });
    }
    if (sort === 'newest') {
      result.sort((a, b) => {
        if (a.requiresQuote && !b.requiresQuote) return 1;
        if (!a.requiresQuote && b.requiresQuote) return -1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }
    if (sort === 'best-selling') {
      result.sort((a, b) => {
        if (a.requiresQuote && !b.requiresQuote) return 1;
        if (!a.requiresQuote && b.requiresQuote) return -1;
        return (b.totalSold || 0) - (a.totalSold || 0);
      });
    }

    setFiltered(result);
  }, [search, category, subcategory, sort, products, priceRange, filterMaterial, filterSize, filterPersonalization, showOnlyOffers]);

  const handleSearchChange = (e) => { setSearch(e.target.value); updateUrl(e.target.value, category, subcategory, sort, filterPersonalization); };
  const handleCategoryChange = (c) => { setCategory(c); setSubcategory(''); updateUrl(search, c, '', sort, filterPersonalization); };
  const handleSubcategoryChange = (sub) => { const newSub = subcategory === sub ? '' : sub; setSubcategory(newSub); updateUrl(search, category, newSub, sort, filterPersonalization); };
  const handleSortChange = (e) => { setSort(e.target.value); updateUrl(search, category, subcategory, e.target.value, filterPersonalization); };

  const activeFiltersCount = [filterMaterial, filterSize, filterPersonalization, showOnlyOffers ? 'offer' : ''].filter(Boolean).length;
  const resetAdvancedFilters = () => { setFilterMaterial(''); setFilterSize(''); setFilterPersonalization(''); setShowOnlyOffers(false); setPriceRange([0, maxPrice]); updateUrl(search, category, subcategory, sort, ''); };

  return (
    <div className="container-xl py-12">
      <SEOHead
        title="Tienda de Impresión 3D | ZAMIS Print"
        description="Explora todo nuestro catálogo: Funkos personalizados, llaveros, bustos, esculturas y más. Filtra por precio, material y personalización."
      />

      {/* Header Minimalista y Limpio */}
      <div className="mb-8 pb-6 border-b border-neutral-100 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2.5">
            <span className="w-8 h-1 bg-brand-500 rounded-full"></span>
            <span className="text-brand-600 text-xs font-bold uppercase tracking-[0.2em]">Catálogo</span>
          </div>
          <h1 className="text-xl md:text-2xl sm:text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
            {querySearch ? (
              <>Resultados para <span className="text-brand-500">"{querySearch}"</span></>
            ) : 'Todos los Productos'}
          </h1>
        </div>
        <p className="text-sm text-neutral-500 md:text-right font-medium mt-2 md:mt-0">
          Piezas 3D personalizables con acabados milimétricos.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start relative">
        
        {/* Mobile Backdrop */}
        {showFiltersMobile && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden"
            onClick={() => setShowFiltersMobile(false)}
          />
        )}

        {/* Left Sidebar (Filters) */}
        <div className={`
          fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white shadow-2xl z-[61] overflow-y-auto flex flex-col
          transform transition-transform duration-300 ease-in-out
          lg:static lg:h-auto lg:w-72 lg:max-w-none lg:bg-transparent lg:shadow-none lg:z-auto lg:overflow-visible lg:transform-none shrink-0
          ${showFiltersMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="lg:sticky lg:top-28 bg-surface-card p-6 lg:rounded-2xl lg:border lg:border-neutral-200 lg:shadow-sm flex flex-col gap-6">
            
            <div className="flex justify-between items-center lg:hidden mb-2">
              <h2 className="text-xl font-bold text-neutral-900">Filtros</h2>
              <button onClick={() => setShowFiltersMobile(false)} className="p-2 bg-neutral-100 rounded-full text-neutral-600">✕</button>
            </div>

            {/* Offer toggle */}
            <label className="flex items-center gap-3 cursor-pointer bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <input type="checkbox" checked={showOnlyOffers} onChange={e => setShowOnlyOffers(e.target.checked)} className="w-4 h-4 text-red-500 rounded" />
              <span className="text-sm font-bold text-red-600">🏷️ Solo Ofertas</span>
            </label>

            {/* Categories Filter */}
            {!loading && Object.keys(categoryTree).length > 1 && (
              <div>
                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-3">Categorías</h3>
                <div className="flex flex-col gap-2">
                  {Object.keys(categoryTree).map(cat => (
                    <div key={cat} className="flex flex-col">
                      <button
                        onClick={() => handleCategoryChange(cat)}
                        className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
                          category === cat ? 'bg-brand-50 text-brand-700 font-bold' : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                        }`}
                      >
                        {cat === 'All' ? 'Todas las Categorías' : cat}
                        {category === cat && <span className="w-2 h-2 rounded-full bg-brand-500"></span>}
                      </button>
                      {category === cat && categoryTree[cat].length > 0 && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                          className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-brand-100 pl-2 overflow-hidden">
                          {categoryTree[cat].map(sub => (
                            <button key={sub} onClick={() => handleSubcategoryChange(sub)}
                              className={`text-left flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                subcategory === sub ? 'bg-brand-100 text-brand-800 font-bold' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800'
                              }`}>
                              <CornerDownRight size={12} className={subcategory === sub ? 'text-brand-500' : 'text-neutral-400'} />
                              {sub}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range */}
            <div>
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-3">Precio</h3>
              <div className="space-y-2">
                <input type="range" min={0} max={maxPrice} step={5000}
                  value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full accent-brand-500"
                />
                <div className="flex justify-between text-xs text-neutral-500 font-medium">
                  <span>$0</span>
                  <span className="text-brand-600 font-bold">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(priceRange[1])}</span>
                </div>
              </div>
            </div>

            {/* Material Filter */}
            {materialOptions.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-3">Material</h3>
                <div className="flex flex-wrap gap-2">
                  {materialOptions.map(m => (
                    <button key={m} onClick={() => setFilterMaterial(filterMaterial === m ? '' : m)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                        filterMaterial === m ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-neutral-600 border-neutral-200 hover:border-brand-300'
                      }`}>{m}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Filter */}
            {sizeOptions.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-3">Tamaño</h3>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map(s => (
                    <button key={s} onClick={() => setFilterSize(filterSize === s ? '' : s)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                        filterSize === s ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-neutral-600 border-neutral-200 hover:border-brand-300'
                      }`}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Personalization Level */}
            <div>
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-3">Nivel de Compra</h3>
              <div className="flex flex-col gap-1.5">
                {['Estándar', 'Configurable', 'Diseños Exclusivos'].map(lvl => (
                  <button key={lvl} onClick={() => {
                      const newLvl = filterPersonalization === lvl ? '' : lvl;
                      setFilterPersonalization(newLvl);
                      updateUrl(search, category, subcategory, sort, newLvl);
                    }}
                    className={`text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
                      filterPersonalization === lvl ? 'bg-brand-50 text-brand-700 font-bold' : 'text-neutral-600 hover:bg-neutral-50'
                    }`}>
                    {lvl}
                    {filterPersonalization === lvl && <span className="w-2 h-2 rounded-full bg-brand-500"></span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Filters */}
            {activeFiltersCount > 0 && (
              <button onClick={resetAdvancedFilters}
                className="w-full py-2 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-red-500 hover:border-red-200 transition-all">
                ✕ Limpiar filtros ({activeFiltersCount})
              </button>
            )}
          </div>

          {/* Mobile Sticky Footer */}
          <div className="sticky bottom-0 left-0 w-full p-4 bg-white border-t border-neutral-200 lg:hidden z-10 mt-auto shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
            <button 
              onClick={() => setShowFiltersMobile(false)} 
              className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold transition-colors"
            >
              Ver {filtered.length} Resultados
            </button>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 w-full">
          {/* Top Bar: Count & Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            
            <div className="flex items-center justify-between w-full sm:w-auto">
              {!loading && (
                <p className="text-sm font-medium text-neutral-500">
                  Mostrando <span className="text-neutral-900 font-bold">{filtered.length}</span> {filtered.length === 1 ? 'producto' : 'productos'}
                </p>
              )}
              
              <button 
                onClick={() => setShowFiltersMobile(true)}
                className="lg:hidden flex items-center gap-2 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm font-bold text-neutral-700 transition-colors"
              >
                <SlidersHorizontal size={16} />
                Filtros
                {activeFiltersCount > 0 && (
                  <span className="bg-brand-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px] ml-1">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
            
            <div className="relative w-full sm:w-56 ml-auto">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              <select
                value={sort}
                onChange={handleSortChange}
                className="input-field pl-10 pr-8 appearance-none w-full cursor-pointer bg-white text-sm"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <ProductGridSkeleton count={6} />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Search className="w-8 h-8" />}
              title="Sin resultados"
              description={`No encontramos productos para tu búsqueda actual. Intenta con otros filtros.`}
            />
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
            >
              {filtered.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
