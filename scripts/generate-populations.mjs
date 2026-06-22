// Génère src/data/populations.ts (code ISO alpha-2 minuscule -> population) à partir
// du jeu de données ouvert `country-json`. Relancer pour mettre à jour :
//   node scripts/generate-populations.mjs
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const byPopulation = require('country-json/src/country-by-population.json');
const byAbbreviation = require('country-json/src/country-by-abbreviation.json');

const abbrByName = new Map(byAbbreviation.map((e) => [e.country, e.abbreviation]));

// Correctifs pour les pays absents/mal nommés dans la source.
const OVERRIDES = {
  tl: 1267972, // Timor-Leste (East Timor)
};

const populations = { ...OVERRIDES };
for (const { country, population } of byPopulation) {
  const abbr = abbrByName.get(country);
  if (abbr && typeof population === 'number' && population > 0) {
    populations[abbr.toLowerCase()] = population;
  }
}

const sorted = Object.fromEntries(Object.entries(populations).sort(([a], [b]) => a.localeCompare(b)));

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, 'src/data/populations.ts');
const body = `// Généré par scripts/generate-populations.mjs (source : country-json). Ne pas éditer à la main.
// Population par code ISO 3166-1 alpha-2 (minuscule).
export const populations: Record<string, number> = ${JSON.stringify(sorted, null, 2)};
`;
writeFileSync(out, body);
console.log('Écrit', out, '—', Object.keys(sorted).length, 'pays');
