import { defaultGenerateOptions, distractors, randomCountry } from '../engine/generate';
import type { GameMode, Question } from '../engine/types';
import i18n from '../i18n';
import { countryName } from '../i18n/display';
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
      prompt: i18n.t('prompts.flagOf', { country: countryName(country) }),
      choices: options.map((c) => ({ id: c.cca2, label: countryName(c), flag: c.cca2 })),
      correctChoiceId: country.cca2,
      answerLabel: countryName(country),
    };
  },
};
