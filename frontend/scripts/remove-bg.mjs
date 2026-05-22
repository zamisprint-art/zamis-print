import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const input  = path.join(__dirname, '../public/images/logo.png');
const output = path.join(__dirname, '../public/images/logo-transparent.png');

const { data, info } = await sharp(input)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const pixels = new Uint8ClampedArray(data);
const threshold = 230; // Píxeles más claros que este valor se vuelven transparentes

for (let i = 0; i < pixels.length; i += 4) {
  const r = pixels[i];
  const g = pixels[i + 1];
  const b = pixels[i + 2];
  // Si el píxel es casi blanco, lo hacemos transparente
  if (r >= threshold && g >= threshold && b >= threshold) {
    pixels[i + 3] = 0; // alpha = 0 (transparente)
  }
}

await sharp(pixels, {
  raw: { width: info.width, height: info.height, channels: 4 }
})
  .png()
  .toFile(output);

console.log(`✅ Logo con fondo transparente generado en: ${output}`);
console.log(`   Dimensiones: ${info.width}x${info.height}px`);
