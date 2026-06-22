import { defaultGenerateOptions, randomCountry } from '../engine/generate';
import type { GameMode, Question } from '../engine/types';

export const flagText: GameMode = {
  id: 'flag-text',
  label: 'Drapeau — Saisie',
  description: 'Identifie le pays à partir de son drapeau.',
  icon: '🏳️',
  inputType: 'free-text',
  generate(o = defaultGenerateOptions): Question {
    const country = randomCountry(o.countries);
    return {
      inputType: 'free-text',
      prompt: 'À quel pays appartient ce drapeau ?',
      flag: country.cca2,
      acceptedAnswers: [country.name, country.nameEn],
      answerLabel: country.name,
    };
  },
};
