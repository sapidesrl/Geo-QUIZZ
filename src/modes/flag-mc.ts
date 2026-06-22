import { defaultGenerateOptions, distractors, randomCountry } from '../engine/generate';
import type { GameMode, Question } from '../engine/types';
import { shuffle } from '../lib/shuffle';

export const flagMc: GameMode = {
  id: 'flag-mc',
  label: 'Drapeau — QCM',
  description: 'Reconnais le drapeau du pays parmi 4 propositions.',
  icon: '🚩',
  inputType: 'multiple-choice',
  generate(o = defaultGenerateOptions): Question {
    const country = randomCountry(o.countries);
    const options = shuffle([country, ...distractors(o.countries, country)]);
    return {
      inputType: 'multiple-choice',
      prompt: `Quel est le drapeau de ${country.name} ?`,
      choices: options.map((c) => ({ id: c.cca2, label: c.name, flag: c.cca2 })),
      correctChoiceId: country.cca2,
      answerLabel: country.name,
    };
  },
};
