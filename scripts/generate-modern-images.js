const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");

const DEFAULT_PROFILE = {
  webpQuality: 84,
  avifQuality: 52,
};

const SOURCES = [
  { path: "img/logo-80.jpeg", webpQuality: 90, avifQuality: 60 },
  { path: "img/logo-160.jpeg", webpQuality: 90, avifQuality: 60 },
  { path: "img/share/IMG_4750-400.jpeg", webpQuality: 86, avifQuality: 54 },
  { path: "img/share/IMG_4750-800.jpeg", webpQuality: 86, avifQuality: 54 },
  { path: "img/share/IMG_4755-400.jpeg", webpQuality: 86, avifQuality: 54 },
  { path: "img/share/IMG_4755-800.jpeg", webpQuality: 86, avifQuality: 54 },
  { path: "img/share/IMG_4763-400.jpeg", webpQuality: 86, avifQuality: 54 },
  { path: "img/share/IMG_4763-800.jpeg", webpQuality: 86, avifQuality: 54 },
  { path: "img/share/IMG_4766-400.jpeg", webpQuality: 86, avifQuality: 54 },
  { path: "img/share/IMG_4766-800.jpeg", webpQuality: 86, avifQuality: 54 },
  { path: "img/newspapers/aidez-brigitte-400.jpeg", webpQuality: 92, avifQuality: 66 },
  { path: "img/newspapers/aidez-brigitte-800.jpeg", webpQuality: 92, avifQuality: 66 },
  { path: "img/newspapers/repas-de-noel-400.jpeg", webpQuality: 92, avifQuality: 66 },
  { path: "img/newspapers/repas-de-noel-800.jpeg", webpQuality: 92, avifQuality: 66 },
];

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function convertOne(sourceConfig) {
  const inputPath = sourceConfig.path;
  const absInput = path.resolve(inputPath);
  const parsed = path.parse(absInput);
  const webpPath = path.join(parsed.dir, `${parsed.name}.webp`);
  const avifPath = path.join(parsed.dir, `${parsed.name}.avif`);
  const webpQuality = sourceConfig.webpQuality ?? DEFAULT_PROFILE.webpQuality;
  const avifQuality = sourceConfig.avifQuality ?? DEFAULT_PROFILE.avifQuality;

  if (!(await exists(absInput))) {
    throw new Error(`Source introuvable: ${inputPath}`);
  }

  const source = sharp(absInput).rotate();

  await source
    .clone()
    .webp({
      quality: webpQuality,
      effort: 6,
      smartSubsample: true,
    })
    .toFile(webpPath);

  await source
    .clone()
    .avif({
      quality: avifQuality,
      effort: 6,
      chromaSubsampling: "4:4:4",
    })
    .toFile(avifPath);
}

async function main() {
  for (const sourceConfig of SOURCES) {
    await convertOne(sourceConfig);
    process.stdout.write(`OK ${sourceConfig.path}\n`);
  }
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});
