import { Routes, Route, Navigate } from 'react-router-dom';
import StoreLayout from './layouts/StoreLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import OrderSuccess from './pages/OrderSuccess';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Login from './pages/Login';
import { useAuthStore } from './store/useAuthStore';

import CustomerLogin from './pages/CustomerLogin';
import MyAccount from './pages/MyAccount';
import Maintenance from './pages/Maintenance';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Private Route Wrapper for Admin
const AdminRoute = ({ children }) => {
  const { userInfo } = useAuthStore();
  return userInfo && userInfo.isAdmin ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  const isMaintenance = import.meta.env.VITE_MAINTENANCE_MODE === 'true';

  return (
    <Routes>
      {/* Public Store Layout */}
      <Route path="/" element={isMaintenance ? <Maintenance /> : <StoreLayout />}>
        {!isMaintenance && (
          <>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="order/:id" element={<OrderSuccess />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="terms" element={<Terms />} />
            <Route path="login" element={<CustomerLogin />} />
            <Route path="profile" element={<MyAccount />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
          </>
        )}
      </Route>

      {/* Admin Module Layout - Always accessible even in maintenance */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="login" element={<Login />} />
        <Route index element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
      </Route>
      
      {/* Catch-all during maintenance */}
      {isMaintenance && <Route path="*" element={<Navigate to="/" replace />} />}
    </Routes>
  );
}
export default App;
