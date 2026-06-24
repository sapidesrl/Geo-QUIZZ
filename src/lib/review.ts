import type { Country } from '../engine/types';
import { shuffle } from './shuffle';

/**
 * Révision espacée (boîtes de Leitner) par pays. Chaque pays a une « boîte » :
 * 0 = à revoir en priorité, augmente à chaque bonne réponse, repart à 0 sur une
 * erreur. Le mode « Révision » re-quizze en priorité les pays des boîtes basses.
 */
export interface ReviewStat {
  seen: number;
  correct: number;
  box: number;
}

export type ReviewStats = Record<string, ReviewStat>;

/** Boîte maximale : un pays atteignant ce niveau est considéré maîtrisé. */
export const REVIEW_MAX_BOX = 5;

/** Met à jour la boîte d'un pays après une réponse. */
export function updateStat(prev: ReviewStat | undefined, correct: boolean): ReviewStat {
  const s = prev ?? { seen: 0, correct: 0, box: 0 };
  return {
    seen: s.seen + 1,
    correct: s.correct + (correct ? 1 : 0),
    box: correct ? Math.min(s.box + 1, REVIEW_MAX_BOX) : 0,
  };
}

/** Pays « à réviser » : vus mais non maîtrisés, triés par priorité décroissante. */
export function countriesToReview(stats: ReviewStats, all: Country[]): Country[] {
  return all
    .filter((c) => {
      const s = stats[c.cca2];
      return s != null && s.seen > 0 && s.box < REVIEW_MAX_BOX;
    })
    .sort((a, b) => {
      const sa = stats[a.cca2];
      const sb = stats[b.cca2];
      if (sa.box !== sb.box) return sa.box - sb.box; // boîte la plus basse d'abord
      return sb.seen - sb.correct - (sa.seen - sa.correct); // puis le plus souvent raté
    });
}

/**
 * Sous-ensemble pour une session de révision : les pays les plus faibles d'abord,
 * complété au besoin par des pays aléatoires pour garder un quiz jouable
 * (assez de distracteurs / de questions uniques).
 */
export function selectReviewPool(
  stats: ReviewStats,
  all: Country[],
  { limit = 14, min = 6 }: { limit?: number; min?: number } = {},
): Country[] {
  const weak = countriesToReview(stats, all).slice(0, limit);
  if (weak.length >= min) return weak;
  const have = new Set(weak.map((c) => c.cca2));
  const fillers = shuffle(all.filter((c) => !have.has(c.cca2))).slice(0, min - weak.length);
  return [...weak, ...fillers];
}
