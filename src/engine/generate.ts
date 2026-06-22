import { cities } from '../data/cities';
import { countries } from '../data/countries';
import { pick, sample } from '../lib/shuffle';
import type { Country, GenerateOptions } from './types';

/** Sous-ensemble par défaut : toutes les données (utilisé hors filtres UX). */
export const defaultGenerateOptions: GenerateOptions = { countries, cities };

/** Un pays au hasard dans le sous-ensemble. */
export function randomCountry(pool: Country[]): Country {
  return pick(pool);
}

/** `count` pays distincts différents de `correct` (distracteurs de QCM). */
export function distractors(pool: Country[], correct: Country, count = 3): Country[] {
  return sample(
    pool.filter((c) => c.cca2 !== correct.cca2),
    count,
  );
}

/** Restreint un pool aux pays dont la population est connue (avec garde-fou ≥ 4). */
export function withPopulation(pool: Country[]): Country[] {
  const known = pool.filter((c) => c.population > 0);
  return known.length >= 4 ? known : countries.filter((c) => c.population > 0);
}
