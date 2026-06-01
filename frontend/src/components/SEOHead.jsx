import { useEffect } from 'react';

/**
 * SEOHead — Actualiza dinámicamente el <title> y las meta-tags
 * para cada página. Úsalo así:
 *
 *   <SEOHead
 *     title="Tienda | ZAMIS Print"
 *     description="Explora nuestra colección de impresión 3D personalizada."
 *   />
 */
const SEOHead = ({ title, description, image }) => {
  useEffect(() => {
    // Actualizar título
    if (title) document.title = title;

    // Actualizar description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', description);

      // Open Graph
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', description);

      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle && title) ogTitle.setAttribute('content', title);

      // Twitter
      let twDesc = document.querySelector('meta[name="twitter:description"]');
      if (twDesc) twDesc.setAttribute('content', description);

      let twTitle = document.querySelector('meta[name="twitter:title"]');
      if (twTitle && title) twTitle.setAttribute('content', title);
    }
    
    // Actualizar Imagen
    const imageUrl = image || 'https://zamisprint.vercel.app/og-image.png'; // Fallback
    
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute('content', imageUrl);
    
    let twImage = document.querySelector('meta[name="twitter:image"]');
    if (twImage) twImage.setAttribute('content', imageUrl);
    
  }, [title, description, image]);

  return null; // No renderiza nada visible
};

export default SEOHead;
