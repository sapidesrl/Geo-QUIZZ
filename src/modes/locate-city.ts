import { cities } from '../data/cities';
import type { GameMode, Question } from '../engine/types';
import { pick } from '../lib/shuffle';

export const locateCity: GameMode = {
  id: 'locate-city',
  label: 'Situer une ville',
  description: 'Place la ville demandée sur la carte du monde.',
  icon: '📍',
  inputType: 'map-pin',
  generate(): Question {
    const city = pick(cities);
    return {
      inputType: 'map-pin',
      prompt: `Où se situe ${city.name} (${city.country}) ?`,
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
