import { countries } from '../data/countries';
import { pick, sample } from '../lib/shuffle';
import type { Country } from './types';

/** Un pays au hasard. */
export function randomCountry(): Country {
  return pick(countries);
}

/** `count` pays distincts différents de `correct` (distracteurs de QCM). */
export function distractors(correct: Country, count = 3): Country[] {
  return sample(
    countries.filter((c) => c.cca2 !== correct.cca2),
    count,
  );
}
