/**
 * Regroupement des modes par type pour l'écran de sélection. Le rangement vit ici
 * (et non dans chaque mode) pour rester central et facile à faire évoluer.
 */
export type ModeCategory =
  | 'capital'
  | 'flag'
  | 'cities'
  | 'population'
  | 'currency'
  | 'geography'
  | 'worldcup'
  | 'review';

/** Ordre d'affichage des catégories + icône. Le libellé est résolu via i18n. */
export const categoryOrder: { id: ModeCategory; icon: string }[] = [
  { id: 'capital', icon: '🏛️' },
  { id: 'flag', icon: '🚩' },
  { id: 'cities', icon: '📍' },
  { id: 'population', icon: '👥' },
  { id: 'currency', icon: '💰' },
  { id: 'geography', icon: '🌍' },
  { id: 'worldcup', icon: '⚽' },
  { id: 'review', icon: '🎲' },
];

/** Catégorie de chaque mode (clé = `GameMode.id`). */
export const modeCategory: Record<string, ModeCategory> = {
  'capital-mc': 'capital',
  'capital-text': 'capital',
  'capital-to-country-mc': 'capital',
  'flag-mc': 'flag',
  'flag-text': 'flag',
  'locate-city': 'cities',
  'most-populated-mc': 'population',
  'least-populated-mc': 'population',
  'largest-area-mc': 'population',
  'currency-mc': 'currency',
  'continent-mc': 'geography',
  'border-mc': 'geography',
  'language-mc': 'geography',
  'locate-country': 'geography',
  'worldcup-2026': 'worldcup',
  review: 'review',
  mixed: 'review',
};
