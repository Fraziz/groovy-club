const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcPath = 'C:/Users/User/.gemini/antigravity-ide/brain/145b25db-f08a-4b3b-8307-adb84acd3dc7/.user_uploaded/media_1791074186679.jpg';
const outDir = path.join(__dirname, 'public/images');

async function processLogo() {
  // Copy original
  fs.copyFileSync(srcPath, path.join(outDir, 'logo-original.jpg'));

  const image = sharp(srcPath);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  // 1. Transparent PNG with exact signature color #CEA370
  // Signature RGB: 206, 163, 112
  const sigBuffer = Buffer.alloc(width * height * 4);

  // 2. Transparent PNG with dark charcoal color #24221F
  // Charcoal RGB: 36, 34, 31
  const darkBuffer = Buffer.alloc(width * height * 4);

  // 3. Transparent PNG preserving original color
  const origBuffer = Buffer.alloc(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const srcIdx = i * 3;
    const destIdx = i * 4;

    const r = data[srcIdx];
    const g = data[srcIdx + 1];
    const b = data[srcIdx + 2];

    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    let alpha = 0;
    if (lum > 30) {
      // Smooth feathering between 30 and 80
      alpha = Math.min(255, Math.max(0, Math.round(((lum - 30) / 50) * 255)));
    }

    // Signature #CEA370
    sigBuffer[destIdx] = 206;
    sigBuffer[destIdx + 1] = 163;
    sigBuffer[destIdx + 2] = 112;
    sigBuffer[destIdx + 3] = alpha;

    // Charcoal #24221F
    darkBuffer[destIdx] = 36;
    darkBuffer[destIdx + 1] = 34;
    darkBuffer[destIdx + 2] = 31;
    darkBuffer[destIdx + 3] = alpha;

    // Original
    origBuffer[destIdx] = r;
    origBuffer[destIdx + 1] = g;
    origBuffer[destIdx + 2] = b;
    origBuffer[destIdx + 3] = alpha;
  }

  // Trim transparent padding to get a clean bounding box
  await sharp(sigBuffer, { raw: { width, height, channels: 4 } })
    .trim()
    .toFile(path.join(outDir, 'logo-signature.png'));

  await sharp(darkBuffer, { raw: { width, height, channels: 4 } })
    .trim()
    .toFile(path.join(outDir, 'logo-charcoal.png'));

  await sharp(origBuffer, { raw: { width, height, channels: 4 } })
    .trim()
    .toFile(path.join(outDir, 'logo-transparent.png'));

  // Also create a compact icon version
  await sharp(path.join(outDir, 'logo-signature.png'))
    .resize(128, 128, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(path.join(outDir, 'logo-icon-128.png'));

  console.log('Processed all logo assets successfully!');
}

processLogo().catch(console.error);
