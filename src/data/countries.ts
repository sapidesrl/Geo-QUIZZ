import worldCountries from 'world-countries';
import type { Country } from '../engine/types';
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
  .map((c) => ({
    cca2: c.cca2.toLowerCase(),
    name: c.translations?.fra?.common ?? c.name.common,
    nameEn: c.name.common,
    capital: c.capital[0],
    lat: c.latlng[0],
    lng: c.latlng[1],
    capitalLat: c.capitalInfo?.latlng?.[0],
    capitalLng: c.capitalInfo?.latlng?.[1],
    region: c.region,
    continent: CONTINENT_FR[c.region] ?? c.region,
    area: c.area,
    population: populations[c.cca2.toLowerCase()] ?? 0,
    borders: (c.borders ?? []).map((b) => cca3ToCca2[b]).filter(Boolean),
    currency: Object.values(c.currencies ?? {})[0]?.name ?? '',
    language: Object.values(c.languages ?? {})[0] ?? '',
  }))
  .sort((a, b) => a.name.localeCompare(b.name, 'fr'));
