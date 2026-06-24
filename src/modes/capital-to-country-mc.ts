import { defaultGenerateOptions, distractors, randomCountry } from '../engine/generate';
import type { GameMode, Question } from '../engine/types';
import i18n from '../i18n';
import { capitalName, countryName } from '../i18n/display';
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
      prompt: i18n.t('prompts.capitalToCountry', { capital: capitalName(country.capital) }),
      choices: options.map((c) => ({ id: c.cca2, label: countryName(c), flag: c.cca2 })),
      correctChoiceId: country.cca2,
      answerLabel: countryName(country),
      subjectCode: country.cca2,
    };
  },
};
