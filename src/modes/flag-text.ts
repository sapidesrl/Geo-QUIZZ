import { defaultGenerateOptions, randomCountry } from '../engine/generate';
import type { GameMode, Question } from '../engine/types';
import i18n from '../i18n';
import { countryName } from '../i18n/display';

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
      prompt: i18n.t('prompts.whichFlag'),
      flag: country.cca2,
      // On accepte le nom dans la langue courante, plus français et anglais.
      acceptedAnswers: [...new Set([countryName(country), country.name, country.nameEn])],
      answerLabel: countryName(country),
    };
  },
};
