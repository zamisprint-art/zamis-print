import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import CartDrawer from '../components/CartDrawer';

const StoreLayout = () => {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="min-h-[calc(100vh-64px)]">
        <Outlet />
      </main>
      {/* Public Store Footer */}
      <Footer />
      {/* Floating WhatsApp CTA */}
      <WhatsAppButton />
    </>
  );
};

export default StoreLayout;
