import { afterAll, describe, expect, it } from 'vitest';
import { countries } from '../data/countries';
import { capitalName, continentLabel, countryName, currencyName, languageName } from './display';
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

  it('localise les capitales via les exonymes embarqués', async () => {
    await i18n.changeLanguage('fr');
    expect(capitalName('Warsaw')).toBe('Varsovie');
    expect(capitalName('Moscow')).toBe('Moscou');
    // Pas d'exonyme connu → on garde le nom source.
    expect(capitalName('Madrid')).toBe('Madrid');
    await i18n.changeLanguage('it');
    expect(capitalName('Moscow')).toBe('Mosca');
    await i18n.changeLanguage('en');
    // L'anglais est la source : aucun exonyme.
    expect(capitalName('Moscow')).toBe('Moscow');
  });

  it('localise les continents via les clés de région', async () => {
    await i18n.changeLanguage('es');
    expect(continentLabel('Europe')).toBe('Europa');
    await i18n.changeLanguage('fr');
    expect(continentLabel('Africa')).toBe('Afrique');
  });
});
