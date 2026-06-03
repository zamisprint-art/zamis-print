export const optimizeImage = (url, width = 'auto') => {
  if (!url || typeof url !== 'string') return url;
  
  // Cloudinary Optimization
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    const widthParam = width !== 'auto' ? `w_${width},c_limit` : '';
    const baseTransforms = 'f_auto,q_auto';
    const newTransforms = widthParam ? `${baseTransforms},${widthParam}` : baseTransforms;

    const parts = url.split('/upload/');
    if (parts.length === 2) {
      const rightPart = parts[1];
      if (rightPart.match(/^v\d+\//) || rightPart.indexOf('/') === -1) {
         return `${parts[0]}/upload/${newTransforms}/${rightPart}`;
      } else {
         const afterTransform = rightPart.substring(rightPart.indexOf('/') + 1);
         return `${parts[0]}/upload/${newTransforms}/${afterTransform}`;
      }
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
