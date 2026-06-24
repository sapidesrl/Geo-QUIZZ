import { defaultGenerateOptions, randomCountry } from '../engine/generate';
import type { GameMode, Question } from '../engine/types';
import i18n from '../i18n';
import { countryName } from '../i18n/display';

export const locateCountry: GameMode = {
  id: 'locate-country',
  label: 'Situer un pays',
  description: 'Place le pays demandé sur la carte du monde.',
  icon: '🌍',
  inputType: 'map-pin',
  generate(o = defaultGenerateOptions): Question {
    const country = randomCountry(o.countries);
    const name = countryName(country);
    return {
      inputType: 'map-pin',
      prompt: i18n.t('prompts.locateCountry', { country: name }),
      target: {
        lat: country.lat,
        lng: country.lng,
        toleranceKm: 700,
        label: name,
        code: country.cca2,
      },
      answerLabel: name,
    };
  },
};
