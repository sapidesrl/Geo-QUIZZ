import type { GameMode, Question } from '../engine/types';
import { pick } from '../lib/shuffle';
import { capitalMc } from './capital-mc';
import { capitalText } from './capital-text';
import { capitalToCountryMc } from './capital-to-country-mc';
import { continentMc } from './continent-mc';
import { currencyMc } from './currency-mc';
import { flagMc } from './flag-mc';
import { flagText } from './flag-text';
import { languageMc } from './language-mc';
import { locateCountry } from './locate-country';

/**
 * Modes centrés sur un pays-sujet : les seuls pertinents pour réviser un pays
 * précis (on exclut les comparatifs, les villes et la Coupe du monde).
 */
const reviewGenerators: GameMode[] = [
  capitalMc,
  capitalText,
  capitalToCountryMc,
  flagMc,
  flagText,
  continentMc,
  currencyMc,
  languageMc,
  locateCountry,
];

/**
 * Mode « Révision » : variadique, il pioche un mode au hasard. Le sous-ensemble
 * de pays à réviser (boîtes de Leitner les plus basses) est fourni par l'appelant
 * via `options.countries` (voir `Game.tsx` + `lib/review.selectReviewPool`).
 */
export const review: GameMode = {
  id: 'review',
  label: 'Révision — mes erreurs',
  description: 'Rejoue en priorité les pays que tu maîtrises le moins.',
  icon: '🔁',
  inputType: 'multiple-choice',
  variadic: true,
  generate(o): Question {
    return pick(reviewGenerators).generate(o);
  },
};
