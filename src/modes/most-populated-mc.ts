import { defaultGenerateOptions, withPopulation } from '../engine/generate';
import type { GameMode, Question } from '../engine/types';
import i18n from '../i18n';
import { countryName } from '../i18n/display';
import { sample } from '../lib/shuffle';

export const mostPopulatedMc: GameMode = {
  id: 'most-populated-mc',
  label: 'Le plus peuplé — QCM',
  description: "Parmi 4 pays, lequel compte le plus d'habitants ?",
  icon: '👥',
  inputType: 'multiple-choice',
  generate(o = defaultGenerateOptions): Question {
    const options = sample(withPopulation(o.countries), 4);
    const winner = options.reduce((a, b) => (b.population > a.population ? b : a));
    return {
      inputType: 'multiple-choice',
      prompt: i18n.t('prompts.mostPopulated'),
      choices: options.map((c) => ({ id: c.cca2, label: countryName(c), flag: c.cca2 })),
      correctChoiceId: winner.cca2,
      answerLabel: countryName(winner),
    };
  },
};
