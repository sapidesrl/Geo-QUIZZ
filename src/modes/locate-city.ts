import { defaultGenerateOptions } from '../engine/generate';
import type { GameMode, Question } from '../engine/types';
import i18n from '../i18n';
import { cityCountryName, cityName } from '../i18n/display';
import { pick } from '../lib/shuffle';

export const locateCity: GameMode = {
  id: 'locate-city',
  label: 'Situer une ville',
  description: 'Place la ville demandée sur la carte du monde.',
  icon: '📍',
  inputType: 'map-pin',
  generate(o = defaultGenerateOptions): Question {
    const city = pick(o.cities);
    const localizedName = cityName(city.name);
    return {
      inputType: 'map-pin',
      prompt: i18n.t('prompts.locateCity', {
        city: localizedName,
        country: cityCountryName(city.country),
      }),
      target: {
        lat: city.lat,
        lng: city.lng,
        toleranceKm: 350,
        label: localizedName,
      },
      answerLabel: localizedName,
    };
  },
};
