import { describe, expect, it } from 'vitest';
import { dailySeed, rnd, withSeed } from './rng';

describe('rng seedé', () => {
  it('withSeed est déterministe pour une même graine', () => {
    const a = withSeed(42, () => [rnd(), rnd(), rnd()]);
    const b = withSeed(42, () => [rnd(), rnd(), rnd()]);
    expect(a).toEqual(b);
  });

  it('des graines différentes donnent des suites différentes', () => {
    const a = withSeed(1, () => [rnd(), rnd(), rnd()]);
    const b = withSeed(2, () => [rnd(), rnd(), rnd()]);
    expect(a).not.toEqual(b);
  });

  it('restaure la source d’aléatoire après exécution', () => {
    withSeed(7, () => rnd());
    // Hors withSeed, l'aléatoire reste dans [0, 1[ et non figé.
    const values = new Set([rnd(), rnd(), rnd(), rnd()]);
    expect(values.size).toBeGreaterThan(1);
  });

  it('dailySeed est stable sur une journée et change le lendemain', () => {
    // Dates en heure locale pour éviter toute dépendance au fuseau horaire.
    const morning = new Date(2026, 5, 22, 8, 0);
    const evening = new Date(2026, 5, 22, 22, 0);
    const nextDay = new Date(2026, 5, 23, 8, 0);
    expect(dailySeed(morning)).toBe(dailySeed(evening));
    expect(dailySeed(morning)).not.toBe(dailySeed(nextDay));
  });
});
