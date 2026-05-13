import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, UserCheck, UserX, ShoppingBag, DollarSign, Phone, Mail, MapPin, ChevronDown, ChevronUp, Search } from 'lucide-react';

const fmt = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

const statusColors = {
  'Pendiente':     'bg-yellow-100 text-yellow-700',
  'Pagado':        'bg-blue-100 text-blue-700',
  'En Producción': 'bg-purple-100 text-purple-700',
  'Enviado':       'bg-green-100 text-green-700',
  'Entregado':     'bg-teal-100 text-teal-700',
  'Cancelado':     'bg-red-100 text-red-700',
};

// ── Registered User Row ──────────────────────────────────────────────────────
const RegisteredRow = ({ user }) => (
  <tr className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
    <td className="py-4 px-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-sm shrink-0">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-neutral-900 text-sm">{user.name}</p>
          <p className="text-xs text-neutral-500 flex items-center gap-1">
            <Mail size={10} /> {user.email}
          </p>
        </div>
      </div>
    </td>
    <td className="py-4 px-5 text-sm text-neutral-600">{new Date(user.createdAt).toLocaleDateString('es-CO')}</td>
    <td className="py-4 px-5 text-center">
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700">
        <ShoppingBag size={11} /> {user.orderCount}
      </span>
    </td>
    <td className="py-4 px-5 font-bold text-neutral-900 text-sm">{fmt(user.totalSpent)}</td>
    <td className="py-4 px-5 text-xs text-neutral-500">
      {user.lastOrderDate ? new Date(user.lastOrderDate).toLocaleDateString('es-CO') : '—'}
    </td>
  </tr>
);

// ── Anonymous Buyer Row ──────────────────────────────────────────────────────
const AnonymousRow = ({ buyer }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <tr className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <td className="py-4 px-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-neutral-200 text-neutral-500 flex items-center justify-center font-bold text-sm shrink-0">
              {buyer.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-neutral-900 text-sm">{buyer.name}</p>
              <p className="text-xs text-neutral-500 flex items-center gap-1">
                <Phone size={10} /> {buyer.phone}
              </p>
            </div>
          </div>
        </td>
        <td className="py-4 px-5 text-sm text-neutral-600">
          <span className="flex items-center gap-1">
            <MapPin size={11} className="text-neutral-400" /> {buyer.city}
          </span>
        </td>
        <td className="py-4 px-5 text-sm text-neutral-500">{buyer.email !== '—' ? buyer.email : '—'}</td>
        <td className="py-4 px-5 text-center">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-600">
            <ShoppingBag size={11} /> {buyer.orderCount}
          </span>
        </td>
        <td className="py-4 px-5 font-bold text-neutral-900 text-sm">{fmt(buyer.totalSpent)}</td>
        <td className="py-4 px-5 text-neutral-400">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={6} className="px-5 pb-4 bg-neutral-50/60">
            <div className="rounded-xl border border-neutral-100 overflow-hidden mt-1">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-neutral-100 text-neutral-500">
                    <th className="py-2 px-4 text-left font-semibold">ID Orden</th>
                    <th className="py-2 px-4 text-left font-semibold">Fecha</th>
                    <th className="py-2 px-4 text-left font-semibold">Total</th>
                    <th className="py-2 px-4 text-left font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {buyer.orders.map(o => (
                    <tr key={o._id} className="border-t border-neutral-100">
                      <td className="py-2 px-4 font-mono text-neutral-500">#{String(o._id).substring(0, 8).toUpperCase()}</td>
                      <td className="py-2 px-4">{new Date(o.createdAt).toLocaleDateString('es-CO')}</td>
                      <td className="py-2 px-4 font-bold text-neutral-900">{fmt(o.totalPrice)}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold ${statusColors[o.orderStatus] || 'bg-neutral-100 text-neutral-600'}`}>
                          {o.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const CustomersTab = () => {
  const [tab, setTab] = useState('registered'); // 'registered' | 'anonymous'
  const [registered, setRegistered] = useState([]);
  const [anonymous, setAnonymous] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [regRes, anonRes] = await Promise.all([
          axios.get('/api/users/admin'),
          axios.get('/api/users/admin/anonymous'),
        ]);
        setRegistered(regRes.data);
        setAnonymous(anonRes.data);
      } catch (err) {
        console.error('Error cargando clientes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filteredReg = registered.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredAnon = anonymous.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.phone.includes(search) ||
    b.city.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevReg  = registered.reduce((a, u) => a + u.totalSpent, 0);
  const totalRevAnon = anonymous.reduce((a, b) => a + b.totalSpent, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-neutral-900">Clientes</h2>
          <p className="text-sm text-neutral-500 mt-1">
            {registered.length} registrados · {anonymous.length} compradores anónimos
          </p>
        </div>
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-3 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, email, teléfono..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-neutral-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-brand-500 mb-2"><UserCheck size={18} /><span className="text-xs font-bold text-neutral-500">Registrados</span></div>
          <p className="text-2xl font-extrabold text-neutral-900">{registered.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-neutral-400 mb-2"><UserX size={18} /><span className="text-xs font-bold text-neutral-500">Anónimos</span></div>
          <p className="text-2xl font-extrabold text-neutral-900">{anonymous.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-green-500 mb-2"><DollarSign size={18} /><span className="text-xs font-bold text-neutral-500">Ingresos registrados</span></div>
          <p className="text-lg font-extrabold text-neutral-900">{fmt(totalRevReg)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-orange-400 mb-2"><DollarSign size={18} /><span className="text-xs font-bold text-neutral-500">Ingresos anónimos</span></div>
          <p className="text-lg font-extrabold text-neutral-900">{fmt(totalRevAnon)}</p>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex rounded-xl overflow-hidden border border-neutral-200 mb-5 w-fit">
        <button
          onClick={() => setTab('registered')}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold transition-colors ${tab === 'registered' ? 'bg-brand-500 text-white' : 'bg-white text-neutral-500 hover:bg-neutral-50'}`}
        >
          <UserCheck size={15} /> Registrados ({filteredReg.length})
        </button>
        <button
          onClick={() => setTab('anonymous')}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold transition-colors ${tab === 'anonymous' ? 'bg-brand-500 text-white' : 'bg-white text-neutral-500 hover:bg-neutral-50'}`}
        >
          <UserX size={15} /> Anónimos ({filteredAnon.length})
        </button>
      </div>

      {/* Tables */}
      {loading ? (
        <div className="flex justify-center items-center h-40 text-neutral-500">Cargando clientes...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          {tab === 'registered' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/60 text-neutral-500 text-xs">
                    <th className="py-3 px-5 text-left font-semibold">Cliente</th>
                    <th className="py-3 px-5 text-left font-semibold">Registro</th>
                    <th className="py-3 px-5 text-center font-semibold">Órdenes</th>
                    <th className="py-3 px-5 text-left font-semibold">Total gastado</th>
                    <th className="py-3 px-5 text-left font-semibold">Última compra</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReg.map(u => <RegisteredRow key={u._id} user={u} />)}
                  {filteredReg.length === 0 && (
                    <tr><td colSpan={5} className="py-10 text-center text-neutral-400">No se encontraron usuarios registrados</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[650px]">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/60 text-neutral-500 text-xs">
                    <th className="py-3 px-5 text-left font-semibold">Comprador</th>
                    <th className="py-3 px-5 text-left font-semibold">Ciudad</th>
                    <th className="py-3 px-5 text-left font-semibold">Email (MercadoPago)</th>
                    <th className="py-3 px-5 text-center font-semibold">Órdenes</th>
                    <th className="py-3 px-5 text-left font-semibold">Total gastado</th>
                    <th className="py-3 px-5 text-left font-semibold"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAnon.map(b => <AnonymousRow key={b.key} buyer={b} />)}
                  {filteredAnon.length === 0 && (
                    <tr><td colSpan={6} className="py-10 text-center text-neutral-400">No hay compradores anónimos aún</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomersTab;
