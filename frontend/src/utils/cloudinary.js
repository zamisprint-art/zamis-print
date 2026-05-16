export const optimizeImage = (url, width = 'auto') => {
  if (!url || typeof url !== 'string') return url;
  
  // Solo aplicar a imágenes de Cloudinary que no estén ya transformadas
  if (url.includes('res.cloudinary.com') && url.includes('/upload/') && !url.includes('f_auto')) {
    const widthParam = width !== 'auto' ? `w_${width},c_limit,` : '';
    return url.replace('/upload/', `/upload/f_auto,q_auto,${widthParam}`);
  }
  
  return url;
};
