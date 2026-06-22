import { distractors, randomCountry } from '../engine/generate';
import type { GameMode, Question } from '../engine/types';
import { shuffle } from '../lib/shuffle';

export const capitalMc: GameMode = {
  id: 'capital-mc',
  label: 'Capitale — QCM',
  description: 'Choisis la capitale du pays parmi 4 propositions.',
  icon: '🏛️',
  inputType: 'multiple-choice',
  generate(): Question {
    const country = randomCountry();
    const options = shuffle([country, ...distractors(country)]);
    return {
      inputType: 'multiple-choice',
      prompt: `Quelle est la capitale de ${country.name} ?`,
      flag: country.cca2,
      choices: options.map((c) => ({ id: c.cca2, label: c.capital })),
      correctChoiceId: country.cca2,
      answerLabel: country.capital,
    };
  },
};
