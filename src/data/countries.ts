import worldCountries from 'world-countries';
import type { Country } from '../engine/types';
import { currencyNames, languageNames } from '../i18n/fr';
import { populations } from './populations';

interface RawCountry {
  cca2: string;
  cca3: string;
  independent: boolean | null;
  unMember: boolean;
  capital: string[];
  region: string;
  area: number;
  latlng: [number, number];
  borders?: string[];
  currencies?: Record<string, { name: string; symbol?: string }>;
  languages?: Record<string, string>;
  name: { common: string };
  translations: Record<string, { common: string }>;
  capitalInfo: { latlng?: [number, number] };
}

// Traduction des régions world-countries en continents français.
const CONTINENT_FR: Record<string, string> = {
  Africa: 'Afrique',
  Americas: 'Amériques',
  Asia: 'Asie',
  Europe: 'Europe',
  Oceania: 'Océanie',
  Antarctic: 'Antarctique',
};

const raw = worldCountries as unknown as RawCountry[];

// Corrections de capitales sur la source `world-countries` :
//   - MN : "Ulan Bator" est une romanisation soviétique désuète → "Ulaanbaatar"
//   - SZ : "Lobamba" est la résidence royale ; la capitale administrative est "Mbabane"
const CAPITAL_OVERRIDES: Record<string, string> = {
  MN: 'Ulaanbaatar',
  SZ: 'Mbabane',
};

// Correspondance code ISO alpha-3 → alpha-2 (minuscules) pour résoudre les frontières.
const cca3ToCca2: Record<string, string> = Object.fromEntries(
  raw.map((c) => [c.cca3, c.cca2.toLowerCase()]),
);

/**
 * Pays jouables : membres de l'ONU disposant d'une capitale et de coordonnées.
 * Données embarquées (offline) via le paquet `world-countries`.
 */
export const countries: Country[] = raw
  .filter((c) => c.unMember && c.capital?.length > 0 && Array.isArray(c.latlng))
  .map((c) => {
    // Code ISO de la monnaie/langue principale (clé de traduction) ; le nom
    // affiché est résolu en français, avec repli sur l'anglais brut si absent.
    const currencyCode = Object.keys(c.currencies ?? {})[0] ?? '';
    const languageCode = Object.keys(c.languages ?? {})[0] ?? '';
    return {
      cca2: c.cca2.toLowerCase(),
      name: c.translations?.fra?.common ?? c.name.common,
      nameEn: c.name.common,
      capital: CAPITAL_OVERRIDES[c.cca2.toUpperCase()] ?? c.capital[0],
      lat: c.latlng[0],
      lng: c.latlng[1],
      capitalLat: c.capitalInfo?.latlng?.[0],
      capitalLng: c.capitalInfo?.latlng?.[1],
      region: c.region,
      continent: CONTINENT_FR[c.region] ?? c.region,
      area: c.area,
      population: populations[c.cca2.toLowerCase()] ?? 0,
      borders: (c.borders ?? []).map((b) => cca3ToCca2[b]).filter(Boolean),
      currencyCode,
      currency: currencyNames[currencyCode] ?? Object.values(c.currencies ?? {})[0]?.name ?? '',
      languageCode,
      language: languageNames[languageCode] ?? Object.values(c.languages ?? {})[0] ?? '',
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name, 'fr'));
