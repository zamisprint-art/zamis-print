import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { TrustBadges } from './ecommerce';

const Footer = () => {
  return (
    <footer className="bg-neutral-950 pt-16 pb-8 border-t border-neutral-900 mt-auto text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="inline-block bg-white rounded-2xl p-2 shadow-sm transition-transform hover:scale-105">
              <img src="/images/logo.png" alt="ZAMIS Print" className="h-12 sm:h-14 w-auto object-contain" />
            </Link>
            <p className="text-neutral-400 leading-relaxed text-sm">
              Transformamos ideas en realidad usando tecnología de impresión 3D de vanguardia. Modelos precisos, materiales premium y acabados perfectos en Colombia.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-neutral-300 hover:bg-brand-500 hover:text-white transition-colors text-sm font-bold border border-white/10 hover:border-brand-500">
                IG
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-neutral-300 hover:bg-brand-500 hover:text-white transition-colors text-sm font-bold border border-white/10 hover:border-brand-500">
                FB
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-neutral-300 hover:bg-brand-500 hover:text-white transition-colors text-sm font-bold border border-white/10 hover:border-brand-500">
                X
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Enlaces Rápidos</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link to="/shop" className="hover:text-brand-400 transition-colors">Catálogo de Productos</Link>
              </li>
              <li>
                <Link to="/shop?category=Figuras y Coleccionables" className="hover:text-brand-400 transition-colors">Figuras Coleccionables</Link>
              </li>
              <li>
                <Link to="/shop?category=Hogar y Decoración" className="hover:text-brand-400 transition-colors">Decoración Hogar</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-400 transition-colors">Prototipos e Industria</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Soporte</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link to="/faq" className="hover:text-brand-400 transition-colors">Preguntas Frecuentes</Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-brand-400 transition-colors">Políticas de Envío</Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-brand-400 transition-colors">Garantías y Devoluciones</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-400 transition-colors">Contacto</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Contáctanos</h4>
            <ul className="space-y-4 text-sm mb-6">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-500 shrink-0 mt-0.5" />
                <span>Bogotá, Colombia<br/>Envíos a todo el país</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-brand-500 shrink-0" />
                <span>+57 310 787 8192</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-brand-500 shrink-0" />
                <span>hola@zamisprint.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-neutral-500 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} ZAMIS Print. Todos los derechos reservados.
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4 text-sm font-semibold text-neutral-400">
            <span className="flex items-center px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 shadow-sm">
              <span className="text-[10px] tracking-wider text-white font-bold bg-[#009ee3] rounded px-2 py-0.5 whitespace-nowrap">MERCADO PAGO</span>
            </span>
            <span className="flex items-center px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 shadow-sm">
              <span className="font-bold text-white tracking-wider text-xs italic whitespace-nowrap">Nequi</span>
            </span>
            <span className="flex items-center px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 shadow-sm">
              <span className="font-bold text-white tracking-wider text-xs whitespace-nowrap">Bancolombia</span>
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-neutral-500">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacidad</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Términos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
