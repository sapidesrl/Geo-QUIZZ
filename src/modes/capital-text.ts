import { defaultGenerateOptions, randomCountry } from '../engine/generate';
import type { GameMode, Question } from '../engine/types';

export const capitalText: GameMode = {
  id: 'capital-text',
  label: 'Capitale — Saisie',
  description: 'Écris le nom de la capitale du pays.',
  icon: '✍️',
  inputType: 'free-text',
  generate(o = defaultGenerateOptions): Question {
    const country = randomCountry(o.countries);
    return {
      inputType: 'free-text',
      prompt: `Quelle est la capitale de ${country.name} ?`,
      flag: country.cca2,
      acceptedAnswers: [country.capital],
      answerLabel: country.capital,
    };
  },
};
