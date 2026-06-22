import { defaultGenerateOptions, distractors, randomCountry } from '../engine/generate';
import type { GameMode, Question } from '../engine/types';
import { shuffle } from '../lib/shuffle';

export const capitalToCountryMc: GameMode = {
  id: 'capital-to-country-mc',
  label: 'Capitale → Pays — QCM',
  description: "Retrouve le pays à partir de sa capitale.",
  icon: '🧭',
  inputType: 'multiple-choice',
  generate(o = defaultGenerateOptions): Question {
    const country = randomCountry(o.countries);
    const options = shuffle([country, ...distractors(o.countries, country)]);
    return {
      inputType: 'multiple-choice',
      prompt: `${country.capital} est la capitale de quel pays ?`,
      choices: options.map((c) => ({ id: c.cca2, label: c.name, flag: c.cca2 })),
      correctChoiceId: country.cca2,
      answerLabel: country.name,
    };
  },
};
