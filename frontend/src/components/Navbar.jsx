import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, Phone, Mail, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

const NAV_LINKS = [
  { to: '/',        label: 'Inicio' },
  { to: '/shop',    label: 'Tienda' },
  { to: '/about',   label: 'Nosotros' },
  { to: '/contact', label: 'Contacto' },
];

const Navbar = () => {
  const { cartItems } = useCartStore();
  const { userInfo } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const cartCount = cartItems.reduce((a, c) => a + c.qty, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      searchRef.current?.blur();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col">
      {/* Top Ribbon */}
      <div className="bg-brand-600 text-brand-50 text-xs py-2 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href="mailto:hola@zamisprint.com" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail size={13} /> hola@zamisprint.com
            </a>
            <a href="tel:+573107878192" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone size={13} /> +57 310 787 8192
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-brand-200">Síguenos en:</span>
            <a href="#" className="hover:text-white font-bold transition-colors">IG</a>
            <a href="#" className="hover:text-white font-bold transition-colors">FB</a>
          </div>
        </div>
      </div>

      {/* Main Nav — Logo | Search | Actions */}
      <nav className="bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24 gap-4">

            {/* Logo */}
            <div className="flex-1 shrink-0 flex justify-start">
              <Link to="/" className="flex items-center">
                <img src="/images/logo.png" alt="ZAMIS Print" className="h-16 sm:h-20 w-auto object-contain" />
              </Link>
            </div>

            {/* Search Bar — centered */}
            <form onSubmit={handleSearch} className="flex-1 hidden sm:flex items-center justify-center max-w-lg mx-auto">
              <div className="relative w-full">
                <input
                  ref={searchRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar productos..."
                  className="w-full h-10 pl-4 pr-12 rounded-xl border-2 border-neutral-200 bg-neutral-50 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-brand-500 focus:bg-white transition-all duration-200"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-10 w-12 flex items-center justify-center bg-brand-500 hover:bg-brand-600 text-white rounded-r-xl transition-colors"
                  aria-label="Buscar"
                >
                  <Search size={18} />
                </button>
              </div>
            </form>

            {/* Right Actions */}
            <div className="flex-1 flex items-center justify-end gap-1 shrink-0">
              {/* Mobile: search icon goes to /shop */}
              <Link
                to="/shop"
                className="sm:hidden p-2 rounded-lg text-neutral-600 hover:text-brand-600 hover:bg-neutral-50 transition-colors"
                aria-label="Buscar"
              >
                <Search size={22} />
              </Link>

              {/* Cart */}
              <Link to="/cart" className="relative p-2 rounded-lg text-neutral-600 hover:text-brand-600 hover:bg-neutral-50 transition-colors">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center text-xs font-bold text-white bg-brand-500 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Account */}
              <Link to="/profile" className="hidden sm:flex items-center gap-2 p-2 rounded-lg text-neutral-600 hover:text-brand-600 hover:bg-neutral-50 transition-colors">
                <User size={22} />
                <span className="text-sm font-semibold">{userInfo ? userInfo.name.split(' ')[0] : 'Mi Cuenta'}</span>
              </Link>

              {/* Hamburger (Mobile only) */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors"
                aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Nav — Category Links (Desktop only) */}
        <div className="hidden md:block border-t border-neutral-100 bg-neutral-50/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1 h-10">
              {NAV_LINKS.map(({ to, label }) => {
                const isActive = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`px-4 py-1 rounded-lg text-sm font-semibold transition-colors ${
                      isActive
                        ? 'text-brand-700 bg-brand-50'
                        : 'text-neutral-500 hover:text-brand-600 hover:bg-neutral-100'
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Slide-in Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-6 border-b border-neutral-100">
                <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center">
                  <img src="/images/logo.png" alt="ZAMIS Print" className="h-16 w-auto object-contain" />
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="px-4 py-3 border-b border-neutral-100">
                <form onSubmit={(e) => { handleSearch(e); setIsOpen(false); }} className="relative">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar productos..."
                    className="w-full h-10 pl-4 pr-12 rounded-xl border-2 border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:border-brand-500"
                  />
                  <button type="submit" className="absolute right-0 top-0 h-10 w-11 flex items-center justify-center bg-brand-500 text-white rounded-r-xl">
                    <Search size={16} />
                  </button>
                </form>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 px-4 py-6 flex flex-col gap-1 overflow-y-auto">
                {NAV_LINKS.map(({ to, label }, i) => {
                  const isActive = location.pathname === to;
                  return (
                    <motion.div
                      key={to}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <Link
                        to={to}
                        className={`flex items-center px-4 py-3 rounded-xl font-semibold text-base transition-colors ${
                          isActive
                            ? 'bg-brand-50 text-brand-700'
                            : 'text-neutral-700 hover:bg-neutral-50 hover:text-brand-600'
                        }`}
                      >
                        {label}
                      </Link>
                    </motion.div>
                  );
                })}

                <div className="h-px bg-neutral-100 my-4" />

                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.28 }}>
                  <Link to="/cart" className="flex items-center justify-between px-4 py-3 rounded-xl text-neutral-700 hover:bg-neutral-50 hover:text-brand-600 font-semibold transition-colors">
                    <span>Carrito</span>
                    {cartCount > 0 && (
                      <span className="w-6 h-6 flex items-center justify-center text-xs font-bold text-white bg-brand-500 rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.34 }}>
                  <Link to="/profile" className="flex items-center px-4 py-3 rounded-xl text-neutral-700 hover:bg-neutral-50 hover:text-brand-600 font-semibold transition-colors">
                    {userInfo ? `Mi Perfil (${userInfo.name.split(' ')[0]})` : 'Mi Cuenta'}
                  </Link>
                </motion.div>
              </nav>

              {/* Drawer Footer */}
              <div className="px-6 py-5 border-t border-neutral-100 space-y-2">
                <a href="mailto:hola@zamisprint.com" className="flex items-center gap-2 text-sm text-neutral-500 hover:text-brand-600 transition-colors">
                  <Mail size={14} /> hola@zamisprint.com
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
