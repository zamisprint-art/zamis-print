import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const StoreLayout = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-64px)]">
        <Outlet />
      </main>
      {/* Public Store Footer can go here */}
      <footer className="border-t border-white/10 py-8 mt-12 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} ZAMIS Print. Todos los derechos reservados.</p>
      </footer>
    </>
  );
};

export default StoreLayout;
