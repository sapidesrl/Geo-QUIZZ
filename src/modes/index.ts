import type { GameMode } from '../engine/types';
import { capitalMc } from './capital-mc';
import { capitalText } from './capital-text';
import { capitalToCountryMc } from './capital-to-country-mc';
import { continentMc } from './continent-mc';
import { flagMc } from './flag-mc';
import { flagText } from './flag-text';
import { largestAreaMc } from './largest-area-mc';
import { locateCity } from './locate-city';
import { locateCountry } from './locate-country';

/**
 * Registre des modes de jeu. Pour ajouter un mode : créer un fichier qui exporte
 * un `GameMode` puis l'ajouter ici — l'écran de sélection et le moteur de partie
 * le prennent en compte automatiquement.
 */
export const gameModes: GameMode[] = [
  capitalMc,
  capitalText,
  capitalToCountryMc,
  flagMc,
  flagText,
  continentMc,
  largestAreaMc,
  locateCountry,
  locateCity,
];

export function getModeById(id: string | undefined): GameMode | undefined {
  return gameModes.find((m) => m.id === id);
}
