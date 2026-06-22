import { cities } from '../data/cities';
import { countries } from '../data/countries';
import type { Difficulty } from '../store/useGameStore';
import type { City, Country, GenerateOptions } from './types';

/** Superficie minimale (km²) d'un pays selon la difficulté (filtre les petits pays). */
const MIN_AREA: Record<Difficulty, number> = {
  facile: 250_000,
  moyen: 50_000,
  difficile: 0,
};

const distinctContinents = [...new Set(countries.map((c) => c.continent))].sort((a, b) =>
  a.localeCompare(b, 'fr'),
);

/** Liste des continents pour les filtres ('Monde' = tous). */
export const CONTINENTS = ['Monde', ...distinctContinents];

/**
 * Construit le sous-ensemble de données pour une partie, selon le continent et la
 * difficulté. Garde-fou : on garantit au moins 4 pays (nécessaire aux QCM) en
 * relâchant les filtres si besoin.
 */
export function buildGenerateOptions(
  continent: string,
  difficulty: Difficulty,
): GenerateOptions {
  const minArea = MIN_AREA[difficulty];

  let countryPool: Country[] = countries;
  if (continent !== 'Monde') countryPool = countryPool.filter((c) => c.continent === continent);

  const byArea = countryPool.filter((c) => c.area >= minArea);
  const finalCountries =
    byArea.length >= 4 ? byArea : countryPool.length >= 4 ? countryPool : countries;

  let cityPool: City[] = cities;
  if (continent !== 'Monde') {
    const names = new Set(
      countries.filter((c) => c.continent === continent).map((c) => c.name),
    );
    const filtered = cities.filter((c) => names.has(c.country));
    if (filtered.length >= 1) cityPool = filtered;
  }

  return { countries: finalCountries, cities: cityPool };
}
