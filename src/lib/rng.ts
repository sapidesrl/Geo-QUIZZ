/**
 * Source d'aléatoire indirecte. Par défaut `Math.random`, mais remplaçable
 * temporairement par un générateur seedé (`withSeed`) pour rendre une partie
 * reproductible — utilisé par le « Défi du jour » (même quiz pour tout le monde
 * un jour donné, et identique si on le rejoue).
 */
let source: () => number = Math.random;

/** Tirage aléatoire courant (Math.random ou générateur seedé actif). */
export function rnd(): number {
  return source();
}

/** Générateur pseudo-aléatoire déterministe (mulberry32). */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Exécute `fn` avec un aléatoire déterministe basé sur `seed`, puis restaure. */
export function withSeed<T>(seed: number, fn: () => T): T {
  const previous = source;
  source = mulberry32(seed);
  try {
    return fn();
  } finally {
    source = previous;
  }
}

/** Graine du jour (année/mois/jour) : stable sur 24 h, change chaque date. */
export function dailySeed(date = new Date()): number {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}

/** Clé de date « AAAA-MM-JJ » pour mémoriser le défi du jour réalisé. */
export function dailyKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}
