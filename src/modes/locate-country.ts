import { defaultGenerateOptions, randomCountry } from '../engine/generate';
import type { GameMode, Question } from '../engine/types';

export const locateCountry: GameMode = {
  id: 'locate-country',
  label: 'Situer un pays',
  description: 'Place le pays demandé sur la carte du monde.',
  icon: '🌍',
  inputType: 'map-pin',
  generate(o = defaultGenerateOptions): Question {
    const country = randomCountry(o.countries);
    return {
      inputType: 'map-pin',
      prompt: `Où se situe ${country.name} ?`,
      target: {
        lat: country.lat,
        lng: country.lng,
        toleranceKm: 700,
        label: country.name,
      },
      answerLabel: country.name,
    };
  },
};
