import { defaultGenerateOptions, distractors, randomCountry } from '../engine/generate';
import type { GameMode, Question } from '../engine/types';
import i18n from '../i18n';
import { capitalName, countryName } from '../i18n/display';
import { shuffle } from '../lib/shuffle';

export const capitalMc: GameMode = {
  id: 'capital-mc',
  label: 'Capitale — QCM',
  description: 'Choisis la capitale du pays parmi 4 propositions.',
  icon: '🏛️',
  inputType: 'multiple-choice',
  generate(o = defaultGenerateOptions): Question {
    const country = randomCountry(o.countries);
    const options = shuffle([country, ...distractors(o.countries, country)]);
    return {
      inputType: 'multiple-choice',
      prompt: i18n.t('prompts.capital', { country: countryName(country) }),
      flag: country.cca2,
      choices: options.map((c) => ({ id: c.cca2, label: capitalName(c.capital) })),
      correctChoiceId: country.cca2,
      answerLabel: capitalName(country.capital),
      subjectCode: country.cca2,
    };
  },
};
