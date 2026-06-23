import { defaultGenerateOptions } from '../engine/generate';
import type { GameMode, Question } from '../engine/types';
import i18n from '../i18n';
import { cityCountryName } from '../i18n/display';
import { pick } from '../lib/shuffle';

export const locateCity: GameMode = {
  id: 'locate-city',
  label: 'Situer une ville',
  description: 'Place la ville demandée sur la carte du monde.',
  icon: '📍',
  inputType: 'map-pin',
  generate(o = defaultGenerateOptions): Question {
    const city = pick(o.cities);
    return {
      inputType: 'map-pin',
      prompt: i18n.t('prompts.locateCity', {
        city: city.name,
        country: cityCountryName(city.country),
      }),
      target: {
        lat: city.lat,
        lng: city.lng,
        toleranceKm: 350,
        label: city.name,
      },
      answerLabel: city.name,
    };
  },
};
