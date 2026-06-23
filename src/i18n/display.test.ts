import { afterAll, describe, expect, it } from 'vitest';
import { countries } from '../data/countries';
import { continentLabel, countryName, currencyName, languageName } from './display';
import i18n from './index';

const france = countries.find((c) => c.cca2 === 'fr')!;

afterAll(() => i18n.changeLanguage('fr'));

describe('résolution des noms localisés', () => {
  it('localise le nom de pays selon la langue (Intl.DisplayNames)', async () => {
    await i18n.changeLanguage('fr');
    expect(countryName(france)).toBe('France');
    await i18n.changeLanguage('es');
    expect(countryName(france)).toBe('Francia');
    await i18n.changeLanguage('de');
    expect(countryName(france)).toBe('Frankreich');
  });

  it('localise les monnaies et langues', async () => {
    await i18n.changeLanguage('en');
    expect(currencyName('EUR').toLowerCase()).toContain('euro');
    expect(languageName('fra')).toBe('French');
    await i18n.changeLanguage('fr');
    expect(languageName('deu')).toBe('allemand');
  });

  it('retombe sur le dictionnaire français pour les langues sans donnée CLDR', async () => {
    await i18n.changeLanguage('en');
    // bjz (créole bélizien) n'a pas de code BCP-47 connu d'Intl.
    expect(languageName('bjz')).toBe('créole bélizien');
  });

  it('localise les continents via les clés de région', async () => {
    await i18n.changeLanguage('es');
    expect(continentLabel('Europe')).toBe('Europa');
    await i18n.changeLanguage('fr');
    expect(continentLabel('Africa')).toBe('Afrique');
  });
});
