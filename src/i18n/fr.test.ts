import { describe, expect, it } from 'vitest';
import { currencyNames, languageNames } from './fr';
import { countries } from '../data/countries';

describe('traductions françaises des données', () => {
  it('chaque monnaie utilisée a une traduction française', () => {
    const codes = [...new Set(countries.map((c) => c.currencyCode).filter(Boolean))];
    const missing = codes.filter((code) => !currencyNames[code]);
    expect(missing).toEqual([]);
  });

  it('chaque langue utilisée a une traduction française', () => {
    const codes = [...new Set(countries.map((c) => c.languageCode).filter(Boolean))];
    const missing = codes.filter((code) => !languageNames[code]);
    expect(missing).toEqual([]);
  });

  it('aucune réponse de monnaie/langue ne reste vide', () => {
    for (const c of countries) {
      if (c.currencyCode) expect(c.currency).not.toBe('');
      if (c.languageCode) expect(c.language).not.toBe('');
    }
  });
});
