// Génère les images sources (PNG) consommées par @capacitor/assets, à partir du
// logo « globe » de l'app. Relancer après modification du logo :
//   node scripts/generate-source-assets.mjs && npx capacitor-assets generate
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const NAVY = '#0f172a';
const SKY = '#38bdf8';
const PINK = '#f472b6';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(root, 'assets');
mkdirSync(outDir, { recursive: true });

/** Dessine un globe stylisé centré en (cx,cy) de rayon R. */
function globe(cx, cy, R, sw) {
  const rx = R * 0.45;
  const w = R * 0.86; // demi-largeur des parallèles à ±0,5R
  return `
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${SKY}" stroke-width="${sw}"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${R}" fill="none" stroke="${SKY}" stroke-width="${sw}"/>
    <line x1="${cx - R}" y1="${cy}" x2="${cx + R}" y2="${cy}" stroke="${SKY}" stroke-width="${sw}"/>
    <line x1="${cx - w}" y1="${cy - R * 0.5}" x2="${cx + w}" y2="${cy - R * 0.5}" stroke="${SKY}" stroke-width="${sw * 0.75}" opacity="0.75"/>
    <line x1="${cx - w}" y1="${cy + R * 0.5}" x2="${cx + w}" y2="${cy + R * 0.5}" stroke="${SKY}" stroke-width="${sw * 0.75}" opacity="0.75"/>
  `;
}

/** Marqueur de localisation (point) en (x,y). */
function pin(x, y, r) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${PINK}" stroke="#ffffff" stroke-width="${r * 0.16}"/>`;
}

function svg(size, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${body}</svg>`;
}

// 1024 : icône complète (fond + globe) — iOS et fallback.
const iconOnly = svg(
  1024,
  `<rect width="1024" height="1024" fill="${NAVY}"/>${globe(512, 512, 300, 26)}${pin(660, 360, 58)}`,
);

// 1024 : avant-plan adaptatif Android (fond transparent, contenu dans la zone sûre).
const iconForeground = svg(
  1024,
  `${globe(512, 512, 240, 24)}${pin(630, 384, 46)}`,
);

// 1024 : arrière-plan adaptatif Android (aplat).
const iconBackground = svg(1024, `<rect width="1024" height="1024" fill="${NAVY}"/>`);

// 2732 : écran de démarrage (globe centré + nom de l'app).
const splash = svg(
  2732,
  `<rect width="2732" height="2732" fill="${NAVY}"/>
   ${globe(1366, 1150, 430, 34)}${pin(1660, 940, 84)}
   <text x="1366" y="1900" text-anchor="middle" font-family="-apple-system, Segoe UI, Roboto, sans-serif" font-size="240" font-weight="800" fill="#e2e8f0">Geo-QUIZZ</text>`,
);

// Icône maskable PWA : globe plus petit (zone sûre) sur fond plein.
const maskable = svg(
  1024,
  `<rect width="1024" height="1024" fill="${NAVY}"/>${globe(512, 512, 210, 22)}${pin(620, 400, 42)}`,
);

const jobs = [
  // Sources @capacitor/assets (natif)
  [outDir, 'icon-only.png', iconOnly, 1024],
  [outDir, 'icon-foreground.png', iconForeground, 1024],
  [outDir, 'icon-background.png', iconBackground, 1024],
  [outDir, 'splash.png', splash, 2732],
  [outDir, 'splash-dark.png', splash, 2732],
  // Icônes PWA (web)
  [resolve(root, 'public'), 'pwa-192.png', iconOnly, 192],
  [resolve(root, 'public'), 'pwa-512.png', iconOnly, 512],
  [resolve(root, 'public'), 'pwa-maskable-512.png', maskable, 512],
];

for (const [dir, name, markup, size] of jobs) {
  await sharp(Buffer.from(markup), { density: 384 })
    .resize(size, size)
    .png()
    .toFile(resolve(dir, name));
  console.log('écrit', name);
}
