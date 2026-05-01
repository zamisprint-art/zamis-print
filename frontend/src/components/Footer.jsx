import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { TrustBadges } from './ecommerce';

const Footer = () => {
  return (
    <footer className="bg-surface-base pt-16 pb-8 border-t border-neutral-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="inline-block bg-white rounded-2xl px-4 py-2">
              <img src="/images/logo.png" alt="ZAMIS Print" className="h-24 w-auto object-contain" />
            </Link>
            <p className="text-neutral-500 leading-relaxed text-sm">
              Transformamos ideas en realidad usando tecnología de impresión 3D de vanguardia. Modelos precisos, materiales premium y acabados perfectos.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-neutral-500 hover:bg-primary hover:text-neutral-900 transition-colors font-bold text-sm">
                IG
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-neutral-500 hover:bg-primary hover:text-neutral-900 transition-colors font-bold text-sm">
                FB
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-neutral-500 hover:bg-primary hover:text-neutral-900 transition-colors font-bold text-sm">
                X
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-neutral-900 font-bold text-lg mb-6">Enlaces Rápidos</h4>
            <ul className="space-y-4 text-sm text-neutral-500">
              <li>
                <Link to="/shop" className="hover:text-primary transition-colors">Catálogo de Productos</Link>
              </li>
              <li>
                <Link to="/shop?category=Figuras" className="hover:text-primary transition-colors">Figuras Coleccionables</Link>
              </li>
              <li>
                <Link to="/shop?category=Decoracion" className="hover:text-primary transition-colors">Decoración Hogar</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">Prototipos e Industria</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-neutral-900 font-bold text-lg mb-6">Soporte</h4>
            <ul className="space-y-4 text-sm text-neutral-500">
              <li>
                <Link to="/faq" className="hover:text-primary transition-colors">Preguntas Frecuentes</Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-primary transition-colors">Políticas de Envío</Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-primary transition-colors">Garantías y Devoluciones</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">Contacto</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-neutral-900 font-bold text-lg mb-6">Contáctanos</h4>
            <ul className="space-y-4 text-sm text-neutral-500 mb-6">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                <span>Bogotá, Colombia<br/>Envíos a todo el país</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary shrink-0" />
                <span>+57 300 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary shrink-0" />
                <span>hola@zamisprint.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-neutral-500 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} ZAMIS Print. Todos los derechos reservados.
          </p>
          
          <div className="flex items-center gap-6 text-sm text-neutral-500">
            <Link to="/privacy" className="hover:text-neutral-900 transition-colors">Privacidad</Link>
            <Link to="/terms" className="hover:text-neutral-900 transition-colors">Términos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
