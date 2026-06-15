import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameState {
  /** nombre de questions par partie. */
  questionsPerGame: number;
  setQuestionsPerGame: (n: number) => void;
  /** meilleur score par mode (clé = id du mode). */
  bestScores: Record<string, number>;
  recordScore: (modeId: string, score: number) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      questionsPerGame: 10,
      setQuestionsPerGame: (n) => set({ questionsPerGame: n }),
      bestScores: {},
      recordScore: (modeId, score) =>
        set((state) => ({
          bestScores: {
            ...state.bestScores,
            [modeId]: Math.max(score, state.bestScores[modeId] ?? 0),
          },
        })),
    }),
    { name: 'geo-quizz-store' },
  ),
);
