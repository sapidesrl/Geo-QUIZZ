import { countries } from '../data/countries';
import { defaultGenerateOptions } from '../engine/generate';
import type { Country, GameMode, Question } from '../engine/types';
import i18n from '../i18n';
import { countryName } from '../i18n/display';
import { pick, sample } from '../lib/shuffle';

const byCode = new Map(countries.map((c) => [c.cca2, c]));

export const borderMc: GameMode = {
  id: 'border-mc',
  label: 'Pays frontalier — QCM',
  description: 'Parmi 4 pays, lequel partage une frontière avec le pays donné ?',
  icon: '🧭',
  inputType: 'multiple-choice',
  generate(o = defaultGenerateOptions): Question {
    // Sujet : un pays ayant au moins un voisin connu dans nos données.
    const withNeighbors = o.countries.filter((c) =>
      c.borders.some((b) => byCode.has(b)),
    );
    const pool =
      withNeighbors.length > 0
        ? withNeighbors
        : countries.filter((c) => c.borders.some((b) => byCode.has(b)));
    const subject = pick(pool);

    const neighborCode = pick(subject.borders.filter((b) => byCode.has(b)));
    const neighbor = byCode.get(neighborCode) as Country;

    // Distracteurs : pays qui ne sont NI le sujet NI un de ses voisins.
    const excluded = new Set([subject.cca2, ...subject.borders]);
    const distractors = sample(
      countries.filter((c) => !excluded.has(c.cca2)),
      3,
    );

    const options = sample([neighbor, ...distractors], 4);
    return {
      inputType: 'multiple-choice',
      prompt: i18n.t('prompts.border', { country: countryName(subject) }),
      flag: subject.cca2,
      choices: options.map((c) => ({ id: c.cca2, label: countryName(c), flag: c.cca2 })),
      correctChoiceId: neighbor.cca2,
      answerLabel: countryName(neighbor),
      subjectCode: subject.cca2,
    };
  },
};
