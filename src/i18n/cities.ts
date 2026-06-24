import type { Lang } from './index';

/**
 * Exonymes de villes par langue. Même principe que `capitals.ts` : clé = nom
 * source anglais (tel que stocké dans `src/data/cities.ts`) ; on ne liste que
 * les langues dont le nom **diffère** de la source. L'anglais (`en`) est la
 * source et n'apparaît jamais.
 */
export const cityExonyms: Record<string, Partial<Record<Lang, string>>> = {
  // ─── Amériques ──────────────────────────────────────────────────────────────
  'Mexico City': { fr: 'Mexico', es: 'Ciudad de México', de: 'Mexiko-Stadt', it: 'Città del Messico' },
  Havana: { fr: 'La Havane', es: 'La Habana', de: 'Havanna', it: "L'Avana" },
  'Guatemala City': {
    fr: 'Guatemala',
    es: 'Ciudad de Guatemala',
    de: 'Guatemala-Stadt',
    it: 'Città del Guatemala',
  },

  // ─── Europe ───────────────────────────────────────────────────────────────
  London: { fr: 'Londres', es: 'Londres', it: 'Londra' },
  Edinburgh: { fr: 'Édimbourg', es: 'Edimburgo', it: 'Edimburgo' },
  Seville: { fr: 'Séville', es: 'Sevilla', de: 'Sevilla', it: 'Siviglia' },
  Lisbon: { fr: 'Lisbonne', es: 'Lisboa', de: 'Lissabon', it: 'Lisbona' },
  Rome: { es: 'Roma', de: 'Rom', it: 'Roma' },
  Milan: { es: 'Milán', de: 'Mailand', it: 'Milano' },
  Naples: { es: 'Nápoles', de: 'Neapel', it: 'Napoli' },
  Munich: { es: 'Múnich', de: 'München', it: 'Monaco di Baviera' },
  Hamburg: { fr: 'Hambourg', es: 'Hamburgo', it: 'Amburgo' },
  Frankfurt: { fr: 'Francfort', es: 'Fráncfort', it: 'Francoforte' },
  Brussels: { fr: 'Bruxelles', es: 'Bruselas', de: 'Brüssel', it: 'Bruxelles' },
  Zurich: { de: 'Zürich', es: 'Zúrich', it: 'Zurigo' },
  Geneva: { fr: 'Genève', es: 'Ginebra', de: 'Genf', it: 'Ginevra' },
  Vienna: { fr: 'Vienne', es: 'Viena', de: 'Wien' },
  Copenhagen: { fr: 'Copenhague', es: 'Copenhague', de: 'Kopenhagen', it: 'Copenaghen' },
  Warsaw: { fr: 'Varsovie', es: 'Varsovia', de: 'Warschau', it: 'Varsavia' },
  Prague: { es: 'Praga', de: 'Prag', it: 'Praga' },
  Bucharest: { fr: 'Bucarest', es: 'Bucarest', de: 'Bukarest', it: 'Bucarest' },
  Belgrade: { es: 'Belgrado', de: 'Belgrad', it: 'Belgrado' },
  Sofia: { es: 'Sofía' },
  Athens: { fr: 'Athènes', es: 'Atenas', de: 'Athen', it: 'Atene' },
  Kyiv: { fr: 'Kiev', es: 'Kiev', de: 'Kiew', it: 'Kiev' },
  Moscow: { fr: 'Moscou', es: 'Moscú', de: 'Moskau', it: 'Mosca' },
  'Saint Petersburg': {
    fr: 'Saint-Pétersbourg',
    es: 'San Petersburgo',
    de: 'Sankt Petersburg',
    it: 'San Pietroburgo',
  },

  // ─── Afrique ────────────────────────────────────────────────────────────────
  Cairo: { fr: 'Le Caire', es: 'El Cairo', de: 'Kairo', it: 'Il Cairo' },
  Algiers: { fr: 'Alger', es: 'Argel', de: 'Algier', it: 'Algeri' },
  Tunis: { es: 'Túnez', it: 'Tunisi' },
  Tripoli: { es: 'Trípoli', de: 'Tripolis' },
  Khartoum: { es: 'Jartum', de: 'Khartum', it: 'Khartum' },
  'Addis Ababa': { fr: 'Addis-Abeba', es: 'Adís Abeba', de: 'Addis Abeba', it: 'Addis Abeba' },
  'Cape Town': { fr: 'Le Cap', es: 'Ciudad del Cabo', de: 'Kapstadt', it: 'Città del Capo' },

  // ─── Moyen-Orient & Asie centrale ───────────────────────────────────────────
  Dubai: { fr: 'Dubaï' },
  Riyadh: { fr: 'Riyad', es: 'Riad', de: 'Riad', it: 'Riad' },
  'Kuwait City': { fr: 'Koweït', es: 'Ciudad de Kuwait', de: 'Kuwait-Stadt' },
  Muscat: { fr: 'Mascate', es: 'Mascate', de: 'Maskat', it: 'Mascate' },
  Baghdad: { fr: 'Bagdad', es: 'Bagdad', de: 'Bagdad' },
  Beirut: { fr: 'Beyrouth' },
  Damascus: { fr: 'Damas', es: 'Damasco', de: 'Damaskus', it: 'Damasco' },
  Sanaa: { es: 'Saná' },
  Tehran: { fr: 'Téhéran', es: 'Teherán', de: 'Teheran', it: 'Teheran' },
  Tashkent: { fr: 'Tachkent', es: 'Taskent', de: 'Taschkent' },
  Baku: { fr: 'Bakou', es: 'Bakú' },
  Tbilisi: { fr: 'Tbilissi', es: 'Tiflis', de: 'Tiflis' },
  Yerevan: { fr: 'Erevan', es: 'Ereván', de: 'Eriwan', it: 'Erevan' },

  // ─── Asie du Sud, de l'Est & du Sud-Est ─────────────────────────────────────
  'New Delhi': { es: 'Nueva Delhi', de: 'Neu-Delhi', it: 'Nuova Delhi' },
  Kathmandu: { fr: 'Katmandou', es: 'Katmandú', it: 'Katmandu' },
  Hanoi: { fr: 'Hanoï', es: 'Hanói' },
  'Ho Chi Minh City': { fr: 'Hô Chi Minh-Ville', es: 'Ciudad Ho Chi Minh', de: 'Ho-Chi-Minh-Stadt' },
  Singapore: { fr: 'Singapour', es: 'Singapur', de: 'Singapur' },
  Manila: { fr: 'Manille' },
  Beijing: { fr: 'Pékin', es: 'Pekín', de: 'Peking', it: 'Pechino' },
  Seoul: { fr: 'Séoul', es: 'Seúl', it: 'Seul' },
  Tokyo: { es: 'Tokio', de: 'Tokio' },
};

/** Nom de ville localisé : exonyme si connu, sinon le nom source (anglais). */
export function cityName(name: string, lang: Lang): string {
  return cityExonyms[name]?.[lang] ?? name;
}
