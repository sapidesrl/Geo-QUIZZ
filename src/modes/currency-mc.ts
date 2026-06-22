import { countries } from '../data/countries';
import { defaultGenerateOptions } from '../engine/generate';
import type { GameMode, Question } from '../engine/types';
import { pick, sample } from '../lib/shuffle';

const allCurrencies = [...new Set(countries.map((c) => c.currency).filter(Boolean))];

export const currencyMc: GameMode = {
  id: 'currency-mc',
  label: 'Monnaie — QCM',
  description: "Quelle est la monnaie d'un pays ?",
  icon: '💰',
  inputType: 'multiple-choice',
  generate(o = defaultGenerateOptions): Question {
    const pool = o.countries.filter((c) => c.currency);
    const subject = pick(pool.length > 0 ? pool : countries.filter((c) => c.currency));

    const others = sample(
      allCurrencies.filter((c) => c !== subject.currency),
      3,
    );
    const options = sample([subject.currency, ...others], 4);
    return {
      inputType: 'multiple-choice',
      prompt: `Quelle est la monnaie de ${subject.name} ?`,
      flag: subject.cca2,
      choices: options.map((c) => ({ id: c, label: c })),
      correctChoiceId: subject.currency,
      answerLabel: subject.currency,
    };
  },
};
