import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { LogOut, Shield } from 'lucide-react';
import axios from 'axios';

const AdminLayout = () => {
  const { userInfo, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/api/users/logout');
      logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force local logout even if server fails
      logout();
      navigate('/admin/login');
    }
  };

  return (
    <div className="min-h-screen bg-surface-base text-light flex flex-col">
      {/* Admin Topbar (only visible if logged in) */}
      {userInfo && userInfo.isAdmin && (
        <header className="bg-surface-card border-b border-neutral-200 px-6 py-4 flex justify-between items-center z-10 relative shadow-md">
          <div className="flex items-center gap-3">
            <Shield className="text-primary" size={24} />
            <h1 className="text-xl font-bold tracking-tight">ZAMIS Workspace</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-500">Admin: {userInfo.name}</span>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors"
            >
              <LogOut size={16} /> Salir
            </button>
          </div>
        </header>
      )}

      {/* Main Admin Content */}
      <main className="flex-1 flex flex-col relative">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
