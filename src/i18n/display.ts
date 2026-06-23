import { countries } from '../data/countries';
import type { Country } from '../engine/types';
import { currencyNames, languageNames } from './fr';
import i18n from './index';

/**
 * Résolution des noms de données (pays, monnaies, langues, continents) dans la
 * langue d'interface courante. On s'appuie sur `Intl.DisplayNames` (données CLDR
 * intégrées au navigateur, hors-ligne, toutes locales), avec repli sur les
 * dictionnaires français embarqués si la plateforme ne connaît pas un code.
 */

// Cache des instances Intl.DisplayNames par (langue + type) : leur création est coûteuse.
const cache = new Map<string, Intl.DisplayNames>();
function display(type: 'region' | 'currency' | 'language'): Intl.DisplayNames {
  const key = `${i18n.language}:${type}`;
  let dn = cache.get(key);
  if (!dn) {
    dn = new Intl.DisplayNames([i18n.language], { type });
    cache.set(key, dn);
  }
  return dn;
}

/** Nom de pays localisé (ISO 3166-1 alpha-2), repli sur le nom français embarqué. */
export function countryName(country: Country): string {
  try {
    return display('region').of(country.cca2.toUpperCase()) ?? country.name;
  } catch {
    return country.name;
  }
}

/** Nom de monnaie localisé (ISO 4217), repli sur le dictionnaire français. */
export function currencyName(code: string): string {
  if (!code) return '';
  try {
    const name = display('currency').of(code);
    if (name && name.toLowerCase() !== code.toLowerCase()) return name;
  } catch {
    /* repli ci-dessous */
  }
  return currencyNames[code] ?? code;
}

// ISO 639-3 (world-countries) → BCP-47 connu d'Intl. Les codes absents
// (créoles, langues régionales sans donnée CLDR) retombent sur le dico français.
const ISO639_3_TO_BCP: Record<string, string> = {
  afr: 'af', amh: 'am', ara: 'ar', aym: 'ay', aze: 'az', bar: 'bar', bel: 'be',
  ben: 'bn', bis: 'bi', bos: 'bs', bul: 'bg', cat: 'ca', ces: 'cs', cnr: 'cnr',
  crs: 'crs', dan: 'da', deu: 'de', div: 'dv', dzo: 'dz', ell: 'el', eng: 'en',
  est: 'et', fas: 'fa', fin: 'fi', fra: 'fr', grn: 'gn', hrv: 'hr', hun: 'hu',
  hye: 'hy', ind: 'id', isl: 'is', ita: 'it', jpn: 'ja', kat: 'ka', kaz: 'kk',
  khm: 'km', kir: 'ky', kor: 'ko', lao: 'lo', lav: 'lv', lit: 'lt', mkd: 'mk',
  mon: 'mn', msa: 'ms', mya: 'my', nep: 'ne', nld: 'nl', nno: 'nn', pol: 'pl',
  por: 'pt', prs: 'prs', ron: 'ro', rus: 'ru', sin: 'si', slk: 'sk', slv: 'sl',
  spa: 'es', sqi: 'sq', srp: 'sr', swe: 'sv', tha: 'th', tur: 'tr', ukr: 'uk',
  vie: 'vi', zho: 'zh',
};

/** Nom de langue localisé (ISO 639-3), repli sur le dictionnaire français. */
export function languageName(code: string): string {
  if (!code) return '';
  const bcp = ISO639_3_TO_BCP[code];
  if (bcp) {
    try {
      const name = display('language').of(bcp);
      if (name && name.toLowerCase() !== bcp.toLowerCase()) return name;
    } catch {
      /* repli ci-dessous */
    }
  }
  return languageNames[code] ?? code;
}

/** Libellé de continent localisé à partir de la région world-countries (clé stable). */
export function continentLabel(region: string): string {
  return i18n.t(`continents.${region}`, { defaultValue: region });
}

// Valeur de filtre continent (en français, persistée) → région world-countries.
const regionByContinentFr = new Map(countries.map((c) => [c.continent, c.region]));

/** Libellé localisé d'une valeur de filtre continent ('Monde' ou nom FR persisté). */
export function continentFilterLabel(value: string): string {
  if (value === 'Monde') return i18n.t('filters.world');
  const region = regionByContinentFr.get(value);
  return region ? continentLabel(region) : value;
}

// Nom français de pays (tel que stocké dans les villes) → objet Country.
const countryByFrName = new Map(countries.map((c) => [c.name, c]));

/** Nom de pays localisé à partir du nom français d'une ville (`city.country`). */
export function cityCountryName(frName: string): string {
  const country = countryByFrName.get(frName);
  return country ? countryName(country) : frName;
}
