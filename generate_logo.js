import { createCanvas } from '@napi-rs/canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createLogoPNG({ width = 1200, height = 240, isDark = false, transparent = true }) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  if (!transparent) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
  }

  const textColor = isDark ? '#FFFFFF' : '#1C1B1B';
  const gridDarkColor = isDark ? '#FFFFFF' : '#1C1B1B';
  const greenColor = '#48A82D';

  // 1. Draw 3x3 Grid Symbol
  const startX = 15;
  const startY = 15;
  const sqSize = 58;
  const gap = 9;

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const x = startX + col * (sqSize + gap);
      const y = startY + row * (sqSize + gap);
      
      if (row === 1 && col === 1) {
        ctx.fillStyle = greenColor;
      } else {
        ctx.fillStyle = gridDarkColor;
      }
      ctx.fillRect(x, y, sqSize, sqSize);
    }
  }

  // 2. Draw Typography - Exactly 2 Lines
  const textX = startX + 3 * sqSize + 2 * gap + 35;

  // Line 1: MARIA EUGENIA FERNÁNDEZ
  ctx.fillStyle = textColor;
  ctx.font = '900 72px Arial, sans-serif';
  ctx.textBaseline = 'top';
  ctx.fillText('MARIA EUGENIA FERNÁNDEZ', textX, 22);

  // Line 2: NEGOCIOS INMOBILIARIOS
  ctx.font = 'bold 36px Arial, sans-serif';
  const subText = 'N E G O C I O S   I N M O B I L I A R I O S';
  ctx.fillText(subText, textX, 118);

  return canvas.toBuffer('image/png');
}

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write dark text version (for light backgrounds)
fs.writeFileSync(path.join(publicDir, 'mef-logo.png'), createLogoPNG({ isDark: false, transparent: true }));
fs.writeFileSync(path.join(publicDir, 'logo.png'), createLogoPNG({ isDark: false, transparent: true }));

// Write white text version (for dark backgrounds)
fs.writeFileSync(path.join(publicDir, 'mef-logo-white.png'), createLogoPNG({ isDark: true, transparent: true }));
fs.writeFileSync(path.join(publicDir, 'logo-white.png'), createLogoPNG({ isDark: true, transparent: true }));

// Write white background version
fs.writeFileSync(path.join(publicDir, 'logo-original.png'), createLogoPNG({ isDark: false, transparent: false }));

console.log('PNG logos created successfully in /public !');
