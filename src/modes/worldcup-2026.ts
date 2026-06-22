import { hostCities2026 } from '../data/worldcup2026';
import type { GameMode, Question } from '../engine/types';
import { pick } from '../lib/shuffle';

export const worldCup2026: GameMode = {
  id: 'worldcup-2026',
  label: 'Coupe du monde 2026',
  description: 'Situe les villes hôtes du Mondial 2026 (USA, Canada, Mexique).',
  icon: '⚽',
  inputType: 'map-pin',
  generate(): Question {
    const city = pick(hostCities2026);
    return {
      inputType: 'map-pin',
      prompt: `Situe ${city.name} — ville hôte du Mondial 2026 (${city.country})`,
      target: { lat: city.lat, lng: city.lng, toleranceKm: 250, label: city.name },
      answerLabel: `${city.name} (${city.country})`,
    };
  },
};
