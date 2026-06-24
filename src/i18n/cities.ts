import type { Lang } from './index';

/**
 * Exonymes de villes par langue. Même principe que `capitals.ts` : clé = nom
 * source anglais (tel que stocké dans `src/data/cities.ts`) ; on ne liste que
 * les langues dont le nom **diffère** de la source. L'anglais (`en`) est la
 * source et n'apparaît jamais.
 */
export const cityExonyms: Record<string, Partial<Record<Lang, string>>> = {
  // ─── Amériques ──────────────────────────────────────────────────────────────
  'Mexico City': {
    fr: 'Mexico',
    es: 'Ciudad de México',
    de: 'Mexiko-Stadt',
    it: 'Città del Messico',
    nl: 'Mexico-Stad',
  },
  Havana: { fr: 'La Havane', es: 'La Habana', de: 'Havanna', it: "L'Avana" },
  'Guatemala City': {
    fr: 'Guatemala',
    es: 'Ciudad de Guatemala',
    de: 'Guatemala-Stadt',
    it: 'Città del Guatemala',
    nl: 'Guatemala-Stad',
  },

  // ─── Europe ───────────────────────────────────────────────────────────────
  London: { fr: 'Londres', es: 'Londres', it: 'Londra', nl: 'Londen' },
  Edinburgh: { fr: 'Édimbourg', es: 'Edimburgo', it: 'Edimburgo' },
  Seville: { fr: 'Séville', es: 'Sevilla', de: 'Sevilla', it: 'Siviglia', nl: 'Sevilla' },
  Lisbon: { fr: 'Lisbonne', es: 'Lisboa', de: 'Lissabon', it: 'Lisbona', nl: 'Lissabon' },
  Rome: { es: 'Roma', de: 'Rom', it: 'Roma' },
  Milan: { es: 'Milán', de: 'Mailand', it: 'Milano', nl: 'Milaan' },
  Naples: { es: 'Nápoles', de: 'Neapel', it: 'Napoli', nl: 'Napels' },
  Munich: { es: 'Múnich', de: 'München', it: 'Monaco di Baviera', nl: 'München' },
  Hamburg: { fr: 'Hambourg', es: 'Hamburgo', it: 'Amburgo' },
  Frankfurt: { fr: 'Francfort', es: 'Fráncfort', it: 'Francoforte' },
  Brussels: { fr: 'Bruxelles', es: 'Bruselas', de: 'Brüssel', it: 'Bruxelles', nl: 'Brussel' },
  Zurich: { de: 'Zürich', es: 'Zúrich', it: 'Zurigo', nl: 'Zürich' },
  Geneva: { fr: 'Genève', es: 'Ginebra', de: 'Genf', it: 'Ginevra', nl: 'Genève' },
  Vienna: { fr: 'Vienne', es: 'Viena', de: 'Wien', nl: 'Wenen' },
  Copenhagen: {
    fr: 'Copenhague',
    es: 'Copenhague',
    de: 'Kopenhagen',
    it: 'Copenaghen',
    nl: 'Kopenhagen',
  },
  Warsaw: { fr: 'Varsovie', es: 'Varsovia', de: 'Warschau', it: 'Varsavia', nl: 'Warschau' },
  Prague: { es: 'Praga', de: 'Prag', it: 'Praga', nl: 'Praag' },
  Bucharest: { fr: 'Bucarest', es: 'Bucarest', de: 'Bukarest', it: 'Bucarest', nl: 'Boekarest' },
  Belgrade: { es: 'Belgrado', de: 'Belgrad', it: 'Belgrado', nl: 'Belgrado' },
  Sofia: { es: 'Sofía' },
  Athens: { fr: 'Athènes', es: 'Atenas', de: 'Athen', it: 'Atene', nl: 'Athene' },
  Kyiv: { fr: 'Kiev', es: 'Kiev', de: 'Kiew', it: 'Kiev', nl: 'Kiev' },
  Moscow: { fr: 'Moscou', es: 'Moscú', de: 'Moskau', it: 'Mosca', nl: 'Moskou' },
  'Saint Petersburg': {
    fr: 'Saint-Pétersbourg',
    es: 'San Petersburgo',
    de: 'Sankt Petersburg',
    it: 'San Pietroburgo',
    nl: 'Sint-Petersburg',
  },

  // ─── Afrique ────────────────────────────────────────────────────────────────
  Cairo: { fr: 'Le Caire', es: 'El Cairo', de: 'Kairo', it: 'Il Cairo', nl: 'Caïro' },
  Algiers: { fr: 'Alger', es: 'Argel', de: 'Algier', it: 'Algeri' },
  Tunis: { es: 'Túnez', it: 'Tunisi' },
  Tripoli: { es: 'Trípoli', de: 'Tripolis' },
  Khartoum: { es: 'Jartum', de: 'Khartum', it: 'Khartum', nl: 'Khartoem' },
  'Addis Ababa': {
    fr: 'Addis-Abeba',
    es: 'Adís Abeba',
    de: 'Addis Abeba',
    it: 'Addis Abeba',
    nl: 'Addis Abeba',
  },
  'Cape Town': {
    fr: 'Le Cap',
    es: 'Ciudad del Cabo',
    de: 'Kapstadt',
    it: 'Città del Capo',
    nl: 'Kaapstad',
  },

  // ─── Moyen-Orient & Asie centrale ───────────────────────────────────────────
  Dubai: { fr: 'Dubaï' },
  Riyadh: { fr: 'Riyad', es: 'Riad', de: 'Riad', it: 'Riad', nl: 'Riyad' },
  'Kuwait City': { fr: 'Koweït', es: 'Ciudad de Kuwait', de: 'Kuwait-Stadt', nl: 'Koeweit-Stad' },
  Muscat: { fr: 'Mascate', es: 'Mascate', de: 'Maskat', it: 'Mascate' },
  Baghdad: { fr: 'Bagdad', es: 'Bagdad', de: 'Bagdad', nl: 'Bagdad' },
  Beirut: { fr: 'Beyrouth', nl: 'Beiroet' },
  Damascus: { fr: 'Damas', es: 'Damasco', de: 'Damaskus', it: 'Damasco' },
  Sanaa: { es: 'Saná' },
  Tehran: { fr: 'Téhéran', es: 'Teherán', de: 'Teheran', it: 'Teheran', nl: 'Teheran' },
  Tashkent: { fr: 'Tachkent', es: 'Taskent', de: 'Taschkent', nl: 'Tasjkent' },
  Baku: { fr: 'Bakou', es: 'Bakú', nl: 'Bakoe' },
  Tbilisi: { fr: 'Tbilissi', es: 'Tiflis', de: 'Tiflis' },
  Yerevan: { fr: 'Erevan', es: 'Ereván', de: 'Eriwan', it: 'Erevan', nl: 'Jerevan' },

  // ─── Asie du Sud, de l'Est & du Sud-Est ─────────────────────────────────────
  'New Delhi': { es: 'Nueva Delhi', de: 'Neu-Delhi', it: 'Nuova Delhi' },
  Kathmandu: { fr: 'Katmandou', es: 'Katmandú', it: 'Katmandu' },
  Hanoi: { fr: 'Hanoï', es: 'Hanói' },
  'Ho Chi Minh City': {
    fr: 'Hô Chi Minh-Ville',
    es: 'Ciudad Ho Chi Minh',
    de: 'Ho-Chi-Minh-Stadt',
    nl: 'Ho Chi Minhstad',
  },
  Singapore: { fr: 'Singapour', es: 'Singapur', de: 'Singapur' },
  Manila: { fr: 'Manille', nl: 'Manilla' },
  Beijing: { fr: 'Pékin', es: 'Pekín', de: 'Peking', it: 'Pechino', nl: 'Peking' },
  Seoul: { fr: 'Séoul', es: 'Seúl', it: 'Seul', nl: 'Seoel' },
  Tokyo: { es: 'Tokio', de: 'Tokio', nl: 'Tokio' },
};

/** Nom de ville localisé : exonyme si connu, sinon le nom source (anglais). */
export function cityName(name: string, lang: Lang): string {
  return cityExonyms[name]?.[lang] ?? name;
}
