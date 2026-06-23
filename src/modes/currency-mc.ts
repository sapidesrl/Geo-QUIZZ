import { countries } from '../data/countries';
import { defaultGenerateOptions } from '../engine/generate';
import type { GameMode, Question } from '../engine/types';
import i18n from '../i18n';
import { countryName, currencyName } from '../i18n/display';
import { pick, sample } from '../lib/shuffle';

// Codes ISO 4217 distincts (id stable) ; le libellé est résolu dans la langue courante.
const allCurrencyCodes = [...new Set(countries.map((c) => c.currencyCode).filter(Boolean))];

export const currencyMc: GameMode = {
  id: 'currency-mc',
  label: 'Monnaie — QCM',
  description: "Quelle est la monnaie d'un pays ?",
  icon: '💰',
  inputType: 'multiple-choice',
  generate(o = defaultGenerateOptions): Question {
    const pool = o.countries.filter((c) => c.currencyCode);
    const subject = pick(pool.length > 0 ? pool : countries.filter((c) => c.currencyCode));

    const others = sample(
      allCurrencyCodes.filter((code) => code !== subject.currencyCode),
      3,
    );
    const options = sample([subject.currencyCode, ...others], 4);
    return {
      inputType: 'multiple-choice',
      prompt: i18n.t('prompts.currency', { country: countryName(subject) }),
      flag: subject.cca2,
      choices: options.map((code) => ({ id: code, label: currencyName(code) })),
      correctChoiceId: subject.currencyCode,
      answerLabel: currencyName(subject.currencyCode),
    };
  },
};
