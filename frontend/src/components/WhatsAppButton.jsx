import { motion } from 'framer-motion';

const WHATSAPP_NUMBER = '573107878192';
const WHATSAPP_MESSAGE = '¡Hola! Tengo una consulta sobre un producto de ZAMIS Print 🖨️';

const WhatsAppButton = () => {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group"
    >
      {/* Tooltip */}
      <motion.span
        initial={{ opacity: 0, x: 10 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="hidden sm:block bg-white text-neutral-800 text-sm font-semibold px-4 py-2 rounded-xl shadow-lg border border-neutral-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
      >
        ¿Tienes alguna duda?
      </motion.span>

      {/* Button */}
      <div className="relative w-14 h-14 bg-[#25D366] rounded-full shadow-2xl flex items-center justify-center">
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
        {/* WhatsApp SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="w-8 h-8 fill-white"
        >
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.472.672 4.784 1.84 6.773L2 30l7.418-1.818A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.45 11.45 0 0 1-5.844-1.6l-.418-.248-4.328 1.062 1.092-4.212-.27-.432A11.5 11.5 0 1 1 16 27.5zm6.306-8.594c-.346-.174-2.046-1.01-2.364-1.124-.316-.114-.548-.174-.778.174-.23.346-.89 1.124-1.092 1.354-.202.23-.402.26-.748.086-.346-.174-1.46-.538-2.782-1.718-1.028-.916-1.722-2.048-1.924-2.394-.202-.346-.022-.532.152-.706.156-.154.346-.404.52-.606.172-.202.228-.346.344-.578.114-.23.058-.432-.028-.606-.086-.174-.778-1.878-1.068-2.572-.282-.676-.566-.584-.778-.594-.202-.01-.432-.012-.664-.012s-.606.086-.924.432c-.316.346-1.21 1.182-1.21 2.882s1.238 3.344 1.41 3.576c.172.23 2.436 3.72 5.902 5.216.826.356 1.47.568 1.972.728.828.264 1.582.226 2.176.138.664-.1 2.046-.836 2.336-1.642.288-.806.288-1.498.202-1.642-.084-.144-.316-.23-.664-.404z" />
        </svg>
      </div>
    </motion.a>
  );
};

export default WhatsAppButton;
