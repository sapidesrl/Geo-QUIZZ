import { countries } from '../data/countries';
import { defaultGenerateOptions, randomCountry } from '../engine/generate';
import type { GameMode, Question } from '../engine/types';
import i18n from '../i18n';
import { continentLabel, countryName } from '../i18n/display';
import { sample, shuffle } from '../lib/shuffle';

// Régions world-countries (clés stables, indépendantes de la langue).
const allRegions = [...new Set(countries.map((c) => c.region))];

export const continentMc: GameMode = {
  id: 'continent-mc',
  label: 'Continent — QCM',
  description: "Trouve le continent d'un pays.",
  icon: '🗺️',
  inputType: 'multiple-choice',
  generate(o = defaultGenerateOptions): Question {
    const country = randomCountry(o.countries);
    const others = sample(
      allRegions.filter((r) => r !== country.region),
      3,
    );
    const options = shuffle([country.region, ...others]);
    return {
      inputType: 'multiple-choice',
      prompt: i18n.t('prompts.continentOf', { country: countryName(country) }),
      flag: country.cca2,
      choices: options.map((r) => ({ id: r, label: continentLabel(r) })),
      correctChoiceId: country.region,
      answerLabel: continentLabel(country.region),
    };
  },
};
