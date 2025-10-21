// Generates a 1080x2340 splash image with a warm off-white background and bottom-centered logo
// Requires `sharp` to be installed.

const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

(async () => {
  try {
    const projectRoot = path.resolve(__dirname, '..');
    const outDir = path.join(projectRoot, 'assets');
    const logoPath = path.join(projectRoot, 'logo.png');
    const outPath = path.join(outDir, 'splash-1080x2340.png');

    if (!fs.existsSync(logoPath)) {
      throw new Error(`Logo not found at ${logoPath}`);
    }

    const WIDTH = 1080;
    const HEIGHT = 2340;

    // Background color from app.json (approx of your mock): #FFFAF0
    const background = { r: 255, g: 250, b: 240, alpha: 1 };

    // Read logo and compute a target width keeping margins
    const logoImg = sharp(logoPath);
    const logoMeta = await logoImg.metadata();

    // Target: take ~55% of screen width, keep aspect ratio
    const targetLogoWidth = Math.round(WIDTH * 0.55);
    const scale = targetLogoWidth / (logoMeta.width || targetLogoWidth);
    const targetLogoHeight = Math.round((logoMeta.height || targetLogoWidth) * scale);

    const resizedLogo = await logoImg
      .resize({ width: targetLogoWidth })
      .toBuffer();

    // Position near lower center: e.g., 75% from top, leaving safe margin from bottom
    const logoX = Math.round((WIDTH - targetLogoWidth) / 2);
    const desiredCenterY = Math.round(HEIGHT * 0.72);
    const logoY = Math.max(0, Math.min(HEIGHT - targetLogoHeight - 72, desiredCenterY - Math.round(targetLogoHeight / 2)));

    const backgroundCanvas = sharp({
      create: {
        width: WIDTH,
        height: HEIGHT,
        channels: 4,
        background,
      },
    });

    const composed = await backgroundCanvas
      .composite([
        { input: resizedLogo, left: logoX, top: logoY },
      ])
      .png({ compressionLevel: 9 })
      .toFile(outPath);

    console.log(`Splash generated at ${outPath}`);
  } catch (err) {
    console.error('Failed to generate splash:', err);
    process.exit(1);
  }
})();
