import type { GameMode, Question } from '../engine/types';
import { pick } from '../lib/shuffle';
import { baseModes } from './base';

export const mixed: GameMode = {
  id: 'mixed',
  label: 'Mode mixte — révision',
  description: 'Un mélange de toutes les questions, tous modes confondus.',
  icon: '🎲',
  inputType: 'multiple-choice',
  variadic: true,
  generate(o): Question {
    return pick(baseModes).generate(o);
  },
};
