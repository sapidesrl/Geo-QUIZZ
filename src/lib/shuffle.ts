import { rnd } from './rng';

/** Mélange un tableau (copie, Fisher-Yates). */
export function shuffle<T>(array: readonly T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Tire au hasard `count` éléments distincts du tableau. */
export function sample<T>(array: readonly T[], count: number): T[] {
  return shuffle(array).slice(0, count);
}

/** Tire un élément au hasard. */
export function pick<T>(array: readonly T[]): T {
  return array[Math.floor(rnd() * array.length)];
}
