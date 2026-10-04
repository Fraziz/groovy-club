const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const uploadDir = 'C:/Users/User/.gemini/antigravity-ide/brain/145b25db-f08a-4b3b-8307-adb84acd3dc7/.user_uploaded';
const artDir = path.join(__dirname, 'public/images/artwork');

if (!fs.existsSync(artDir)) {
  fs.mkdirSync(artDir, { recursive: true });
}

async function extractTransparent(srcFile, destFile, signatureColor = [206, 163, 112]) {
  const image = sharp(srcFile);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const outBuffer = Buffer.alloc(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const srcIdx = i * channels;
    const destIdx = i * 4;

    const r = data[srcIdx];
    const g = data[srcIdx + 1];
    const b = data[srcIdx + 2];

    // Luminance
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    let alpha = 0;
    if (lum > 22) {
      alpha = Math.min(255, Math.max(0, Math.round(((lum - 22) / 60) * 255)));
    }

    // Set signature color
    outBuffer[destIdx] = signatureColor[0];
    outBuffer[destIdx + 1] = signatureColor[1];
    outBuffer[destIdx + 2] = signatureColor[2];
    outBuffer[destIdx + 3] = alpha;
  }

  await sharp(outBuffer, { raw: { width, height, channels: 4 } })
    .trim()
    .toFile(destFile);

  console.log('Saved transparent:', destFile);
}

async function run() {
  // 1. Campfire Artwork (GOOD PEOPLE GOOD PLACES GOOD DAYS)
  const campfireSrc = path.join(uploadDir, 'media_1791074003079.jpg');
  fs.copyFileSync(campfireSrc, path.join(artDir, 'art-campfire-original.jpg'));
  await extractTransparent(campfireSrc, path.join(artDir, 'art-campfire-trans.png'));

  // 2. Flower Mascot Artwork
  const flowerSrc = path.join(uploadDir, 'media_1791074037966.jpg');
  fs.copyFileSync(flowerSrc, path.join(artDir, 'art-flower-original.jpg'));
  await extractTransparent(flowerSrc, path.join(artDir, 'art-flower-trans.png'));

  // 3. Headphone Boy Artwork
  const headSrc = path.join(uploadDir, 'media_1791074044422.png');
  fs.copyFileSync(headSrc, path.join(artDir, 'art-headphone-original.png'));
  await extractTransparent(headSrc, path.join(artDir, 'art-headphone-trans.png'));

  // 4. Wordmark with Groovy Curve Wave
  const waveSrc = path.join(uploadDir, 'media_1791074057570.png');
  fs.copyFileSync(waveSrc, path.join(artDir, 'art-wordmark-wave-original.png'));
  // Trim transparent padding
  await sharp(waveSrc).trim().toFile(path.join(artDir, 'art-wordmark-wave-trans.png'));

  console.log('All artwork processed successfully!');
}

run().catch(console.error);
