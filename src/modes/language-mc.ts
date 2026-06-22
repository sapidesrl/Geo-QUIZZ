import { countries } from '../data/countries';
import { defaultGenerateOptions } from '../engine/generate';
import type { GameMode, Question } from '../engine/types';
import { pick, sample } from '../lib/shuffle';

const allLanguages = [...new Set(countries.map((c) => c.language).filter(Boolean))];

export const languageMc: GameMode = {
  id: 'language-mc',
  label: 'Langue — QCM',
  description: 'Quelle est la langue principale d’un pays ?',
  icon: '🗣️',
  inputType: 'multiple-choice',
  generate(o = defaultGenerateOptions): Question {
    const pool = o.countries.filter((c) => c.language);
    const subject = pick(pool.length > 0 ? pool : countries.filter((c) => c.language));

    const others = sample(
      allLanguages.filter((l) => l !== subject.language),
      3,
    );
    const options = sample([subject.language, ...others], 4);
    return {
      inputType: 'multiple-choice',
      prompt: `Quelle est la langue principale de ${subject.name} ?`,
      flag: subject.cca2,
      choices: options.map((l) => ({ id: l, label: l })),
      correctChoiceId: subject.language,
      answerLabel: subject.language,
    };
  },
};
