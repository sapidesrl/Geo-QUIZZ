import { defaultGenerateOptions } from '../engine/generate';
import type { GameMode, Question } from '../engine/types';
import { sample } from '../lib/shuffle';

export const largestAreaMc: GameMode = {
  id: 'largest-area-mc',
  label: 'Le plus grand — QCM',
  description: 'Parmi 4 pays, lequel a la plus grande superficie ?',
  icon: '📐',
  inputType: 'multiple-choice',
  generate(o = defaultGenerateOptions): Question {
    const options = sample(o.countries, 4);
    const winner = options.reduce((a, b) => (b.area > a.area ? b : a));
    return {
      inputType: 'multiple-choice',
      prompt: 'Quel est le pays le plus vaste ?',
      choices: options.map((c) => ({ id: c.cca2, label: c.name, flag: c.cca2 })),
      correctChoiceId: winner.cca2,
      answerLabel: winner.name,
    };
  },
};
