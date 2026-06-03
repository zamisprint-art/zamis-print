export const optimizeImage = (url, width = 'auto') => {
  if (!url || typeof url !== 'string') return url;
  
  // Cloudinary Optimization
  if (url.includes('res.cloudinary.com') && url.includes('/upload/') && !url.includes('f_auto')) {
    const widthParam = width !== 'auto' ? `,w_${width},c_limit` : '';
    return url.replace('/upload/', `/upload/f_auto,q_auto${widthParam}/`);
  }
  
  // Unsplash Optimization
  if (url.includes('images.unsplash.com')) {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set('fm', 'webp'); // Forzar WebP
      urlObj.searchParams.set('q', '80');    // Calidad 80%
      if (width !== 'auto') {
        urlObj.searchParams.set('w', width.toString()); // Cambiar a ancho óptimo
      }
      return urlObj.toString();
    } catch (e) {
      return url;
    }
  }
  
  return url;
};
