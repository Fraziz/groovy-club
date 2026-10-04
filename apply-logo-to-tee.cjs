const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function applyLogo() {
  const teeImg = sharp(path.join(__dirname, 'public/images/tee-front.jpg'));
  const { data, info } = await teeImg.raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  // Chest bounding box: left 380 to 644, top 330 to 460
  // Clean old text by copying fabric noise from immediately adjacent clean areas (left 200-340 and right 680-820)
  for (let y = 330; y <= 460; y++) {
    for (let x = 380; x <= 644; x++) {
      const destIdx = (y * width + x) * 3;
      // Interpolate from left clean patch (x - 200) and right clean patch (x + 200)
      const srcX = x < 512 ? x - 180 : x + 180;
      const srcIdx = (y * width + srcX) * 3;

      data[destIdx] = data[srcIdx];
      data[destIdx + 1] = data[srcIdx + 1];
      data[destIdx + 2] = data[srcIdx + 2];
    }
  }

  // Save the cleaned tee
  const cleanTeeBuffer = await sharp(data, { raw: { width, height, channels: 3 } })
    .jpeg({ quality: 95 })
    .toBuffer();

  // Resize user's signature logo to perfect chest proportion (width ~200px)
  const logoResized = await sharp(path.join(__dirname, 'public/images/logo-signature.png'))
    .resize(210, null)
    .toBuffer();

  // Composite the user's logo onto the tee chest
  // Center is at x = 512 - 105 = 407, y = 350
  await sharp(cleanTeeBuffer)
    .composite([
      {
        input: logoResized,
        top: 345,
        left: 407,
        blend: 'multiply',
      },
    ])
    .jpeg({ quality: 95 })
    .toFile(path.join(__dirname, 'public/images/tee-front.jpg'));

  // Clean test file if exists
  if (fs.existsSync(path.join(__dirname, 'public/images/test-chest.jpg'))) {
    fs.unlinkSync(path.join(__dirname, 'public/images/test-chest.jpg'));
  }

  console.log('Successfully applied user logo to tee-front.jpg!');
}

applyLogo().catch(console.error);
