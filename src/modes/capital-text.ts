import { defaultGenerateOptions, randomCountry } from '../engine/generate';
import type { GameMode, Question } from '../engine/types';
import i18n from '../i18n';
import { capitalName, countryName } from '../i18n/display';

export const capitalText: GameMode = {
  id: 'capital-text',
  label: 'Capitale — Saisie',
  description: 'Écris le nom de la capitale du pays.',
  icon: '✍️',
  inputType: 'free-text',
  generate(o = defaultGenerateOptions): Question {
    const country = randomCountry(o.countries);
    const localized = capitalName(country.capital);
    // Accepte l'exonyme localisé ET le nom source (anglais).
    const accepted = [...new Set([localized, country.capital])];
    return {
      inputType: 'free-text',
      prompt: i18n.t('prompts.capital', { country: countryName(country) }),
      flag: country.cca2,
      acceptedAnswers: accepted,
      answerLabel: localized,
      subjectCode: country.cca2,
    };
  },
};
