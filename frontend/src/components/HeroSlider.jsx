import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const FALLBACK_SLIDES = [
  {
    _id: 'f1',
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=2000&auto=format&fit=crop',
    title: 'Figuras y Coleccionables',
    subtitle: 'Detalle Milimétrico',
    description: 'Tus personajes favoritos y diseños propios traídos a la vida con precisión extrema en resina.',
    ctaText: 'Ver Coleccionables',
    ctaLink: '/shop?category=Figuras',
  },
  {
    _id: 'f2',
    image: 'https://images.unsplash.com/photo-1631556097152-c3bfdd8a3eb5?q=80&w=2000&auto=format&fit=crop',
    title: 'Impresión 3D Personalizada',
    subtitle: 'El límite es tu imaginación',
    description: 'Desde llaveros hasta lámparas. Personaliza colores, textos y formas para crear piezas únicas.',
    ctaText: 'Explorar Catálogo',
    ctaLink: '/shop',
  },
  {
    _id: 'f3',
    image: 'https://images.unsplash.com/photo-1558981420-c532902e58b4?q=80&w=2000&auto=format&fit=crop',
    title: 'Decoración para el Hogar',
    subtitle: 'Dale un toque moderno a tus espacios',
    description: 'Macetas geométricas, organizadores y arte de pared impreso con materiales ecológicos.',
    ctaText: 'Ver Decoración',
    ctaLink: '/shop?category=Decoracion',
  },
];

const HeroSlider = () => {
  const [slides, setSlides] = useState(FALLBACK_SLIDES);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const { data } = await axios.get('/api/slides');
        if (data && data.length > 0) {
          setSlides(data);
          setCurrent(0); // ← resetear índice al cargar nuevos slides
        }
      } catch {
        // Silently fall back to hardcoded slides
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000); // Change slide every 6 seconds
    return () => clearInterval(timer);
  }, [current]);

  const nextSlide = () => {
    setDirection(1);
    setCurrent(prev => (prev >= slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrent(prev => (prev <= 0 ? slides.length - 1 : prev - 1));
  };

  // Safety guard — evita crash si el índice queda fuera del array
  const safeIndex = Math.min(current, slides.length - 1);
  const slide = slides[safeIndex];

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 1.1,
      zIndex: 1,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      zIndex: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    })
  };

  if (!slide) return null;

  return (
    <section className="relative h-[280px] sm:h-[340px] lg:h-[380px] w-full overflow-hidden bg-surface-base">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 },
            scale: { duration: 0.8 }
          }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-darker via-darker/80 to-transparent z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-darker via-transparent to-transparent z-10"></div>
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="w-full h-full object-cover object-center opacity-60"
            />
          </div>
          
          {/* Content */}
          <div className="relative z-20 h-full flex flex-col justify-center px-6 sm:px-10 lg:px-20 max-w-7xl mx-auto pb-10">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="max-w-xl"
            >
              <h3 className="text-xs sm:text-sm font-semibold text-accent mb-1 tracking-widest uppercase">
                {slide.subtitle}
              </h3>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 mb-3 leading-tight">
                {slide.title}
              </h1>
              <p className="text-sm sm:text-base text-neutral-700 mb-5 max-w-md font-light leading-relaxed hidden sm:block">
                {slide.description}
              </p>
              <Link 
                to={slide.ctaLink} 
                className="btn-primary text-sm px-5 py-2.5 inline-block text-center"
              >
                {slide.ctaText}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Bottom Controls */}
      <div className="absolute bottom-3 right-4 sm:right-6 flex flex-col items-end gap-2" style={{ zIndex: 40 }}>
        {/* Navigation Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={prevSlide}
            className="w-8 h-8 rounded-full border border-neutral-300 bg-surface-base/50 backdrop-blur-md flex items-center justify-center text-neutral-900 hover:bg-primary transition-colors hover:border-primary"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={nextSlide}
            className="w-8 h-8 rounded-full border border-neutral-300 bg-surface-base/50 backdrop-blur-md flex items-center justify-center text-neutral-900 hover:bg-primary transition-colors hover:border-primary"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        {/* Progress Indicators */}
        <div className="flex gap-1.5">
          {slides.map((_, index) => (
            <button 
              key={index}
              onClick={() => {
                setDirection(index > current ? 1 : -1);
                setCurrent(index);
              }}
              className={`h-1 transition-all duration-300 rounded-full ${
                index === current ? 'w-8 bg-primary' : 'w-3 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
