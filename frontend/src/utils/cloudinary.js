export const optimizeImage = (url, width = 'auto') => {
  if (!url || typeof url !== 'string') return url;
  
  // Cloudinary Optimization
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    const widthParam = width !== 'auto' ? `w_${width},c_limit` : '';
    const baseTransforms = 'f_auto,q_auto';
    const newTransforms = widthParam ? `${baseTransforms},${widthParam}` : baseTransforms;

    const parts = url.split('/upload/');
    if (parts.length === 2) {
      let rightPart = parts[1];
      const firstSlashIdx = rightPart.indexOf('/');
      
      if (firstSlashIdx !== -1) {
        const firstSegment = rightPart.substring(0, firstSlashIdx);
        // Un segmento de transformación de Cloudinary tiene la forma "llave_valor,llave_valor"
        const isTransform = firstSegment.split(',').every(part => /^[a-z]_[a-zA-Z0-9.]+$/.test(part));
        
        if (isTransform) {
          rightPart = rightPart.substring(firstSlashIdx + 1);
        }
      }
      return `${parts[0]}/upload/${newTransforms}/${rightPart}`;
    }
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
