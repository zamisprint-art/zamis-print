import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, XCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import { useCartStore } from '../store/useCartStore';

// ── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  success: {
    icon: <CheckCircle2 className="w-20 h-20 text-green-400" />,
    title: '¡Pago Exitoso! 🎉',
    subtitle: 'Tu pedido ha sido confirmado y está en producción.',
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/30',
  },
  pending: {
    icon: <Clock className="w-20 h-20 text-yellow-400" />,
    title: 'Pago Pendiente',
    subtitle: 'Tu pago está siendo procesado. Te notificaremos cuando se confirme.',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    borderColor: 'border-yellow-400/30',
  },
  failure: {
    icon: <XCircle className="w-20 h-20 text-red-400" />,
    title: 'Pago Fallido',
    subtitle: 'Hubo un problema con tu pago. No se realizó ningún cargo.',
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    borderColor: 'border-red-400/30',
  },
};

// ── Step tracker ──────────────────────────────────────────────────────────────
const ORDER_STEPS = [
  { label: 'Pedido Recibido',   icon: '📋' },
  { label: 'En Producción 3D',  icon: '🖨️' },
  { label: 'Control de Calidad',icon: '✅' },
  { label: 'Enviado',           icon: '🚚' },
  { label: 'Entregado',         icon: '🎁' },
];

// ── Format COP ────────────────────────────────────────────────────────────────
const formatCOP = (v) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);

// ── Component ─────────────────────────────────────────────────────────────────
const OrderSuccess = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status') || 'success';

  const { clearCart } = useCartStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.success;

  // Clear cart on success
  useEffect(() => {
    if (status === 'success') clearCart();
  }, [status, clearCart]);

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/api/orders/${id}`);
        setOrder(data);
      } catch {
        // Order may not be accessible without auth — show minimal UI
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
    else setLoading(false);
  }, [id]);

  // Current step based on order status
  const currentStep = order
    ? ORDER_STEPS.findIndex((s) => s.label.toLowerCase().includes(order.status?.toLowerCase())) + 1 || 1
    : 1;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      {/* ── Status Badge ── */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="flex justify-center mb-8"
      >
        <div className={`p-6 rounded-full ${config.bgColor} border-2 ${config.borderColor}`}>
          {config.icon}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h1 className={`text-4xl font-extrabold mb-3 ${config.color}`}>{config.title}</h1>
        <p className="text-neutral-500 text-lg mb-2">{config.subtitle}</p>
        {id && (
          <p className="text-sm text-neutral-400 font-mono">
            Pedido <span className="text-neutral-300">#{id.slice(-8).toUpperCase()}</span>
          </p>
        )}
      </motion.div>

      {/* ── Order Details ── */}
      {!loading && order && status === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 glass-panel rounded-3xl p-6 text-left"
        >
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-400" />
            Detalle del Pedido
          </h2>

          {/* Items */}
          <div className="space-y-3 mb-6">
            {order.orderItems?.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span className="text-neutral-700 line-clamp-1 flex-1 mr-4">
                  {item.name}
                  <span className="text-neutral-400 ml-1">× {item.qty}</span>
                </span>
                <span className="font-semibold text-neutral-900 shrink-0">
                  {formatCOP(item.price * item.qty)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-neutral-200 pt-4 flex justify-between font-bold text-lg">
            <span>Total Pagado</span>
            <span className="text-brand-500">{formatCOP(order.totalPrice)}</span>
          </div>

          {/* Shipping */}
          {order.shippingAddress && (
            <div className="mt-4 p-4 rounded-2xl bg-surface-card border border-neutral-100 text-sm">
              <p className="font-semibold text-neutral-700 mb-1">📦 Dirección de envío</p>
              <p className="text-neutral-500">
                {order.shippingAddress.fullName} — {order.shippingAddress.address},{' '}
                {order.shippingAddress.city}
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* ── Order Progress Tracker ── */}
      {status === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 glass-panel rounded-3xl p-6"
        >
          <h2 className="text-lg font-bold mb-6 text-left">Estado de tu Pedido</h2>
          <div className="flex items-start justify-between gap-2">
            {ORDER_STEPS.map((step, idx) => {
              const isCompleted = idx < currentStep;
              const isActive = idx === currentStep - 1;
              return (
                <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-500 ${
                      isCompleted
                        ? 'bg-green-400/20 border-green-400'
                        : isActive
                        ? 'bg-brand-400/20 border-brand-400 animate-pulse'
                        : 'bg-surface-card border-neutral-200'
                    }`}
                  >
                    {step.icon}
                  </div>
                  <p
                    className={`text-xs text-center font-medium leading-tight ${
                      isActive ? 'text-brand-400' : isCompleted ? 'text-green-400' : 'text-neutral-400'
                    }`}
                  >
                    {step.label}
                  </p>
                  {/* Connector line (except last) */}
                  {idx < ORDER_STEPS.length - 1 && (
                    <div
                      className={`hidden sm:block absolute h-0.5 w-full mt-5 ${
                        isCompleted ? 'bg-green-400' : 'bg-neutral-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ── CTA Buttons ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
      >
        {status === 'failure' ? (
          <Link to="/checkout" className="btn btn-primary btn-lg gap-2">
            Reintentar Pago <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link to="/profile" className="btn btn-primary btn-lg gap-2">
            Ver Mis Pedidos <ArrowRight className="w-4 h-4" />
          </Link>
        )}
        <Link to="/shop" className="btn btn-outline btn-lg gap-2">
          <ShoppingBag className="w-4 h-4" /> Seguir Comprando
        </Link>
      </motion.div>

      {/* ── WhatsApp Contact ── */}
      {status === 'success' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-sm text-neutral-400"
        >
          ¿Tienes preguntas sobre tu pedido?{' '}
          <a
            href="https://wa.me/1234567890?text=Hola,%20tengo%20una%20pregunta%20sobre%20mi%20pedido"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300 font-medium underline"
          >
            Contáctanos por WhatsApp
          </a>
        </motion.p>
      )}
    </div>
  );
};

export default OrderSuccess;
