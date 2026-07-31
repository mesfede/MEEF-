import { loadImage, createCanvas } from '@napi-rs/canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function processOriginalLogo() {
  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const srcPath = path.join(__dirname, 'src', 'MEF_logo_svg.png');
  if (!fs.existsSync(srcPath)) {
    console.error('src/MEF_logo_svg.png not found!');
    return;
  }

  const img = await loadImage(srcPath);
  const tempCanvas = createCanvas(img.width, img.height);
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.drawImage(img, 0, 0);
  const imgData = tempCtx.getImageData(0, 0, img.width, img.height).data;

  // Detect bounding box of non-transparent content
  let minX = img.width, maxX = 0, minY = img.height, maxY = 0;
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      const idx = (y * img.width + x) * 4;
      const alpha = imgData[idx + 3];
      if (alpha > 15) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const cropWidth = maxX - minX + 1;
  const cropHeight = maxY - minY + 1;
  const padding = 15;

  // Dark/Original trim canvas
  const darkCanvas = createCanvas(cropWidth + padding * 2, cropHeight + padding * 2);
  const darkCtx = darkCanvas.getContext('2d');
  darkCtx.drawImage(img, minX, minY, cropWidth, cropHeight, padding, padding, cropWidth, cropHeight);

  // Light/White text canvas for dark backgrounds
  const whiteCanvas = createCanvas(cropWidth + padding * 2, cropHeight + padding * 2);
  const whiteCtx = whiteCanvas.getContext('2d');
  whiteCtx.drawImage(darkCanvas, 0, 0);
  const wData = whiteCtx.getImageData(0, 0, whiteCanvas.width, whiteCanvas.height);
  const pixels = wData.data;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];

    if (a > 15) {
      const isGreen = (g > r + 30) && (g > b + 30);
      if (!isGreen) {
        pixels[i] = 255;
        pixels[i + 1] = 255;
        pixels[i + 2] = 255;
      }
    }
  }
  whiteCtx.putImageData(wData, 0, 0);

  const darkBuffer = darkCanvas.toBuffer('image/png');
  const whiteBuffer = whiteCanvas.toBuffer('image/png');

  fs.writeFileSync(path.join(publicDir, 'mef-logo.png'), darkBuffer);
  fs.writeFileSync(path.join(publicDir, 'logo.png'), darkBuffer);
  fs.writeFileSync(path.join(publicDir, 'mef-logo-original.png'), darkBuffer);
  fs.writeFileSync(path.join(publicDir, 'logo-original.png'), darkBuffer);
  fs.writeFileSync(path.join(publicDir, 'user_logo_trimmed.png'), darkBuffer);
  fs.writeFileSync(path.join(publicDir, 'MEF_logo_svg.png'), darkBuffer);

  fs.writeFileSync(path.join(publicDir, 'mef-logo-white.png'), whiteBuffer);
  fs.writeFileSync(path.join(publicDir, 'logo-white.png'), whiteBuffer);

  console.log('Processed original user logo cleanly into /public !');
}

processOriginalLogo();


