import type { Lang } from './index';

/**
 * Exonymes de capitales par langue. `Intl.DisplayNames` ne gère pas les noms de
 * villes : on embarque donc un dictionnaire (offline).
 *
 * Clé = nom source (anglais) tel que fourni par `world-countries`. Pour chaque
 * capitale, on ne liste que les langues dont le nom **diffère** de la source ;
 * sinon on garde la source (voir `capitalName`). L'anglais (`en`) est la source,
 * il n'apparaît jamais.
 */
export const capitalExonyms: Record<string, Partial<Record<Lang, string>>> = {
  // ─── Europe ───────────────────────────────────────────────────────────────
  'Andorra la Vella': { fr: 'Andorre-la-Vieille', es: 'Andorra la Vieja' },
  Vienna: { fr: 'Vienne', es: 'Viena', de: 'Wien', nl: 'Wenen' },
  Brussels: { fr: 'Bruxelles', es: 'Bruselas', de: 'Brüssel', it: 'Bruxelles', nl: 'Brussel' },
  Sofia: { es: 'Sofía' },
  Prague: { es: 'Praga', de: 'Prag', it: 'Praga', nl: 'Praag' },
  Copenhagen: {
    fr: 'Copenhague',
    es: 'Copenhague',
    de: 'Kopenhagen',
    it: 'Copenaghen',
    nl: 'Kopenhagen',
  },
  Athens: { fr: 'Athènes', es: 'Atenas', de: 'Athen', it: 'Atene', nl: 'Athene' },
  Reykjavik: { es: 'Reikiavik' },
  Rome: { es: 'Roma', de: 'Rom', it: 'Roma' },
  Luxembourg: { es: 'Luxemburgo', de: 'Luxemburg', it: 'Lussemburgo', nl: 'Luxemburg' },
  Valletta: { fr: 'La Valette', es: 'La Valeta', it: 'La Valletta' },
  Warsaw: { fr: 'Varsovie', es: 'Varsovia', de: 'Warschau', it: 'Varsavia', nl: 'Warschau' },
  Lisbon: { fr: 'Lisbonne', es: 'Lisboa', de: 'Lissabon', it: 'Lisbona', nl: 'Lissabon' },
  Bucharest: { fr: 'Bucarest', es: 'Bucarest', de: 'Bukarest', it: 'Bucarest', nl: 'Boekarest' },
  Moscow: { fr: 'Moscou', es: 'Moscú', de: 'Moskau', it: 'Mosca', nl: 'Moskou' },
  Belgrade: { es: 'Belgrado', de: 'Belgrad', it: 'Belgrado', nl: 'Belgrado' },
  Bern: { fr: 'Berne', es: 'Berna', it: 'Berna' },
  Kyiv: { fr: 'Kiev', es: 'Kiev', de: 'Kiew', it: 'Kiev', nl: 'Kiev' },
  London: { fr: 'Londres', es: 'Londres', it: 'Londra', nl: 'Londen' },
  Edinburgh: { fr: 'Édimbourg', es: 'Edimburgo', it: 'Edimburgo' },

  // ─── Amériques ──────────────────────────────────────────────────────────────
  Havana: { fr: 'La Havane', es: 'La Habana', de: 'Havanna', it: "L'Avana" },
  'Mexico City': {
    fr: 'Mexico',
    es: 'Ciudad de México',
    de: 'Mexiko-Stadt',
    it: 'Città del Messico',
    nl: 'Mexico-Stad',
  },
  'Panama City': { fr: 'Panama', es: 'Ciudad de Panamá', de: 'Panama-Stadt', nl: 'Panama-Stad' },
  'Guatemala City': {
    fr: 'Guatemala',
    es: 'Ciudad de Guatemala',
    de: 'Guatemala-Stadt',
    it: 'Città del Guatemala',
    nl: 'Guatemala-Stad',
  },

  // ─── Asie ─────────────────────────────────────────────────────────────────
  Kabul: { fr: 'Kaboul', nl: 'Kaboel' },
  Yerevan: { fr: 'Erevan', es: 'Ereván', de: 'Eriwan', it: 'Erevan', nl: 'Jerevan' },
  Baku: { fr: 'Bakou', es: 'Bakú', nl: 'Bakoe' },
  Beijing: { fr: 'Pékin', es: 'Pekín', de: 'Peking', it: 'Pechino', nl: 'Peking' },
  Tbilisi: { fr: 'Tbilissi', es: 'Tiflis', de: 'Tiflis' },
  Tehran: { fr: 'Téhéran', es: 'Teherán', de: 'Teheran', it: 'Teheran', nl: 'Teheran' },
  Baghdad: { fr: 'Bagdad', es: 'Bagdad', de: 'Bagdad', nl: 'Bagdad' },
  Jerusalem: { fr: 'Jérusalem', es: 'Jerusalén', it: 'Gerusalemme', nl: 'Jeruzalem' },
  Tokyo: { es: 'Tokio', de: 'Tokio', nl: 'Tokio' },
  'Kuwait City': { fr: 'Koweït', es: 'Ciudad de Kuwait', de: 'Kuwait-Stadt', nl: 'Koeweit-Stad' },
  Beirut: { fr: 'Beyrouth', nl: 'Beiroet' },
  Ulaanbaatar: {
    fr: 'Oulan-Bator',
    es: 'Ulán Bator',
    de: 'Ulan-Bator',
    it: 'Ulan Bator',
    nl: 'Oelaanbaatar',
  },
  Muscat: { fr: 'Mascate', es: 'Mascate', de: 'Maskat', it: 'Mascate' },
  Pyongyang: { es: 'Pionyang', de: 'Pjöngjang' },
  Riyadh: { fr: 'Riyad', es: 'Riad', de: 'Riad', it: 'Riad', nl: 'Riyad' },
  Singapore: { fr: 'Singapour', es: 'Singapur', de: 'Singapur' },
  Seoul: { fr: 'Séoul', es: 'Seúl', it: 'Seul', nl: 'Seoel' },
  Damascus: { fr: 'Damas', es: 'Damasco', de: 'Damaskus', it: 'Damasco' },
  Tashkent: { fr: 'Tachkent', es: 'Taskent', de: 'Taschkent', nl: 'Tasjkent' },
  Kathmandu: { fr: 'Katmandou', es: 'Katmandú', it: 'Katmandu' },
  Manila: { fr: 'Manille', nl: 'Manilla' },
  'New Delhi': { es: 'Nueva Delhi', de: 'Neu-Delhi', it: 'Nuova Delhi' },
  Hanoi: { fr: 'Hanoï', es: 'Hanói' },
  Sanaa: { es: 'Saná' },
  Vientiane: { es: 'Vientián' },
  Thimphu: { fr: 'Thimphou', es: 'Timbu' },
  Bishkek: { fr: 'Bichkek', es: 'Biskek', de: 'Bischkek', nl: 'Bisjkek' },
  Ashgabat: { fr: 'Achgabat', es: 'Asjabad', de: 'Aschgabat', nl: 'Asjchabad' },
  Dushanbe: { fr: 'Douchanbé', es: 'Dusambé' },
  'Abu Dhabi': { fr: 'Abou Dabi', es: 'Abu Dabi' },

  // ─── Europe (compléments) ──────────────────────────────────────────────────
  Nicosia: { fr: 'Nicosie', de: 'Nikosia' },
  'Vatican City': {
    fr: 'Cité du Vatican',
    es: 'Ciudad del Vaticano',
    de: 'Vatikanstadt',
    it: 'Città del Vaticano',
    nl: 'Vaticaanstad',
  },

  // ─── Afrique ────────────────────────────────────────────────────────────────
  Algiers: { fr: 'Alger', es: 'Argel', de: 'Algier', it: 'Algeri' },
  Cairo: { fr: 'Le Caire', es: 'El Cairo', de: 'Kairo', it: 'Il Cairo', nl: 'Caïro' },
  'Addis Ababa': {
    fr: 'Addis-Abeba',
    es: 'Adís Abeba',
    de: 'Addis Abeba',
    it: 'Addis Abeba',
    nl: 'Addis Abeba',
  },
  Khartoum: { es: 'Jartum', de: 'Khartum', it: 'Khartum', nl: 'Khartoem' },
  Mogadishu: { fr: 'Mogadiscio', es: 'Mogadiscio', de: 'Mogadischu', it: 'Mogadiscio' },
  Tripoli: { es: 'Trípoli', de: 'Tripolis' },
  Tunis: { es: 'Túnez', it: 'Tunisi' },
  "N'Djamena": { es: 'Yamena' },
};

/** Nom de capitale localisé : exonyme si connu, sinon le nom source (anglais). */
export function capitalName(capital: string, lang: Lang): string {
  return capitalExonyms[capital]?.[lang] ?? capital;
}
