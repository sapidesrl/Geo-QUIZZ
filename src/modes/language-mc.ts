import { countries } from '../data/countries';
import { defaultGenerateOptions } from '../engine/generate';
import type { GameMode, Question } from '../engine/types';
import i18n from '../i18n';
import { countryName, languageName } from '../i18n/display';
import { pick, sample } from '../lib/shuffle';

// Codes ISO 639-3 distincts (id stable) ; le libellé est résolu dans la langue courante.
const allLanguageCodes = [...new Set(countries.map((c) => c.languageCode).filter(Boolean))];

export const languageMc: GameMode = {
  id: 'language-mc',
  label: 'Langue — QCM',
  description: 'Quelle est la langue principale d’un pays ?',
  icon: '🗣️',
  inputType: 'multiple-choice',
  generate(o = defaultGenerateOptions): Question {
    const pool = o.countries.filter((c) => c.languageCode);
    const subject = pick(pool.length > 0 ? pool : countries.filter((c) => c.languageCode));

    const others = sample(
      allLanguageCodes.filter((code) => code !== subject.languageCode),
      3,
    );
    const options = sample([subject.languageCode, ...others], 4);
    return {
      inputType: 'multiple-choice',
      prompt: i18n.t('prompts.language', { country: countryName(subject) }),
      flag: subject.cca2,
      choices: options.map((code) => ({ id: code, label: languageName(code) })),
      correctChoiceId: subject.languageCode,
      answerLabel: languageName(subject.languageCode),
      subjectCode: subject.cca2,
    };
  },
};
