import { describe, expect, it } from 'vitest';
import type { Country } from '../engine/types';
import {
  countriesToReview,
  REVIEW_MAX_BOX,
  selectReviewPool,
  updateStat,
  type ReviewStats,
} from './review';

function fakeCountry(cca2: string): Country {
  return {
    cca2,
    ccn3: '000',
    name: cca2,
    nameEn: cca2,
    capital: 'X',
    lat: 0,
    lng: 0,
    region: 'Europe',
    continent: 'Europe',
    area: 1,
    population: 1,
    borders: [],
    currencyCode: 'EUR',
    currency: 'Euro',
    languageCode: 'eng',
    language: 'x',
  };
}

describe('updateStat (boîtes de Leitner)', () => {
  it('monte d’une boîte sur bonne réponse, plafonnée', () => {
    let s = updateStat(undefined, true);
    expect(s).toEqual({ seen: 1, correct: 1, box: 1 });
    for (let i = 0; i < 10; i++) s = updateStat(s, true);
    expect(s.box).toBe(REVIEW_MAX_BOX);
  });

  it('repart à la boîte 0 sur erreur', () => {
    const s = updateStat({ seen: 3, correct: 3, box: 3 }, false);
    expect(s.box).toBe(0);
    expect(s.seen).toBe(4);
    expect(s.correct).toBe(3);
  });
});

describe('countriesToReview', () => {
  it('ne retient que les pays vus et non maîtrisés, boîte basse d’abord', () => {
    const all = ['fr', 'de', 'es', 'it'].map(fakeCountry);
    const stats: ReviewStats = {
      fr: { seen: 2, correct: 2, box: REVIEW_MAX_BOX }, // maîtrisé → exclu
      de: { seen: 3, correct: 1, box: 0 }, // faible → en tête
      es: { seen: 2, correct: 1, box: 2 },
      // it : jamais vu → exclu
    };
    const result = countriesToReview(stats, all).map((c) => c.cca2);
    expect(result).toEqual(['de', 'es']);
  });
});

describe('selectReviewPool', () => {
  it('complète avec des pays aléatoires pour atteindre le minimum jouable', () => {
    const all = Array.from({ length: 10 }, (_, i) => fakeCountry(`c${i}`));
    const stats: ReviewStats = { c0: { seen: 1, correct: 0, box: 0 } };
    const pool = selectReviewPool(stats, all, { min: 6 });
    expect(pool.length).toBe(6);
    expect(pool[0].cca2).toBe('c0'); // le pays faible reste prioritaire
  });
});
