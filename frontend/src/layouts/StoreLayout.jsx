import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import CartDrawer from '../components/CartDrawer';
import MobileBottomNav from '../components/MobileBottomNav';

const StoreLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CartDrawer />
      <main className="flex-1 pt-[136px] pb-16 md:pb-0">
        <Outlet />
      </main>
      {/* Public Store Footer */}
      <Footer />
      {/* Floating WhatsApp CTA */}
      <WhatsAppButton />
      {/* Sticky Bottom Navigation for Mobile */}
      <MobileBottomNav />
    </div>
  );
};

export default StoreLayout;
