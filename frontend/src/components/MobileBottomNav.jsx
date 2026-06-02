import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

const MobileBottomNav = () => {
  const location = useLocation();
  const { cartItems } = useCartStore();
  
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const navItems = [
    { name: 'Inicio', path: '/', icon: Home },
    { name: 'Catálogo', path: '/shop', icon: ShoppingBag },
    { name: 'Carrito', path: '/cart', icon: ShoppingCart, badge: cartCount },
    { name: 'Perfil', path: '/profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-neutral-200 z-50 pb-safe">
      <nav className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path === '/shop' && location.pathname.startsWith('/product/'));
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`relative flex flex-col items-center justify-center w-16 h-full transition-colors ${
                isActive ? 'text-brand-600' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <div className="relative mb-1">
                <Icon size={22} className={isActive ? 'fill-brand-50 stroke-brand-600 stroke-[2.5px]' : 'stroke-2'} />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full shadow-sm animate-in zoom-in">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileBottomNav;
