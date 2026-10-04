const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'public/images');
const artDir = path.join(imgDir, 'artwork');

async function createMockups() {
  // =========================================================================
  // 1. FRONT VIEW: Formal Arched GROOVY CLUB with Groovy Curve Wave
  // =========================================================================
  console.log('Creating formal front view...');
  
  // Start from clean ivory tee base (rebuilding from fresh cropped base or clean patch)
  const frontImg = sharp(path.join(imgDir, 'tee-front.jpg'));
  const { data: fData, info: fInfo } = await frontImg.raw().toBuffer({ resolveWithObject: true });
  const fWidth = fInfo.width;
  const fHeight = fInfo.height;

  // Clean chest area (y: 300 to 480, x: 340 to 684)
  for (let y = 300; y <= 480; y++) {
    for (let x = 340; x <= 684; x++) {
      const destIdx = (y * fWidth + x) * 3;
      // Copy from clean lower chest patch (y + 150)
      const srcY = Math.min(fHeight - 1, y + 160);
      const srcIdx = (srcY * fWidth + x) * 3;
      fData[destIdx] = fData[srcIdx];
      fData[destIdx + 1] = fData[srcIdx + 1];
      fData[destIdx + 2] = fData[srcIdx + 2];
    }
  }

  const cleanFrontBuf = await sharp(fData, { raw: { width: fWidth, height: fHeight, channels: 3 } })
    .jpeg({ quality: 95 })
    .toBuffer();

  // Resize wordmark with wave to formal, elegant proportions (width: 250px)
  const waveLogo = await sharp(path.join(artDir, 'art-wordmark-wave-trans.png'))
    .resize(250, null)
    .toBuffer();

  // Composite wordmark onto chest (center at 512, top at 355)
  const waveMeta = await sharp(waveLogo).metadata();
  const waveLeft = Math.round(512 - waveMeta.width / 2);

  await sharp(cleanFrontBuf)
    .composite([
      {
        input: waveLogo,
        top: 355,
        left: waveLeft,
        blend: 'multiply',
      },
    ])
    .jpeg({ quality: 95 })
    .toFile(path.join(imgDir, 'tee-front.jpg'));

  console.log('Front view created with formal arched GROOVY CLUB & wave underline!');

  // =========================================================================
  // 2. BACK VIEW: Formal "GOOD PEOPLE GOOD PLACES GOOD DAYS" Campfire Art
  // =========================================================================
  console.log('Creating formal back view...');

  const backImg = sharp(path.join(imgDir, 'tee-back.jpg'));
  const { data: bData, info: bInfo } = await backImg.raw().toBuffer({ resolveWithObject: true });
  const bWidth = bInfo.width;
  const bHeight = bInfo.height;

  // Clean old text on back (y: 220 to 520, x: 260 to 764)
  for (let y = 220; y <= 520; y++) {
    for (let x = 260; x <= 764; x++) {
      const destIdx = (y * bWidth + x) * 3;
      // Copy from clean lower back patch (y + 240)
      const srcY = Math.min(bHeight - 1, y + 250);
      const srcIdx = (srcY * bWidth + x) * 3;
      bData[destIdx] = bData[srcIdx];
      bData[destIdx + 1] = bData[srcIdx + 1];
      bData[destIdx + 2] = bData[srcIdx + 2];
    }
  }

  const cleanBackBuf = await sharp(bData, { raw: { width: bWidth, height: bHeight, channels: 3 } })
    .jpeg({ quality: 95 })
    .toBuffer();

  // Resize campfire artwork to statement back graphic size (width ~430px)
  const campfireArt = await sharp(path.join(artDir, 'art-campfire-trans.png'))
    .resize(430, null)
    .toBuffer();

  const campMeta = await sharp(campfireArt).metadata();
  const campLeft = Math.round(512 - campMeta.width / 2);

  await sharp(cleanBackBuf)
    .composite([
      {
        input: campfireArt,
        top: 245,
        left: campLeft,
        blend: 'multiply',
      },
    ])
    .jpeg({ quality: 95 })
    .toFile(path.join(imgDir, 'tee-back.jpg'));

  console.log('Back view created with formal campfire artwork!');

  // =========================================================================
  // 3. Flower Mascot Edition (for secondary product card / modal view)
  // =========================================================================
  const flowerArt = await sharp(path.join(artDir, 'art-flower-trans.png'))
    .resize(420, null)
    .toBuffer();
  const flowerMeta = await sharp(flowerArt).metadata();
  const flowerLeft = Math.round(512 - flowerMeta.width / 2);

  await sharp(cleanBackBuf)
    .composite([
      {
        input: flowerArt,
        top: 250,
        left: flowerLeft,
        blend: 'multiply',
      },
    ])
    .jpeg({ quality: 95 })
    .toFile(path.join(imgDir, 'tee-back-flower.jpg'));

  // =========================================================================
  // 4. Headphone Boy Edition (for third product card / modal view)
  // =========================================================================
  const headArt = await sharp(path.join(artDir, 'art-headphone-trans.png'))
    .resize(400, null)
    .toBuffer();
  const headMeta = await sharp(headArt).metadata();
  const headLeft = Math.round(512 - headMeta.width / 2);

  await sharp(cleanBackBuf)
    .composite([
      {
        input: headArt,
        top: 250,
        left: headLeft,
        blend: 'multiply',
      },
    ])
    .jpeg({ quality: 95 })
    .toFile(path.join(imgDir, 'tee-back-headphone.jpg'));

  console.log('All formal shirt mockups created successfully!');
}

createMockups().catch(console.error);
