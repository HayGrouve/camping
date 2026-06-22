import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = join(__dirname, '../public/og-image.png');

const width = 1200;
const height = 630;

const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1f1b17"/>
      <stop offset="100%" stop-color="#2e2822"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect x="120" y="420" width="960" height="12" rx="6" fill="#4a4239"/>
  <rect x="120" y="420" width="576" height="12" rx="6" fill="#6b9b5a"/>
  <path fill="#6b9b5a" d="M600 180 L480 360 h240 L600 180zm0 60 L552 330 h96 L600 240z"/>
  <text x="600" y="290" text-anchor="middle" fill="#f0ebe3" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="56" font-weight="700">Ceko's Camping Checklist</text>
  <text x="600" y="395" text-anchor="middle" fill="#a89f94" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="32">Pack smarter for your next trip</text>
</svg>
`;

const png = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync(outputPath, png);
console.log(`Generated ${outputPath} (${width}x${height})`);
