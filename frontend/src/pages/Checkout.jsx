import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { CheckCircle2, Truck, CreditCard, ChevronRight, ShieldCheck, Lock, User, FileText, MapPin, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui';
import { TrustBadges, PriceDisplay } from '../components/ecommerce';
import { COLOMBIA, DOCUMENT_TYPES } from '../data/colombia';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems } = useCartStore();
  const { userInfo } = useAuthStore();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    email: '',
    documentType: 'C.C.',
    documentNumber: '',
    phone: '',
    address: '',
    department: '',
    city: '',
    postalCode: '',
    instructions: '',
  });

  const availableCities = useMemo(() => {
    if (!shippingAddress.department) return [];
    return COLOMBIA.find(d => d.dep === shippingAddress.department)?.cities || [];
  }, [shippingAddress.department]);

  const handleDepartmentChange = (e) => {
    setShippingAddress(prev => ({ ...prev, department: e.target.value, city: '' }));
  };

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [step, setStep] = useState(2); // 1: Cart, 2: Shipping, 3: Payment

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
    if (userInfo && !shippingAddress.fullName) {
      setShippingAddress(prev => ({ 
        ...prev, 
        fullName: userInfo.name,
        email: userInfo.email 
      }));
    }
  }, [cartItems, navigate, userInfo]);

  const total = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  const PROCESSING_STEPS = [
    { label: 'Verificando tu información...', icon: '🔐' },
    { label: 'Creando tu pedido...', icon: '📦' },
    { label: 'Conectando con MercadoPago...', icon: '💳' },
    { label: 'Redirigiendo al pago seguro...', icon: '🚀' },
  ];

  const handlePayment = async (e) => {
    e.preventDefault();
    setStep(3);
    setIsProcessing(true);
    setProcessingStep(0);

    const stepInterval = setInterval(() => {
      setProcessingStep(prev => {
        if (prev < PROCESSING_STEPS.length - 1) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 900);

    try {
      const { data: orderData } = await axios.post('/api/orders', {
        orderItems: cartItems.map(item => ({
          name:    item.name,
          qty:     item.qty,
          image:   item.image,
          price:   item.price,
          product: item.product,
          personalizationText:  item.personalizationText  || '',
          personalizationImage: item.personalizationImage || '',
        })),
        shippingAddress,
        paymentMethod: 'MercadoPago',
        itemsPrice:   total,
        shippingPrice: 0,
        totalPrice:   total,
      });

      const { data: preferenceData } = await axios.post('/api/payments/create_preference', {
        items:   cartItems,
        orderId: orderData._id,
      });

      clearInterval(stepInterval);
      setProcessingStep(PROCESSING_STEPS.length - 1);
      await new Promise(res => setTimeout(res, 600));
      window.location.href = preferenceData.init_point;

    } catch (error) {
      clearInterval(stepInterval);
      console.error('Payment error:', error);
      const msg = error.response?.data?.message || 'Error de conexión con el servidor.';
      const detail = error.response?.data?.detail ? `\nDetalle técnico: ${error.response.data.detail}` : '';
      toast.error(`No pudimos procesar tu pago.\n\n${msg}${detail}\n\nPor favor intenta nuevamente.`);
      setIsProcessing(false);
      setProcessingStep(0);
      setStep(2);
    }
  };

  const handleChange = (e) => {
    setShippingAddress(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const selectClass = "w-full px-4 py-3 text-base rounded-xl border-2 border-neutral-200 bg-neutral-50 text-neutral-800 focus:outline-none focus:border-brand-500 focus:bg-white transition-all duration-200 cursor-pointer appearance-none";
  const inputClass  = "input-field py-3 text-base";

  if (cartItems.length === 0) return null;

  return (
    <>
      {/* SECURE PAYMENT OVERLAY */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            key="payment-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/95 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="relative flex flex-col items-center gap-8 p-10 max-w-sm w-full text-center"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-brand-500/30 blur-2xl scale-150 animate-pulse" />
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-2xl shadow-brand-500/40">
                  <Lock size={40} className="text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Procesando tu pago</h2>
                <p className="text-neutral-400 text-sm">Esto solo tomará unos segundos</p>
              </div>
              <div className="w-full space-y-3">
                {PROCESSING_STEPS.map((s, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: idx <= processingStep ? 1 : 0.25, x: 0 }}
                    transition={{ delay: idx * 0.15 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      idx === processingStep
                        ? 'bg-brand-500/20 border border-brand-500/40 text-white'
                        : idx < processingStep
                        ? 'text-green-400'
                        : 'text-neutral-600'
                    }`}
                  >
                    <span className="text-xl w-6 text-center">
                      {idx < processingStep ? '✓' : s.icon}
                    </span>
                    <span className={`text-sm font-medium ${idx === processingStep ? 'font-bold' : ''}`}>
                      {s.label}
                    </span>
                    {idx === processingStep && (
                      <div className="ml-auto w-4 h-4 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
                    )}
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-neutral-500 text-xs">
                <ShieldCheck size={14} className="text-green-400" />
                <span>Transacción cifrada SSL · MercadoPago</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHECKOUT CONTENT */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 mb-20 md:mb-0">

        {/* Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-center max-w-2xl mx-auto">
            <div className="flex items-center text-green-400">
              <div className="w-10 h-10 rounded-full bg-green-400/20 flex items-center justify-center border border-green-400">
                <CheckCircle2 size={20} />
              </div>
              <span className="hidden sm:block ml-3 font-medium">Carrito</span>
            </div>
            <div className="flex-1 h-px bg-neutral-200 mx-4"></div>
            <div className={`flex items-center ${step >= 2 ? 'text-brand-600' : 'text-neutral-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${step >= 2 ? 'bg-brand-50 border-brand-500' : 'bg-surface-base border-neutral-300'}`}>
                <Truck size={20} />
              </div>
              <span className="hidden sm:block ml-3 font-medium">Envío</span>
            </div>
            <div className="flex-1 h-px bg-neutral-200 mx-4"></div>
            <div className={`flex items-center ${step >= 3 ? 'text-green-600' : 'text-neutral-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${step >= 3 ? 'bg-green-50 border-green-500' : 'bg-surface-base border-neutral-300'}`}>
                <CreditCard size={20} />
              </div>
              <span className="hidden sm:block ml-3 font-medium">Pago Seguro</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left Col: Form */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm"
            >
              <h2 className="text-2xl font-bold mb-2 text-neutral-900">¿A dónde enviamos tu pedido?</h2>
              <p className="text-sm text-neutral-400 mb-6">Todos los campos son obligatorios.</p>
              <form id="checkout-form" onSubmit={handlePayment} className="space-y-5">

                {/* ── Sección 1: Datos Personales ── */}
                <div className="flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-widest mb-1">
                  <User size={13} /> Datos del Receptor
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Nombre completo</label>
                    <input type="text" name="fullName" required
                      value={shippingAddress.fullName} onChange={handleChange}
                      className={inputClass} placeholder="Ej. Juan Pérez"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Correo electrónico</label>
                    <div className="relative">
                      <input type="email" name="email" required
                        value={shippingAddress.email} onChange={handleChange}
                        className={inputClass + " pl-10"} placeholder="tu@correo.com"
                      />
                      <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    </div>
                  </div>
                </div>

                {/* ── Sección 2: Documento ── */}
                <div className="flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-widest mt-2 mb-1">
                  <FileText size={13} /> Identificación
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Tipo de documento</label>
                    <div className="relative">
                      <select name="documentType" required
                        value={shippingAddress.documentType} onChange={handleChange}
                        className={selectClass + " pr-10"}
                      >
                        {DOCUMENT_TYPES.map(dt => (
                          <option key={dt.value} value={dt.value}>{dt.label}</option>
                        ))}
                      </select>
                      <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 rotate-90 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Número de documento</label>
                    <input type="text" name="documentNumber" required inputMode="numeric"
                      value={shippingAddress.documentNumber} onChange={handleChange}
                      className={inputClass} placeholder="Ej. 1020304050"
                    />
                  </div>
                </div>

                {/* ── Sección 3: Dirección ── */}
                <div className="flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-widest mt-2 mb-1">
                  <MapPin size={13} /> Dirección de Envío
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Dirección completa</label>
                  <input type="text" name="address" required
                    value={shippingAddress.address} onChange={handleChange}
                    className={inputClass} placeholder="Calle 123 # 45-67, Apto 8"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Departamento</label>
                    <div className="relative">
                      <select name="department" required
                        value={shippingAddress.department} onChange={handleDepartmentChange}
                        className={selectClass + " pr-10"}
                      >
                        <option value="">Selecciona un departamento...</option>
                        {COLOMBIA.map(d => (
                          <option key={d.dep} value={d.dep}>{d.dep}</option>
                        ))}
                      </select>
                      <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 rotate-90 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Ciudad / Municipio</label>
                    <div className="relative">
                      <select name="city" required
                        value={shippingAddress.city} onChange={handleChange}
                        disabled={!shippingAddress.department}
                        className={selectClass + " pr-10 disabled:opacity-50 disabled:cursor-not-allowed"}
                      >
                        <option value="">{shippingAddress.department ? 'Selecciona una ciudad...' : 'Primero elige un departamento'}</option>
                        {availableCities.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 rotate-90 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Código Postal</label>
                    <input type="text" name="postalCode" required inputMode="numeric"
                      value={shippingAddress.postalCode} onChange={handleChange}
                      className={inputClass} placeholder="Ej. 110111"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Teléfono (WhatsApp)</label>
                    <div className="relative">
                      <input type="tel" name="phone" required inputMode="tel"
                        value={shippingAddress.phone} onChange={handleChange}
                        className={inputClass + " pl-10"} placeholder="+57 310 000 0000"
                      />
                      <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    </div>
                    <p className="text-xs text-neutral-500 mt-2 flex items-center gap-1">
                      <ShieldCheck size={13} className="text-green-400" />
                      Solo para actualizaciones de tu pedido.
                    </p>
                  </div>
                </div>

                {/* ── Sección 4: Instrucciones ── */}
                <div className="flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-widest mt-6 mb-1">
                  <FileText size={13} /> Instrucciones de Entrega
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Notas adicionales (Opcional)</label>
                  <textarea name="instructions" rows="2"
                    value={shippingAddress.instructions} onChange={handleChange}
                    className="input-field py-3 text-base resize-none w-full" placeholder="Ej. Dejar en portería, casa con rejas negras, etc."
                  />
                </div>

                {/* ── Sección 5: Legales ── */}
                <div className="mt-6 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center pt-0.5">
                      <input 
                        type="checkbox" 
                        required 
                        className="peer w-5 h-5 appearance-none border-2 border-neutral-300 rounded bg-white checked:bg-brand-600 checked:border-brand-600 transition-all cursor-pointer"
                      />
                      <svg className="absolute w-5 h-5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span className="text-sm text-neutral-600 leading-tight">
                      He leído y acepto los <a href="/terms" target="_blank" className="text-brand-600 font-bold hover:underline">Términos y Condiciones</a> (incluyendo políticas de envíos y devoluciones) y autorizo el tratamiento de mis datos personales según la <a href="/privacy" target="_blank" className="text-brand-600 font-bold hover:underline">Política de Privacidad</a> de ZAMIS Print.
                    </span>
                  </label>
                </div>

              </form>
            </motion.div>
          </div>

          {/* Right Col: Order Summary */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-surface-card p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm sticky top-24"
            >
              <h2 className="text-xl font-bold mb-6 border-b border-neutral-200 pb-4 text-neutral-900">Resumen del Pedido</h2>
              <div className="space-y-4 max-h-64 overflow-y-auto mb-6 pr-2 custom-scrollbar">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-card shrink-0 border border-neutral-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-neutral-500 mt-1">Cant: {item.qty}</p>
                      {item.personalizationText && (
                        <p className="text-[10px] text-brand-600 mt-1 line-clamp-2 bg-brand-50 inline-block px-2 py-0.5 rounded-md border border-brand-100">
                          ✏️ {item.personalizationText}
                        </p>
                      )}
                    </div>
                    <div className="font-bold text-right text-sm">
                      <PriceDisplay price={item.qty * item.price} currency="COP" showDiscount={false} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-neutral-200 pt-4 space-y-3 mb-6">
                <div className="flex justify-between items-center text-neutral-700 text-sm">
                  <span>Subtotal</span>
                  <PriceDisplay price={total} currency="COP" showDiscount={false} />
                </div>
                <div className="flex justify-between items-center text-neutral-700 text-sm">
                  <span>Envío estándar</span>
                  <span className="text-green-600 font-bold">Gratis</span>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-neutral-200 pt-4 mb-8">
                <span className="text-2xl font-bold">Total</span>
                <PriceDisplay price={total} currency="COP" size="lg" showDiscount={false} />
              </div>

              {/* Desktop Submit */}
              <Button
                form="checkout-form"
                type="submit"
                disabled={isProcessing}
                size="lg"
                isLoading={isProcessing}
                loadingText="Procesando..."
                icon={<ChevronRight size={20} />}
                iconPosition="right"
                className="hidden md:flex w-full justify-center shadow-primary/30"
              >
                {!isProcessing && "Continuar al Pago"}
              </Button>
              <div className="mt-3 text-center text-xs text-neutral-500 flex flex-col items-center gap-1">
                <span className="font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                  Aceptamos Nequi y Daviplata
                </span>
                <span>Selecciona "PSE" en la siguiente pantalla</span>
              </div>
              <div className="mt-8">
                <TrustBadges variant="checkout" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mobile Sticky CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface-base/90 backdrop-blur-md border-t border-neutral-200 md:hidden z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <Button
            form="checkout-form"
            type="submit"
            disabled={isProcessing}
            size="lg"
            isLoading={isProcessing}
            loadingText="Procesando..."
            className="w-full flex justify-center items-center shadow-primary/30"
          >
            {!isProcessing && <>
              Pagar <span className="mx-1 font-black bg-white/20 px-2 rounded-md">
                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(total)}
              </span>
              <ChevronRight size={20} />
            </>}
          </Button>
          <div className="mt-2 text-center text-[10px] text-neutral-500 font-medium leading-tight">
            Para pagar con <span className="text-brand-600 font-bold">Nequi o Daviplata</span>, selecciona PSE en el siguiente paso.
          </div>
        </div>

      </div>
    </>
  );
};

export default Checkout;
