import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, Phone, Mail, Search, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/shop', label: 'Categorías' },
  { to: '/about', label: 'Nosotros' },
  { to: '/contact', label: 'Contacto' },
];

const Navbar = () => {
  const { cartItems, addItem, toggleDrawer } = useCartStore();
  const { userInfo } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);

  // Autocomplete state
  const [allProducts, setAllProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Obtenemos todos los productos para el autocompletado rápido local
        const { data } = await axios.get('/api/products?limit=all');
        setAllProducts(data.products || []);
      } catch (err) {
        console.error('Error fetching search products:', err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const q = searchQuery.toLowerCase();
      const results = allProducts.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q))
      ).slice(0, 5);
      setSearchResults(results);
      setShowDropdown(true);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [searchQuery, allProducts]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Detect scroll — compacta el navbar al bajar 60px
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = cartItems.reduce((a, c) => a + c.qty, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      searchRef.current?.blur();
    }
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full flex flex-col shadow-sm">

      {/* ── Top Ribbon (Fija) ── */}
      <div className="bg-neutral-900 text-neutral-50 text-xs overflow-hidden border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center h-10">
          {/* Contacto Izquierda */}
          <div className="hidden sm:flex items-center gap-5 shrink-0 z-10 bg-neutral-900 pr-4">
            <a href="mailto:info@zamisprint.com" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail size={12} /> info@zamisprint.com
            </a>
            <a href="tel:+573107878192" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone size={12} /> +57 310 787 8192
            </a>
          </div>

          {/* Marquee Centrado */}
          <div className="flex-1 overflow-hidden flex items-center group relative h-full [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] sm:[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
            <div className="flex whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused]">
              <div className="flex items-center justify-around w-max">
                <span className="font-semibold tracking-wide px-8 sm:px-16 text-neutral-300">✨ ¡Bienvenido a ZAMIS Print! • Transformando la imaginación en realidad 3D • Calidad premium en cada detalle ✨</span>
                <span className="font-semibold tracking-wide px-8 sm:px-16 text-neutral-300">✨ ¡Bienvenido a ZAMIS Print! • Transformando la imaginación en realidad 3D • Calidad premium en cada detalle ✨</span>
              </div>
              <div className="flex items-center justify-around w-max">
                <span className="font-semibold tracking-wide px-8 sm:px-16 text-neutral-300">✨ ¡Bienvenido a ZAMIS Print! • Transformando la imaginación en realidad 3D • Calidad premium en cada detalle ✨</span>
                <span className="font-semibold tracking-wide px-8 sm:px-16 text-neutral-300">✨ ¡Bienvenido a ZAMIS Print! • Transformando la imaginación en realidad 3D • Calidad premium en cada detalle ✨</span>
              </div>
            </div>
          </div>

          {/* Redes Derecha */}
          <div className="hidden sm:flex items-center gap-3 shrink-0 z-10 bg-neutral-900 pl-4">
            <span className="text-neutral-400">Síguenos:</span>
            <a href="https://www.instagram.com/zamis_print?igsh=MWZ0aTQ4ajYxeW1oZg==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-neutral-300 hover:text-white transition-colors group">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://www.facebook.com/share/1CVUHmRr9X/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-neutral-300 hover:text-white transition-colors group">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="https://www.tiktok.com/@zamis.print.oficial?_r=1&_t=ZS-96XFtfCgk7E" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-neutral-300 hover:text-white transition-colors group">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path><path d="M15 8v1a4 4 0 0 0 4 4"></path><line x1="15" x2="15" y1="3" y2="21"></line></svg>
            </a>
          </div>
        </div>
      </div>

      {/* ── Main Nav ── */}
      <nav className={`border-b transition-all duration-300 ${scrolled ? 'bg-white/85 backdrop-blur-md border-neutral-200/50 shadow-sm' : 'bg-white border-neutral-200 shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between gap-4 transition-all duration-300 ${scrolled ? 'h-14' : 'h-24'}`}>

            {/* Logo — se reduce al hacer scroll */}
            <div className="shrink-0">
              <Link to="/" className="flex items-center bg-white rounded-2xl p-1 shadow-sm shrink-0">
                <img
                  src="/images/logo-transparent.png"
                  alt="ZAMIS Print"
                  width="160"
                  height="80"
                  className={`w-auto object-contain rounded-xl transition-all duration-300 ${scrolled ? 'h-8 sm:h-10' : 'h-16 sm:h-20'}`}
                />
              </Link>
            </div>

            {/* Menú Desktop */}
            <div className="hidden lg:flex items-center gap-1 shrink-0">
              {NAV_LINKS.map(({ to, label }) => {
                const isActive = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${isActive
                        ? 'text-brand-700 bg-brand-50'
                        : 'text-neutral-600 hover:text-brand-600 hover:bg-neutral-50'
                      }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>

            {/* Barra de búsqueda (siempre visible en desktop) con Autocompletado */}
            <div ref={searchRef} className="flex-1 hidden md:flex flex-col justify-center max-w-md ml-auto mr-4 relative">
              <form onSubmit={handleSearch} className="w-full relative z-[60]">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                  onFocus={() => { if (searchQuery.length >= 2) setShowDropdown(true); }}
                  placeholder="Buscar..."
                  className="w-full h-10 pl-4 pr-12 rounded-xl border-2 border-neutral-200 bg-neutral-50 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-brand-500 focus:bg-white transition-all duration-200"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-10 w-12 flex items-center justify-center bg-brand-500 hover:bg-brand-600 text-white rounded-r-xl transition-colors"
                  aria-label="Buscar"
                >
                  <Search size={18} />
                </button>
              </form>

              {/* Autocomplete Dropdown */}
              <AnimatePresence>
                {showDropdown && searchQuery.length >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-12 left-0 w-full bg-white border border-neutral-200 rounded-xl shadow-2xl overflow-hidden z-[70]"
                  >
                    {searchResults.length > 0 ? (
                      <div className="flex flex-col">
                        {searchResults.map(product => (
                          <div
                            key={product._id}
                            className="flex items-center gap-3 p-3 hover:bg-neutral-50 border-b border-neutral-100 last:border-0 transition-colors cursor-pointer group"
                            onClick={() => {
                              navigate(`/product/${product._id}`);
                              setShowDropdown(false);
                              setSearchQuery('');
                            }}
                          >
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-neutral-900 truncate group-hover:text-brand-600 transition-colors">{product.name}</h4>
                              <p className="text-[10px] text-brand-500 font-semibold mt-0.5">
                                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(product.price)}
                              </p>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                if (product.isCustomizable || product.requiresTextPersonalization) {
                                  navigate(`/product/${product._id}`);
                                } else {
                                  addItem({
                                    product: product._id,
                                    name: product.name,
                                    image: product.image,
                                    price: product.price,
                                    countInStock: product.countInStock,
                                    qty: 1,
                                  });
                                }
                                setShowDropdown(false);
                                setSearchQuery('');
                              }}
                              className="p-1.5 rounded-lg bg-neutral-100 text-neutral-600 hover:bg-brand-500 hover:text-white transition-colors shrink-0"
                              title={product.isCustomizable ? 'Ver detalles' : 'Añadir al carrito'}
                              aria-label={product.isCustomizable ? 'Ver detalles' : 'Añadir al carrito'}
                            >
                              <ShoppingCart size={14} />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={handleSearch}
                          className="w-full py-3 bg-neutral-50 text-[11px] font-bold text-brand-600 hover:bg-brand-50 transition-colors text-center"
                        >
                          Ver todos los resultados para "{searchQuery}"
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-xs text-neutral-500">
                        No encontramos resultados para "{searchQuery}"
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Acciones derechas */}
            <div className="flex items-center justify-end gap-1 shrink-0">

              {/* Búsqueda móvil */}
              <button 
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)} 
                className="md:hidden p-2 rounded-lg text-neutral-600 hover:text-brand-600 hover:bg-neutral-50 transition-colors" 
                aria-label="Buscar"
              >
                {mobileSearchOpen ? <X size={22} className="text-brand-600" /> : <Search size={22} />}
              </button>

              {/* Carrito */}
              <button
                onClick={() => toggleDrawer(true)}
                className="relative p-2 rounded-lg text-neutral-600 hover:text-brand-600 hover:bg-neutral-50 transition-colors"
                aria-label="Abrir carrito"
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center text-xs font-bold text-white bg-brand-500 rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mi Cuenta — visible solo cuando NO se ha scrolleado (desktop) */}
              <AnimatePresence initial={false}>
                {!scrolled && (
                  <motion.div
                    key="account"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <Link to="/profile" className="hidden sm:flex items-center gap-2 p-2 rounded-lg text-neutral-600 hover:text-brand-600 hover:bg-neutral-50 transition-colors whitespace-nowrap">
                      <User size={22} />
                      <span className="text-sm font-semibold">{userInfo ? userInfo.name.split(' ')[0] : 'Mi Cuenta'}</span>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hamburger compacto — solo aparece al hacer scroll en desktop */}
              <AnimatePresence initial={false}>
                {scrolled && (
                  <motion.button
                    key="compact-menu"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="hidden sm:flex p-2 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors"
                    aria-label="Menú"
                  >
                    {isOpen ? <X size={22} /> : <Menu size={22} />}
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Hamburger móvil — siempre visible en móvil */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="sm:hidden p-2 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors"
                aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>


      </nav>

      {/* ── Barra de Búsqueda Móvil Desplegable ── */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col md:hidden"
          >
            <div className="p-4 flex items-center gap-3 border-b border-neutral-100 pt-safe">
              <button aria-label="Cerrar búsqueda" onClick={() => setMobileSearchOpen(false)} className="p-2 text-neutral-500 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors">
                <ChevronLeft size={24} />
              </button>
              <form onSubmit={(e) => { handleSearch(e); setMobileSearchOpen(false); }} className="flex-1 relative">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar figuras, impresiones..."
                  className="w-full h-12 pl-4 pr-12 rounded-xl bg-neutral-100 text-base focus:outline-none focus:bg-neutral-50 transition-all"
                  autoFocus
                />
                <button aria-label="Buscar" type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                  <Search size={20} />
                </button>
              </form>
            </div>
            
            <div className="flex-1 p-5 bg-surface-base overflow-y-auto">
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4">Búsquedas sugeridas</p>
              <div className="flex flex-wrap gap-2">
                {['Funkos', 'Llaveros', 'Decoración', 'Macetas', 'Soporte', 'Figuras'].map(tag => (
                  <button 
                    key={tag} 
                    onClick={() => { navigate(`/shop?q=${encodeURIComponent(tag)}`); setSearchQuery(''); setMobileSearchOpen(false); }} 
                    className="px-4 py-2 bg-white border border-neutral-200 shadow-sm rounded-full text-sm font-medium text-neutral-700 hover:border-brand-500 hover:text-brand-600 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Drawer (móvil + hamburger compacto de scroll) ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-6 border-b border-neutral-100">
                <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center bg-white rounded-2xl p-1 shadow-sm shrink-0">
                  <img src="/images/logo-transparent.png" alt="ZAMIS Print" width="150" height="80" className="h-16 w-auto object-contain rounded-xl" />
                </Link>
                <button aria-label="Cerrar menú" onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="px-4 py-3 border-b border-neutral-100">
                <form onSubmit={(e) => { handleSearch(e); setIsOpen(false); }} className="relative">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar productos..."
                    className="w-full h-10 pl-4 pr-12 rounded-xl border-2 border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:border-brand-500"
                  />
                  <button aria-label="Buscar productos" type="submit" className="absolute right-0 top-0 h-10 w-11 flex items-center justify-center bg-brand-500 text-white rounded-r-xl">
                    <Search size={16} />
                  </button>
                </form>
              </div>

              <nav className="flex-1 px-4 py-6 flex flex-col gap-1 overflow-y-auto">
                {NAV_LINKS.map(({ to, label }, i) => {
                  const isActive = location.pathname === to;
                  return (
                    <motion.div key={to} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                      <Link
                        to={to}
                        className={`flex items-center px-4 py-3 rounded-xl font-semibold text-base transition-colors ${isActive ? 'bg-brand-50 text-brand-700' : 'text-neutral-700 hover:bg-neutral-50 hover:text-brand-600'
                          }`}
                      >
                        {label}
                      </Link>
                    </motion.div>
                  );
                })}
                <div className="h-px bg-neutral-100 my-4" />
                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.28 }}>
                  <button
                    onClick={() => { setIsOpen(false); toggleDrawer(true); }}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-neutral-700 hover:bg-neutral-50 hover:text-brand-600 font-semibold transition-colors"
                  >
                    <span>Carrito</span>
                    {cartCount > 0 && <span className="w-6 h-6 flex items-center justify-center text-xs font-bold text-white bg-brand-500 rounded-full">{cartCount}</span>}
                  </button>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.34 }}>
                  <Link to="/profile" className="flex items-center px-4 py-3 rounded-xl text-neutral-700 hover:bg-neutral-50 hover:text-brand-600 font-semibold transition-colors">
                    {userInfo ? `Mi Perfil (${userInfo.name.split(' ')[0]})` : 'Mi Cuenta'}
                  </Link>
                </motion.div>
              </nav>

              <div className="px-6 py-5 border-t border-neutral-100 space-y-2">
                <a href="mailto:info@zamisprint.com" className="flex items-center gap-2 text-sm text-neutral-500 hover:text-brand-600 transition-colors">
                  <Mail size={14} /> info@zamisprint.com
                </a>
                <a href="tel:+573107878192" className="flex items-center gap-2 text-sm text-neutral-500 hover:text-brand-600 transition-colors">
                  <Phone size={14} /> +57 310 787 8192
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
