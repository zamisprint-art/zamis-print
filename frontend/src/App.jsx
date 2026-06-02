import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import StoreLayout from './layouts/StoreLayout';
import AdminLayout from './layouts/AdminLayout';
import { useAuthStore } from './store/useAuthStore';
import { Toaster } from 'react-hot-toast';

// Lazy loaded pages for performance
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Refunds = lazy(() => import('./pages/Refunds'));
const Login = lazy(() => import('./pages/Login'));
const CustomerLogin = lazy(() => import('./pages/CustomerLogin'));
const MyAccount = lazy(() => import('./pages/MyAccount'));
const Maintenance = lazy(() => import('./pages/Maintenance'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
import { Toaster } from 'react-hot-toast';

// Private Route Wrapper for Admin
const AdminRoute = ({ children }) => {
  const { userInfo } = useAuthStore();
  return userInfo && userInfo.isAdmin ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  const isMaintenance = import.meta.env.VITE_MAINTENANCE_MODE === 'true';

  return (
    <>
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          className: 'glass-panel text-sm md:text-base font-medium',
          style: {
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(16px)',
            color: '#1f2937',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen bg-neutral-50">
          <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
        </div>
      }>
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
              <Route path="refunds" element={<Refunds />} />
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
      </Suspense>
    </>
  );
}
export default App;
