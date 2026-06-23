import { hostCities2026 } from '../data/worldcup2026';
import type { GameMode, Question } from '../engine/types';
import i18n from '../i18n';
import { cityCountryName } from '../i18n/display';
import { pick } from '../lib/shuffle';

export const worldCup2026: GameMode = {
  id: 'worldcup-2026',
  label: 'Coupe du monde 2026',
  description: 'Situe les villes hôtes du Mondial 2026 (USA, Canada, Mexique).',
  icon: '⚽',
  inputType: 'map-pin',
  generate(): Question {
    const city = pick(hostCities2026);
    const country = cityCountryName(city.country);
    return {
      inputType: 'map-pin',
      prompt: i18n.t('prompts.worldcup', { city: city.name, country }),
      target: { lat: city.lat, lng: city.lng, toleranceKm: 250, label: city.name },
      answerLabel: i18n.t('labels.cityCountry', { city: city.name, country }),
    };
  },
};
