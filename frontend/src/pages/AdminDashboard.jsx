import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, ShoppingBag, PlusCircle, Settings, Edit, Trash2, X, Upload, ClipboardList, DollarSign } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import InventoryTab from '../components/admin/InventoryTab';
import BillingTab from '../components/admin/BillingTab';
import OrdersTab from '../components/admin/OrdersTab';
import ProductsTab from '../components/admin/ProductsTab';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const { userInfo } = useAuthStore();

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <div className="w-full md:w-64 flex flex-col gap-2">
        <div className="glass-panel p-6 rounded-2xl mb-4">
          <h2 className="text-xl font-bold mb-1">Panel Admin</h2>
          <p className="text-sm text-primary">ZAMIS Print</p>
        </div>
        
        <button 
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${activeTab === 'orders' ? 'bg-primary text-neutral-900' : 'glass-panel hover:bg-white/5'}`}
        >
          <ShoppingBag size={20} /> Órdenes
        </button>
        <button 
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${activeTab === 'products' ? 'bg-primary text-neutral-900' : 'glass-panel hover:bg-white/5'}`}
        >
          <Package size={20} /> Productos
        </button>
        <button 
          onClick={() => setActiveTab('inventario')}
          className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${activeTab === 'inventario' ? 'bg-primary text-neutral-900' : 'glass-panel hover:bg-white/5'}`}
        >
          <ClipboardList size={20} /> Inventario
        </button>
        <button 
          onClick={() => setActiveTab('cobros')}
          className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${activeTab === 'cobros' ? 'bg-primary text-neutral-900' : 'glass-panel hover:bg-white/5'}`}
        >
          <DollarSign size={20} /> Cobros
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-primary text-neutral-900' : 'glass-panel hover:bg-white/5'}`}
        >
          <Settings size={20} /> Configuración
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 glass-panel rounded-2xl p-6 md:p-8 min-h-[600px] relative">
        {activeTab === 'orders' && (
          <OrdersTab />
        )}

        {activeTab === 'inventario' && (
          <InventoryTab />
        )}

        {activeTab === 'cobros' && (
          <BillingTab />
        )}

        {activeTab === 'products' && (
          <ProductsTab />
        )}
        
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-2xl font-bold mb-8">Configuración Integraciones</h2>
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">MercadoPago Access Token</label>
                <input type="password" value="TEST-****************" disabled className="input-field opacity-50" />
                <p className="text-xs text-neutral-500 mt-1">Configurado vía variables de entorno (.env)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Resend API Key</label>
                <input type="password" value="re_****************" disabled className="input-field opacity-50" />
                <p className="text-xs text-neutral-500 mt-1">Configurado vía variables de entorno (.env)</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

