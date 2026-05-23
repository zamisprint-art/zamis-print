export const PRODUCT_COLORS = [
  { name: 'Negro', hex: '#171717', border: 'border-neutral-800' },
  { name: 'Blanco', hex: '#FFFFFF', border: 'border-neutral-200' },
  { name: 'Gris', hex: '#9CA3AF', border: 'border-neutral-400' },
  { name: 'Rojo', hex: '#DC2626', border: 'border-red-600' },
  { name: 'Azul', hex: '#2563EB', border: 'border-blue-600' },
  { name: 'Verde', hex: '#16A34A', border: 'border-green-600' },
  { name: 'Amarillo', hex: '#FACC15', border: 'border-yellow-400' },
  { name: 'Café', hex: '#78350F', border: 'border-amber-900' },
  { name: 'Dorado', hex: '#D97706', border: 'border-amber-600', isMetallic: true },
  { name: 'Plateado', hex: '#94A3B8', border: 'border-slate-400', isMetallic: true },
  { name: 'Glow (Brilla)', hex: '#bef264', border: 'border-lime-300', isGlow: true },
  { name: 'Transparente', hex: 'rgba(255,255,255,0.3)', border: 'border-neutral-300', isTransparent: true },
  { name: 'Multicolor', hex: 'linear-gradient(45deg, red, blue, green, yellow)', border: 'border-neutral-300' }
];

export const getColorData = (colorName) => {
  return PRODUCT_COLORS.find(c => c.name === colorName) || null;
};
