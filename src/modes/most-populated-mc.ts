import { countries } from '../data/countries';
import type { GameMode, Question } from '../engine/types';
import { sample } from '../lib/shuffle';

export const mostPopulatedMc: GameMode = {
  id: 'most-populated-mc',
  label: 'Le plus peuplé — QCM',
  description: 'Parmi 4 pays, lequel est le plus peuplé ?',
  icon: '👥',
  inputType: 'multiple-choice',
  generate(): Question {
    const options = sample(countries, 4);
    const winner = options.reduce((a, b) => (b.population > a.population ? b : a));
    return {
      inputType: 'multiple-choice',
      prompt: 'Quel est le pays le plus peuplé ?',
      choices: options.map((c) => ({ id: c.cca2, label: c.name, flag: c.cca2 })),
      correctChoiceId: winner.cca2,
      answerLabel: winner.name,
    };
  },
};
