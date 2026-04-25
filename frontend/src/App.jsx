import { Routes, Route, Navigate } from 'react-router-dom';
import StoreLayout from './layouts/StoreLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import { useAuthStore } from './store/useAuthStore';

import CustomerLogin from './pages/CustomerLogin';
import MyAccount from './pages/MyAccount';

// Private Route Wrapper for Admin
const AdminRoute = ({ children }) => {
  const { userInfo } = useAuthStore();
  return userInfo && userInfo.isAdmin ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <Routes>
      {/* Public Store Layout */}
      <Route path="/" element={<StoreLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="login" element={<CustomerLogin />} />
        <Route path="profile" element={<MyAccount />} />
      </Route>

      {/* Admin Module Layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="login" element={<Login />} />
        <Route index element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
      </Route>
    </Routes>
  );
}

export default App;
