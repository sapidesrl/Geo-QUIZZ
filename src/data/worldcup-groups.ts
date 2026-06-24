import type { Lang } from '../i18n';
import { capitalName, countryName } from '../i18n/display';
import { countries } from './countries';

/**
 * Groupes de la Coupe du monde 2026 — tirage officiel : 12 groupes (A à L) de 4
 * équipes. Sert au mode « association » (relier chaque pays à son drapeau et à
 * sa capitale).
 *
 * Les codes sont des cca2 (minuscules) tels qu'utilisés par le jeu. Trois équipes
 * ne sont pas membres de l'ONU et n'existent donc pas dans `countries.ts` —
 * Angleterre (`gb-eng`), Écosse (`gb-sct`), Curaçao (`cw`) — elles sont définies
 * dans `extraTeams` (drapeau flag-icons + nom localisé + capitale).
 */
export interface WorldCupGroup {
  id: string; // lettre du groupe (A…L)
  teams: string[]; // 4 codes
}

export const worldCupGroups: WorldCupGroup[] = [
  { id: 'A', teams: ['mx', 'za', 'kr', 'cz'] },
  { id: 'B', teams: ['ca', 'ba', 'qa', 'ch'] },
  { id: 'C', teams: ['br', 'ma', 'ht', 'gb-sct'] },
  { id: 'D', teams: ['us', 'py', 'au', 'tr'] },
  { id: 'E', teams: ['de', 'cw', 'ci', 'ec'] },
  { id: 'F', teams: ['nl', 'jp', 'se', 'tn'] },
  { id: 'G', teams: ['be', 'eg', 'ir', 'nz'] },
  { id: 'H', teams: ['es', 'cv', 'sa', 'uy'] },
  { id: 'I', teams: ['fr', 'sn', 'iq', 'no'] },
  { id: 'J', teams: ['ar', 'dz', 'at', 'jo'] },
  { id: 'K', teams: ['pt', 'cd', 'uz', 'co'] },
  { id: 'L', teams: ['gb-eng', 'hr', 'gh', 'pa'] },
];

/** Équipes hors `countries` (non-membres de l'ONU) : noms par langue + capitale. */
interface ExtraTeam {
  flag: string; // code flag-icons
  names: Record<Lang, string>;
  capital: string; // nom source (anglais), localisé via capitalName()
}

const extraTeams: Record<string, ExtraTeam> = {
  'gb-eng': {
    flag: 'gb-eng',
    names: { fr: 'Angleterre', en: 'England', es: 'Inglaterra', de: 'England', it: 'Inghilterra' },
    capital: 'London',
  },
  'gb-sct': {
    flag: 'gb-sct',
    names: { fr: 'Écosse', en: 'Scotland', es: 'Escocia', de: 'Schottland', it: 'Scozia' },
    capital: 'Edinburgh',
  },
  cw: {
    flag: 'cw',
    names: { fr: 'Curaçao', en: 'Curaçao', es: 'Curazao', de: 'Curaçao', it: 'Curaçao' },
    capital: 'Willemstad',
  },
};

const byCode = new Map(countries.map((c) => [c.cca2, c]));

export interface ResolvedTeam {
  code: string; // identifiant unique dans le groupe
  flag: string; // code flag-icons (= code pour les membres ONU)
  name: string; // nom localisé
  capital: string; // capitale localisée
}

/** Résout un code d'équipe en données affichables, localisées dans la langue courante. */
export function resolveTeam(code: string, lang: Lang): ResolvedTeam {
  const country = byCode.get(code);
  if (country) {
    return {
      code,
      flag: country.cca2,
      name: countryName(country),
      capital: capitalName(country.capital),
    };
  }
  const extra = extraTeams[code];
  return {
    code,
    flag: extra.flag,
    name: extra.names[lang] ?? extra.names.en,
    capital: capitalName(extra.capital),
  };
}
