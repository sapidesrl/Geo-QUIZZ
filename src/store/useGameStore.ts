import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Difficulty = 'facile' | 'moyen' | 'difficile';

interface GameState {
  /** nombre de questions par partie. */
  questionsPerGame: number;
  setQuestionsPerGame: (n: number) => void;
  /** continent sélectionné ('Monde' = tous). */
  continent: string;
  setContinent: (c: string) => void;
  /** difficulté (filtre par taille de pays). */
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  /** meilleur score par mode (clé = id du mode). */
  bestScores: Record<string, number>;
  recordScore: (modeId: string, score: number) => void;
  /** meilleure série par mode. */
  bestStreaks: Record<string, number>;
  recordStreak: (modeId: string, streak: number) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      questionsPerGame: 10,
      setQuestionsPerGame: (n) => set({ questionsPerGame: n }),
      continent: 'Monde',
      setContinent: (c) => set({ continent: c }),
      difficulty: 'moyen',
      setDifficulty: (d) => set({ difficulty: d }),
      bestScores: {},
      recordScore: (modeId, score) =>
        set((state) => ({
          bestScores: {
            ...state.bestScores,
            [modeId]: Math.max(score, state.bestScores[modeId] ?? 0),
          },
        })),
      bestStreaks: {},
      recordStreak: (modeId, streak) =>
        set((state) => ({
          bestStreaks: {
            ...state.bestStreaks,
            [modeId]: Math.max(streak, state.bestStreaks[modeId] ?? 0),
          },
        })),
    }),
    { name: 'geo-quizz-store' },
  ),
);
