import type { GameMode } from '../engine/types';
import { baseModes } from './base';
import { daily } from './daily';
import { mixed } from './mixed';
import { review } from './review';

/**
 * Registre des modes de jeu. Pour ajouter un mode : créer un fichier qui exporte
 * un `GameMode`, l'ajouter à `baseModes` (`base.ts`) — l'écran de sélection et le
 * moteur de partie le prennent en compte automatiquement. Les modes mixte et défi
 * du jour piochent dans `baseModes`.
 */
export const gameModes: GameMode[] = [...baseModes, mixed, review, daily];

export function getModeById(id: string | undefined): GameMode | undefined {
  return gameModes.find((m) => m.id === id);
}
