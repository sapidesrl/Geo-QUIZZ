import { countries } from '../data/countries';
import { defaultGenerateOptions, randomCountry } from '../engine/generate';
import type { GameMode, Question } from '../engine/types';
import { sample, shuffle } from '../lib/shuffle';

const allContinents = [...new Set(countries.map((c) => c.continent))];

export const continentMc: GameMode = {
  id: 'continent-mc',
  label: 'Continent — QCM',
  description: "Trouve le continent d'un pays.",
  icon: '🗺️',
  inputType: 'multiple-choice',
  generate(o = defaultGenerateOptions): Question {
    const country = randomCountry(o.countries);
    const others = sample(
      allContinents.filter((c) => c !== country.continent),
      3,
    );
    const options = shuffle([country.continent, ...others]);
    return {
      inputType: 'multiple-choice',
      prompt: `Sur quel continent se trouve ${country.name} ?`,
      flag: country.cca2,
      choices: options.map((c) => ({ id: c, label: c })),
      correctChoiceId: country.continent,
      answerLabel: country.continent,
    };
  },
};
