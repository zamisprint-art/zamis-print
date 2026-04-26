import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=2000&auto=format&fit=crop',
    title: 'Figuras y Coleccionables',
    subtitle: 'Detalle Milimétrico',
    description: 'Tus personajes favoritos y diseños propios traídos a la vida con precisión extrema en resina.',
    ctaText: 'Ver Coleccionables',
    ctaLink: '/shop?category=Figuras',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1631556097152-c3bfdd8a3eb5?q=80&w=2000&auto=format&fit=crop',
    title: 'Impresión 3D Personalizada',
    subtitle: 'El límite es tu imaginación',
    description: 'Desde llaveros hasta lámparas. Personaliza colores, textos y formas para crear piezas únicas.',
    ctaText: 'Explorar Catálogo',
    ctaLink: '/shop',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1558981420-c532902e58b4?q=80&w=2000&auto=format&fit=crop',
    title: 'Decoración para el Hogar',
    subtitle: 'Dale un toque moderno a tus espacios',
    description: 'Macetas geométricas, organizadores y arte de pared impreso con materiales ecológicos.',
    ctaText: 'Ver Decoración',
    ctaLink: '/shop?category=Decoracion',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1615829627725-b4bf0bcf7723?q=80&w=2000&auto=format&fit=crop',
    title: 'Regalos Inolvidables',
    subtitle: 'Sorprende a los que amas',
    description: 'Litofanías (fotos en 3D), nombres en relieve y detalles personalizados que perduran para siempre.',
    ctaText: 'Ideas para Regalar',
    ctaLink: '/shop',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1610450947171-791dbec91f6e?q=80&w=2000&auto=format&fit=crop',
    title: 'Prototipado Industrial',
    subtitle: 'De la idea al objeto en horas',
    description: 'Fabricación de piezas técnicas, engranajes y maquetas para empresas e ingenieros con filamentos resistentes.',
    ctaText: 'Cotizar Proyecto',
    ctaLink: '/about',
  }
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000); // Change slide every 6 seconds
    return () => clearInterval(timer);
  }, [current]);

  const nextSlide = () => {
    setDirection(1);
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 1.1,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    })
  };

  return (
    <section className="relative h-[60vh] sm:h-[70vh] w-full overflow-hidden bg-surface-base">
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
              src={slides[current].image} 
              alt={slides[current].title} 
              className="w-full h-full object-cover object-center opacity-60"
            />
          </div>
          
          {/* Content */}
          <div className="relative z-20 h-full flex flex-col justify-center px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="max-w-2xl"
            >
              <h3 className="text-xl md:text-2xl font-medium text-accent mb-2 tracking-wider uppercase">
                {slides[current].subtitle}
              </h3>
              <h1 className="text-5xl md:text-7xl font-black text-neutral-900 mb-6 leading-tight">
                {slides[current].title}
              </h1>
              <p className="text-lg md:text-xl text-neutral-700 mb-10 max-w-xl font-light leading-relaxed">
                {slides[current].description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to={slides[current].ctaLink} 
                  className="btn-primary text-lg px-8 py-4 text-center"
                >
                  {slides[current].ctaText}
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="absolute z-30 bottom-10 right-10 flex gap-4">
        <button 
          onClick={prevSlide}
          className="w-12 h-12 rounded-full border border-neutral-300 bg-surface-base/50 backdrop-blur-md flex items-center justify-center text-neutral-900 hover:bg-primary transition-colors hover:border-primary"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={nextSlide}
          className="w-12 h-12 rounded-full border border-neutral-300 bg-surface-base/50 backdrop-blur-md flex items-center justify-center text-neutral-900 hover:bg-primary transition-colors hover:border-primary"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Progress Indicators */}
      <div className="absolute z-30 bottom-10 left-6 sm:left-12 lg:left-24 flex gap-2">
        {slides.map((_, index) => (
          <button 
            key={index}
            onClick={() => {
              setDirection(index > current ? 1 : -1);
              setCurrent(index);
            }}
            className={`h-1.5 transition-all duration-300 rounded-full ${
              index === current ? 'w-10 bg-primary' : 'w-4 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
