import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, User } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

const Navbar = () => {
  const { cartItems } = useCartStore();

  return (
    <nav className="glass-panel sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ZAMIS Print
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className="hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">Inicio</Link>
              <Link to="/shop" className="hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">Tienda</Link>
              <Link to="/about" className="hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">Nosotros</Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 hover:text-primary transition-colors">
              <ShoppingCart size={24} />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </Link>
            <Link to="/profile" className="flex items-center gap-2 p-2 hover:text-primary transition-colors">
              <User size={24} />
              <span className="hidden sm:inline text-sm font-medium">Mi Cuenta</span>
            </Link>
            <div className="md:hidden flex items-center">
              <button className="mobile-menu-button p-2 hover:text-primary transition-colors">
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
