import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { optimizeImage } from '../utils/cloudinary';

const FALLBACK_SLIDES = [
  {
    _id: 'f1',
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=2000&auto=format&fit=crop',
    title: 'Tu Personaje Favorito, En Tus Manos',
    subtitle: 'Impresión 3D · Hecho en Colombia',
    description: 'Funkos, figuras y coleccionables 100% personalizados con detalle milimétrico. Diseña el tuyo hoy.',
    ctaText: 'Diseña Tu Figura',
    ctaLink: '/shop?category=Figuras y Coleccionables',
  },
  {
    _id: 'f2',
    image: 'https://images.unsplash.com/photo-1631556097152-c3bfdd8a3eb5?q=80&w=2000&auto=format&fit=crop',
    title: 'De Tu Imaginación a Tus Manos',
    subtitle: 'El Regalo que Nadie Olvidará',
    description: 'Cumpleaños, graduaciones, amor o simplemente porque sí. Creamos piezas únicas que cuentan tu historia.',
    ctaText: 'Ver Regalos Únicos',
    ctaLink: '/shop',
  },
  {
    _id: 'f3',
    image: 'https://images.unsplash.com/photo-1558981420-c532902e58b4?q=80&w=2000&auto=format&fit=crop',
    title: 'Lo Último Que Salió de la Impresora',
    subtitle: 'Nuevos Diseños · Edición Limitada',
    description: 'Piezas recién terminadas, algunas con descuento de lanzamiento. Sé el primero en llevarte una.',
    ctaText: 'Ver Novedades',
    ctaLink: '/shop?sort=newest',
  },
];

const HeroSlider = () => {
  // Iniciar con fallback — asegura que el LCP cargue instantáneamente
  const [slides, setSlides] = useState(FALLBACK_SLIDES);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const { data } = await axios.get('/api/slides');
        // Si hay slides en BD los usa; si no, cae al fallback
        setSlides(data && data.length > 0 ? data : FALLBACK_SLIDES);
      } catch {
        setSlides(FALLBACK_SLIDES);
      } finally {
        setCurrent(0);
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return; // No rotar si hay 1 o menos
    const timer = setInterval(() => {
      setCurrent(prev => (prev >= slides.length - 1 ? 0 : prev + 1));
      setDirection(1);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length, current]);

  const nextSlide = () => {
    setDirection(1);
    setCurrent(prev => (prev >= slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrent(prev => (prev <= 0 ? slides.length - 1 : prev - 1));
  };

  const safeIndex = slides.length > 0 ? Math.min(current, slides.length - 1) : 0;
  const slide = slides[safeIndex];

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 1000 : -1000, opacity: 0, scale: 1.05, zIndex: 1 }),
    center: { x: 0, opacity: 1, scale: 1, zIndex: 1 },
    exit: (dir) => ({ zIndex: 0, x: dir < 0 ? 1000 : -1000, opacity: 0 }),
  };

  // ── Skeleton mientras carga la API ──────────────────────────────────────────
  if (loading) {
    return (
      <section className="relative h-[280px] sm:h-[340px] lg:h-[380px] w-full overflow-hidden bg-neutral-100">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200" />
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 lg:px-20 max-w-7xl mx-auto gap-3">
          <div className="h-3 w-32 bg-neutral-300 rounded-full animate-pulse" />
          <div className="h-8 w-64 bg-neutral-300 rounded-xl animate-pulse" />
          <div className="h-4 w-80 bg-neutral-200 rounded-full animate-pulse" />
          <div className="h-10 w-36 bg-neutral-300 rounded-xl animate-pulse mt-2" />
        </div>
      </section>
    );
  }

  if (!slide) return null;

  return (
    <section className="relative h-[280px] sm:h-[340px] lg:h-[380px] w-full overflow-hidden bg-surface-base">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={slide._id || current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 },
            scale: { duration: 0.8 },
          }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            {/* Overlay sutil solo para legibilidad del texto — izquierda */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent z-10" />
            {/* Overlay inferior sutil */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10" />
            <picture>
              <source media="(max-width: 640px)" srcSet={optimizeImage(slide.image, 640)} />
              <source media="(max-width: 1024px)" srcSet={optimizeImage(slide.image, 1024)} />
              <img
                src={optimizeImage(slide.image, 1600)}
                alt={slide.title}
                fetchPriority="high"
                className="w-full h-full object-cover object-top"
              />
            </picture>
          </div>

          {/* Content */}
          <div className="relative z-20 h-full flex flex-col justify-center px-6 sm:px-10 lg:px-20 max-w-7xl mx-auto pb-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="max-w-xl"
            >
              {slide.subtitle && (
                <h3 className="text-xs sm:text-sm font-semibold text-white/80 mb-1 tracking-widest uppercase drop-shadow">
                  {slide.subtitle}
                </h3>
              )}
              <h1 className="text-xl sm:text-2xl lg:text-xl md:text-2xl font-bold text-white mb-3 leading-tight drop-shadow-lg">
                {slide.title}
              </h1>
              {slide.description && (
                <p className="text-sm sm:text-base text-white/80 mb-5 max-w-md font-light leading-relaxed hidden sm:block drop-shadow">
                  {slide.description}
                </p>
              )}
              <Link
                to={slide.ctaLink || '/shop'}
                className="btn-conversion text-sm px-5 py-2.5 inline-block text-center"
              >
                {slide.ctaText || 'Ver más'}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Bottom Controls — solo si hay más de 1 slide */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 right-4 sm:right-6 flex flex-col items-end gap-2" style={{ zIndex: 40 }}>
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              aria-label="Slide anterior"
              className="w-8 h-8 rounded-full border border-neutral-300 bg-surface-base/50 backdrop-blur-md flex items-center justify-center text-neutral-900 hover:bg-primary transition-colors hover:border-primary"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Slide siguiente"
              className="w-8 h-8 rounded-full border border-neutral-300 bg-surface-base/50 backdrop-blur-md flex items-center justify-center text-neutral-900 hover:bg-primary transition-colors hover:border-primary"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="flex gap-1.5" role="tablist">
            {slides.map((_, index) => (
              <button
                key={index}
                role="tab"
                aria-selected={index === current}
                aria-label={`Ir al slide ${index + 1}`}
                onClick={() => { setDirection(index > current ? 1 : -1); setCurrent(index); }}
                className={`h-1 transition-all duration-300 rounded-full ${
                  index === current ? 'w-8 bg-primary' : 'w-3 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSlider;
