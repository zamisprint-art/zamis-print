const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicons() {
  const input = 'C:\\Users\\AKaballero\\.gemini\\antigravity\\brain\\52ad852d-2463-46e9-96bb-ecc80f2b8a77\\media__1779594648316.png';
  const outDir = 'frontend/public';
  
  console.log('Generating favicons from', input);

  // Crop the bottom 25 pixels where the text is, and top 25 pixels to keep it centered
  // Original is 192x192. Crop height will be 142.
  const croppedBuffer = await sharp(input)
    .extract({ left: 0, top: 15, width: 192, height: 160 })
    .toBuffer();

  const squareBuffer = await sharp(croppedBuffer)
    .resize(1024, 1024, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 } 
    })
    .toBuffer();

  // Apple touch icon
  await sharp(squareBuffer)
    .resize(180, 180)
    .toFile(path.join(outDir, 'apple-touch-icon.png'));
    
  // Android 192
  await sharp(squareBuffer)
    .resize(192, 192)
    .toFile(path.join(outDir, 'icon-192.png'));
    
  // Android 512
  await sharp(squareBuffer)
    .resize(512, 512)
    .toFile(path.join(outDir, 'icon-512.png'));
    
  // 32x32 standard favicon
  await sharp(squareBuffer)
    .resize(32, 32)
    .toFile(path.join(outDir, 'favicon.png'));

  console.log('Favicons generated successfully.');
}

generateFavicons().catch(console.error);
