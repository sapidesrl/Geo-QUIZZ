import type { GameMode } from '../engine/types';
import { borderMc } from './border-mc';
import { capitalMc } from './capital-mc';
import { capitalText } from './capital-text';
import { capitalToCountryMc } from './capital-to-country-mc';
import { continentMc } from './continent-mc';
import { currencyMc } from './currency-mc';
import { flagMc } from './flag-mc';
import { flagText } from './flag-text';
import { languageMc } from './language-mc';
import { largestAreaMc } from './largest-area-mc';
import { leastPopulatedMc } from './least-populated-mc';
import { locateCity } from './locate-city';
import { locateCountry } from './locate-country';
import { mostPopulatedMc } from './most-populated-mc';
import { worldCup2026 } from './worldcup-2026';

/**
 * Modes « concrets » composant le catalogue. Le mode mixte et le défi du jour
 * piochent dans cette liste — les en exclure évite toute récursion.
 */
export const baseModes: GameMode[] = [
  capitalMc,
  capitalText,
  capitalToCountryMc,
  flagMc,
  flagText,
  continentMc,
  borderMc,
  currencyMc,
  languageMc,
  largestAreaMc,
  mostPopulatedMc,
  leastPopulatedMc,
  locateCountry,
  locateCity,
  worldCup2026,
];
