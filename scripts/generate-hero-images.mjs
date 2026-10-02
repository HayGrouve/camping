// Builds the responsive hero photos in public/images from the full-size originals.
// Run manually with `pnpm generate-hero-images`; the outputs are committed, so the
// regular build never needs the originals (they are cached in .cache/photos).
import sharp from 'sharp';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cacheDir = join(__dirname, '../.cache/photos');
const outputDir = join(__dirname, '../public/images');

// Both photos are CC0 (public domain dedication), originally published on Unsplash.
const PHOTOS = [
  {
    name: 'camp-dusk',
    // Cristian Grecu, https://commons.wikimedia.org/wiki/File:Cristian_Grecu_2017-05-23_(Unsplash_xQYW7brEauY).jpg
    source:
      'https://upload.wikimedia.org/wikipedia/commons/f/f5/Cristian_Grecu_2017-05-23_%28Unsplash_xQYW7brEauY%29.jpg',
    // Focal point (the tent) as a fraction of the original width / height.
    focus: [0.42, 0.58],
  },
  {
    name: 'camp-morning',
    // Christopher Jolly, https://commons.wikimedia.org/wiki/File:Camping_in_the_mountains_(Unsplash).jpg
    source:
      'https://upload.wikimedia.org/wikipedia/commons/e/e2/Camping_in_the_mountains_%28Unsplash%29.jpg',
    focus: [0.51, 0.5],
  },
];

const PORTRAIT_WIDTHS = [720, 1080, 1440];
const LANDSCAPE_WIDTHS = [640, 960, 1440, 1920];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const loadOriginal = async ({ name, source }) => {
  const cached = join(cacheDir, `${name}.jpg`);
  if (!existsSync(cached)) {
    mkdirSync(cacheDir, { recursive: true });
    const response = await fetch(source, {
      headers: { 'User-Agent': 'camping-checklist/1.0 (hero image build script)' },
    });
    if (!response.ok) throw new Error(`Could not download ${source}: ${response.status}`);
    writeFileSync(cached, Buffer.from(await response.arrayBuffer()));
  }
  return cached;
};

const writeVariants = async (input, region, widths, baseName) => {
  for (const width of widths) {
    const pipeline = sharp(input).extract(region).resize({ width });
    await pipeline.clone().avif({ quality: 52, effort: 7 }).toFile(`${baseName}-${width}.avif`);
    await pipeline.clone().jpeg({ quality: 74, mozjpeg: true }).toFile(`${baseName}-${width}.jpg`);
  }
};

mkdirSync(outputDir, { recursive: true });

for (const photo of PHOTOS) {
  const input = await loadOriginal(photo);
  const { width, height } = await sharp(input).metadata();
  const [focusX, focusY] = photo.focus;

  // Portrait: full height, 3:4, centred on the tent. Used by the pinned desktop panel.
  const portraitWidth = Math.round(height * 0.75);
  const portrait = {
    left: clamp(Math.round(width * focusX - portraitWidth / 2), 0, width - portraitWidth),
    top: 0,
    width: portraitWidth,
    height,
  };

  // Landscape: a slightly tighter 3:2 frame so the tent still reads on a phone.
  const landscapeWidth = Math.round(width * 0.8);
  const landscapeHeight = Math.round(height * 0.8);
  const landscape = {
    left: clamp(Math.round(width * focusX - landscapeWidth / 2), 0, width - landscapeWidth),
    top: clamp(Math.round(height * focusY - landscapeHeight / 2), 0, height - landscapeHeight),
    width: landscapeWidth,
    height: landscapeHeight,
  };

  await writeVariants(input, portrait, PORTRAIT_WIDTHS, join(outputDir, `${photo.name}-portrait`));
  await writeVariants(input, landscape, LANDSCAPE_WIDTHS, join(outputDir, `${photo.name}-landscape`));
  console.log(`Generated ${photo.name}`);
}
