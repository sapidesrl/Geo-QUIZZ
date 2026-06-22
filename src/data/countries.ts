import worldCountries from 'world-countries';
import type { Country } from '../engine/types';

interface RawCountry {
  cca2: string;
  independent: boolean | null;
  unMember: boolean;
  capital: string[];
  region: string;
  area: number;
  latlng: [number, number];
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

/**
 * Pays jouables : membres de l'ONU disposant d'une capitale et de coordonnées.
 * Données embarquées (offline) via le paquet `world-countries`.
 */
export const countries: Country[] = (worldCountries as unknown as RawCountry[])
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
  }))
  .sort((a, b) => a.name.localeCompare(b.name, 'fr'));
