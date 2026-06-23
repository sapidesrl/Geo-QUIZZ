import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CAMPAIGN_PASS_THRESHOLD } from '../data/campaign';
import { evaluateAchievements } from '../lib/achievements';

export type Difficulty = 'facile' | 'moyen' | 'difficile';

export interface GameSummary {
  modeId: string;
  score: number;
  total: number;
  bestStreak: number;
  isDaily: boolean;
  dailyKey?: string;
}

export interface CampaignLevelResult {
  completed: boolean;
  bestScore: number;
  total: number;
}

interface GameState {
  questionsPerGame: number;
  setQuestionsPerGame: (n: number) => void;
  continent: string;
  setContinent: (c: string) => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  soundOn: boolean;
  toggleSound: () => void;

  bestScores: Record<string, number>;
  bestStreaks: Record<string, number>;

  gamesPlayed: number;
  totalCorrect: number;
  totalAnswered: number;
  modesPlayed: string[];
  unlocked: string[];
  dailyHistory: Record<string, number>;

  campaignProgress: Record<string, CampaignLevelResult>;
  recordCampaignLevel: (key: string, score: number, total: number) => void;

  recordGame: (summary: GameSummary) => string[];
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      questionsPerGame: 10,
      setQuestionsPerGame: (n) => set({ questionsPerGame: n }),
      continent: 'Monde',
      setContinent: (c) => set({ continent: c }),
      difficulty: 'moyen',
      setDifficulty: (d) => set({ difficulty: d }),
      soundOn: true,
      toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),

      bestScores: {},
      bestStreaks: {},

      gamesPlayed: 0,
      totalCorrect: 0,
      totalAnswered: 0,
      modesPlayed: [],
      unlocked: [],
      dailyHistory: {},

      campaignProgress: {},
      recordCampaignLevel: (key, score, total) =>
        set((s) => ({
          campaignProgress: {
            ...s.campaignProgress,
            [key]: {
              completed: total > 0 && score / total >= CAMPAIGN_PASS_THRESHOLD,
              bestScore: Math.max(score, s.campaignProgress[key]?.bestScore ?? 0),
              total,
            },
          },
        })),

      recordGame: (summary) => {
        const s = get();
        const gamesPlayed = s.gamesPlayed + 1;
        const totalCorrect = s.totalCorrect + summary.score;
        const totalAnswered = s.totalAnswered + summary.total;
        const modesPlayed = s.modesPlayed.includes(summary.modeId)
          ? s.modesPlayed
          : [...s.modesPlayed, summary.modeId];
        const dailyHistory =
          summary.isDaily && summary.dailyKey
            ? {
                ...s.dailyHistory,
                [summary.dailyKey]: Math.max(
                  summary.score,
                  s.dailyHistory[summary.dailyKey] ?? 0,
                ),
              }
            : s.dailyHistory;
        const dailyDone = Object.keys(dailyHistory).length > 0;

        const passing = evaluateAchievements({
          modeId: summary.modeId,
          score: summary.score,
          total: summary.total,
          bestStreak: summary.bestStreak,
          isDaily: summary.isDaily,
          gamesPlayed,
          totalCorrect,
          modesPlayed,
          dailyDone,
        });
        const newlyUnlocked = passing.filter((id) => !s.unlocked.includes(id));

        set({
          gamesPlayed,
          totalCorrect,
          totalAnswered,
          modesPlayed,
          dailyHistory,
          unlocked: [...s.unlocked, ...newlyUnlocked],
          bestScores: {
            ...s.bestScores,
            [summary.modeId]: Math.max(summary.score, s.bestScores[summary.modeId] ?? 0),
          },
          bestStreaks: {
            ...s.bestStreaks,
            [summary.modeId]: Math.max(summary.bestStreak, s.bestStreaks[summary.modeId] ?? 0),
          },
        });

        return newlyUnlocked;
      },
    }),
    { name: 'geo-quizz-store' },
  ),
);
