import type { GameMode, Question } from '../engine/types';
import { pick } from '../lib/shuffle';
import { baseModes } from './base';

/**
 * Défi du jour : même quiz pour tout le monde un jour donné. Le tirage est rendu
 * déterministe par `withSeed(dailySeed())` au moment de construire la partie
 * (voir `pages/Game.tsx`). Variadique : il mélange les types de questions.
 */
export const daily: GameMode = {
  id: 'daily',
  label: 'Défi du jour',
  description: 'Un quiz quotidien identique pour tous, à tenter une fois par jour.',
  icon: '📅',
  inputType: 'multiple-choice',
  variadic: true,
  generate(o): Question {
    return pick(baseModes).generate(o);
  },
};
