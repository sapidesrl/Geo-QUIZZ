import { describe, expect, it } from 'vitest';
import { normalize } from './normalize';

describe('normalize', () => {
  it('met en minuscules et retire les accents', () => {
    expect(normalize('Pékin')).toBe('pekin');
    expect(normalize('SÃO Paulo')).toBe('sao paulo');
  });

  it('normalise ponctuation et espaces', () => {
    expect(normalize('  Saint-Pétersbourg ')).toBe('saint petersbourg');
    expect(normalize('Washington, D.C.')).toBe('washington d c');
  });

  it('renvoie une chaîne vide pour une entrée vide', () => {
    expect(normalize('   ')).toBe('');
  });
});
