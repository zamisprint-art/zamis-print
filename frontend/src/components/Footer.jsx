import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { TrustBadges } from './ecommerce';

const Footer = () => {
  return (
    <footer className="bg-neutral-950 pt-10 pb-8 border-t border-neutral-900 mt-auto text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Column */}
          <div className="space-y-4 lg:pr-8">
            <Link to="/" className="inline-block transition-transform hover:scale-105">
              <img
                src="/images/logo-transparent.png"
                alt="ZAMIS Print"
                className="h-12 md:h-14 w-auto object-contain -ml-2"
              />
            </Link>
            <p className="text-neutral-400 leading-relaxed text-sm">
              Transformamos ideas en realidad usando tecnología de impresión 3D de vanguardia. Modelos precisos, materiales premium y acabados perfectos en Colombia.
            </p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/zamis_print?igsh=MWZ0aTQ4ajYxeW1oZg==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-neutral-300 hover:bg-brand-500 hover:text-white transition-colors border border-white/10 hover:border-brand-500 group">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://www.facebook.com/share/1CVUHmRr9X/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-neutral-300 hover:bg-brand-500 hover:text-white transition-colors border border-white/10 hover:border-brand-500 group">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://www.tiktok.com/@zamis.print.oficial?_r=1&_t=ZS-96XFtfCgk7E" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-neutral-300 hover:bg-brand-500 hover:text-white transition-colors border border-white/10 hover:border-brand-500 group">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path><path d="M15 8v1a4 4 0 0 0 4 4"></path><line x1="15" x2="15" y1="3" y2="21"></line></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-3">Enlaces Rápidos</h4>
            <ul className="space-y-1.5 text-sm">
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
            <h4 className="text-white font-bold text-lg mb-3">Soporte</h4>
            <ul className="space-y-1.5 text-sm">
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
            <h4 className="text-white font-bold text-lg mb-3">Contáctanos</h4>
            <ul className="space-y-2 text-sm mb-4">
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
