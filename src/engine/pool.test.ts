import { describe, expect, it } from 'vitest';
import { buildGenerateOptions, CONTINENTS } from './pool';
import type { Difficulty } from '../store/useGameStore';

const DIFFICULTIES: Difficulty[] = ['facile', 'moyen', 'difficile'];

describe('buildGenerateOptions', () => {
  it('Monde + difficile inclut tous les pays', () => {
    expect(buildGenerateOptions('Monde', 'difficile').countries.length).toBeGreaterThan(150);
  });

  it('la difficulté facile réduit le nombre de pays', () => {
    const all = buildGenerateOptions('Monde', 'difficile').countries.length;
    const easy = buildGenerateOptions('Monde', 'facile').countries.length;
    expect(easy).toBeLessThan(all);
  });

  it('filtre par continent', () => {
    const o = buildGenerateOptions('Europe', 'difficile');
    expect(o.countries.length).toBeGreaterThan(0);
    expect(o.countries.every((c) => c.continent === 'Europe')).toBe(true);
  });

  it('garantit toujours au moins 4 pays (garde-fou QCM)', () => {
    for (const continent of CONTINENTS) {
      for (const difficulty of DIFFICULTIES) {
        expect(
          buildGenerateOptions(continent, difficulty).countries.length,
        ).toBeGreaterThanOrEqual(4);
      }
    }
  });

  it('fournit au moins une ville', () => {
    expect(buildGenerateOptions('Monde', 'moyen').cities.length).toBeGreaterThan(0);
  });
});
