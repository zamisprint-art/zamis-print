import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, Phone, Mail } from 'lucide-react';
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
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col">
      {/* Top Ribbon */}
      <div className="bg-neutral-100 border-b border-neutral-200 text-neutral-600 text-xs py-2 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href="mailto:hola@zamisprint.com" className="flex items-center gap-2 hover:text-brand-600 transition-colors">
              <Mail size={13} /> hola@zamisprint.com
            </a>
            <a href="tel:+573000000000" className="flex items-center gap-2 hover:text-brand-600 transition-colors">
              <Phone size={13} /> +57 300 000 0000
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-neutral-400">Síguenos en:</span>
            <a href="#" className="hover:text-brand-600 font-bold transition-colors">IG</a>
            <a href="#" className="hover:text-brand-600 font-bold transition-colors">FB</a>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="text-2xl font-black tracking-tight">
              <span className="text-neutral-900">ZAMIS</span><span className="text-brand-500">.</span><span className="text-neutral-700">Print</span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ to, label }) => {
                const isActive = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-neutral-600 hover:text-brand-600 hover:bg-neutral-50'
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
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
              <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
                <span className="text-xl font-black text-neutral-900">
                  ZAMIS<span className="text-brand-500">.</span>Print
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors"
                >
                  <X size={20} />
                </button>
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
                <a href="tel:+573000000000" className="flex items-center gap-2 text-sm text-neutral-500 hover:text-brand-600 transition-colors">
                  <Phone size={14} /> +57 300 000 0000
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
