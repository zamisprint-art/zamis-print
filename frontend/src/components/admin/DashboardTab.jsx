import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  DollarSign, ShoppingBag, Package, TrendingUp,
  ArrowUp, ArrowDown, Clock, CheckCircle2, Truck, AlertCircle
} from 'lucide-react';

// ─── Mini Bar Chart (sin dependencias externas) ───────────────────────────────
const BarChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  const maxVal = Math.max(...data.map(d => d.total), 1);
  return (
    <div className="flex items-end gap-1.5 h-32 w-full">
      {data.map((d, i) => {
        const heightPct = Math.max(4, (d.total / maxVal) * 100);
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
            {/* Tooltip */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
              {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(d.total)}
            </div>
            <div
              className="w-full rounded-t-lg bg-brand-500 hover:bg-brand-600 transition-all duration-500 cursor-pointer"
              style={{ height: `${heightPct}%` }}
            />
            <span className="text-[9px] text-neutral-500 font-medium">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
};

// ─── Donut chart para estados de órdenes ──────────────────────────────────────
const DonutChart = ({ segments }) => {
  if (!segments || segments.length === 0) return null;
  const total = segments.reduce((a, s) => a + s.value, 0);
  let offset = 0;
  const r = 40, cx = 50, cy = 50, circumference = 2 * Math.PI * r;

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
        {total === 0 ? (
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth="18" />
        ) : (
          segments.map((seg, i) => {
            const pct = seg.value / total;
            const dash = pct * circumference;
            const el = (
              <circle
                key={i}
                cx={cx} cy={cy} r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth="18"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset * circumference}
              />
            );
            offset += pct;
            return el;
          })
        )}
      </svg>
      <div className="flex flex-col gap-2">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ background: seg.color }} />
            <span className="text-neutral-600 font-medium">{seg.label}</span>
            <span className="font-bold text-neutral-900 ml-auto">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── KPI Card ─────────────────────────────────────────────────────────────────
const KpiCard = ({ icon: Icon, label, value, trend, trendLabel, color }) => (
  <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trend >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {trend >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div className="mt-4">
      <p className="text-sm text-neutral-500 font-medium">{label}</p>
      <p className="text-2xl font-extrabold text-neutral-900 mt-1">{value}</p>
      {trendLabel && <p className="text-xs text-neutral-400 mt-1">{trendLabel}</p>}
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const DashboardTab = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          axios.get('/api/orders?limit=all'),
          axios.get('/api/products?limit=all'),
        ]);

        const orders = ordersRes.data.orders || [];
        const products = productsRes.data.products || [];

        // ── Ingresos totales (sólo órdenes pagadas) ──
        const paid = orders.filter(o => o.isPaid || o.orderStatus === 'Pagado' || o.orderStatus === 'Entregado' || o.orderStatus === 'Enviado');
        const totalRevenue = paid.reduce((a, o) => a + (o.totalPrice || 0), 0);

        // ── KPIs ──
        const pendingOrders = orders.filter(o => o.orderStatus === 'Pendiente').length;
        const inProductionOrders = orders.filter(o => o.orderStatus === 'En Producción').length;
        const shippedOrders = orders.filter(o => o.orderStatus === 'Enviado').length;
        const deliveredOrders = orders.filter(o => o.orderStatus === 'Entregado').length;
        const lowStockProducts = products.filter(p => p.countInStock <= 3).length;

        // ── Ventas por mes (últimos 6 meses) ──
        const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
        const now = new Date();
        const monthlySales = Array.from({ length: 6 }, (_, i) => {
          const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
          const label = months[d.getMonth()];
          const total = paid
            .filter(o => {
              const od = new Date(o.createdAt);
              return od.getFullYear() === d.getFullYear() && od.getMonth() === d.getMonth();
            })
            .reduce((a, o) => a + (o.totalPrice || 0), 0);
          return { label, total };
        });

        // ── Últimas 5 órdenes ──
        const recentOrders = [...orders]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        // ── Segmentos para el donut ──
        const donutSegments = [
          { label: 'Pendiente',    value: pendingOrders,    color: '#facc15' },
          { label: 'En Producción',value: inProductionOrders,color: '#a855f7' },
          { label: 'Enviado',      value: shippedOrders,    color: '#3b82f6' },
          { label: 'Entregado',    value: deliveredOrders,  color: '#22c55e' },
        ];

        setStats({
          totalRevenue, totalOrders: orders.length, totalProducts: products.length,
          pendingOrders, lowStockProducts, monthlySales, recentOrders, donutSegments,
        });
      } catch (err) {
        console.error('Dashboard stats error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const fmt = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);
  const statusColors = {
    'Pendiente': 'bg-yellow-100 text-yellow-700',
    'Pagado': 'bg-blue-100 text-blue-700',
    'En Producción': 'bg-purple-100 text-purple-700',
    'Enviado': 'bg-green-100 text-green-700',
    'Entregado': 'bg-teal-100 text-teal-700',
    'Cancelado': 'bg-red-100 text-red-700',
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-500" />
      <p className="text-neutral-500 text-sm">Calculando métricas...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-neutral-900">Dashboard</h2>
        <p className="text-sm text-neutral-500 mt-1">Resumen general de ZAMIS Print</p>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={DollarSign} label="Ingresos Totales" value={fmt(stats.totalRevenue)} color="bg-brand-500" />
        <KpiCard icon={ShoppingBag} label="Total Pedidos" value={stats.totalOrders} color="bg-blue-500" />
        <KpiCard icon={Clock} label="Pedidos Pendientes" value={stats.pendingOrders} color="bg-yellow-500" />
        <KpiCard icon={AlertCircle} label="Productos Bajo Stock" value={stats.lowStockProducts} color="bg-red-500" />
      </div>

      {/* ── Gráfico de Ventas + Donut ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-neutral-900">Ingresos por Mes</h3>
              <p className="text-xs text-neutral-500">Últimos 6 meses (pedidos confirmados)</p>
            </div>
            <TrendingUp size={18} className="text-brand-500" />
          </div>
          <BarChart data={stats.monthlySales} />
        </div>

        {/* Donut */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
          <h3 className="font-bold text-neutral-900 mb-1">Estado de Pedidos</h3>
          <p className="text-xs text-neutral-500 mb-6">Distribución actual</p>
          <DonutChart segments={stats.donutSegments} />
        </div>
      </div>

      {/* ── Últimas Órdenes ── */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <h3 className="font-bold text-neutral-900">Últimos Pedidos</h3>
          <span className="text-xs text-neutral-400">Los 5 más recientes</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/60 text-neutral-500 text-xs">
                <th className="py-3 px-6 text-left font-semibold">ID</th>
                <th className="py-3 px-6 text-left font-semibold">Cliente</th>
                <th className="py-3 px-6 text-left font-semibold">Fecha</th>
                <th className="py-3 px-6 text-left font-semibold">Total</th>
                <th className="py-3 px-6 text-left font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order._id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                  <td className="py-4 px-6 font-mono text-neutral-500 text-xs">#{order._id.substring(0, 8).toUpperCase()}</td>
                  <td className="py-4 px-6 font-semibold text-neutral-900">
                    {order.user?.name || order.shippingAddress?.fullName || 'Invitado'}
                  </td>
                  <td className="py-4 px-6 text-neutral-500">{new Date(order.createdAt).toLocaleDateString('es-CO')}</td>
                  <td className="py-4 px-6 font-bold text-neutral-900">{fmt(order.totalPrice)}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.orderStatus] || 'bg-neutral-100 text-neutral-600'}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                </tr>
              ))}
              {stats.recentOrders.length === 0 && (
                <tr><td colSpan="5" className="py-10 text-center text-neutral-400">No hay pedidos aún</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
