import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { campaignChapters, CAMPAIGN_PASS_THRESHOLD } from '../data/campaign';
import { evaluateAchievements } from '../lib/achievements';
import { REVIEW_MAX_BOX, updateStat, type ReviewStats } from '../lib/review';

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

  reviewStats: ReviewStats;
  recordAnswer: (code: string, correct: boolean) => void;

  recordGame: (summary: GameSummary) => string[];
}

/** Nombre de pays maîtrisés (boîte de révision au maximum). */
function masteredCount(reviewStats: ReviewStats): number {
  return Object.values(reviewStats).filter((s) => s.box >= REVIEW_MAX_BOX).length;
}

/** Vrai si au moins un chapitre de campagne est entièrement réussi. */
function anyChapterDone(progress: Record<string, CampaignLevelResult>): boolean {
  return campaignChapters.some((ch) =>
    ch.levels.every((_, i) => progress[`${ch.id}-${i}`]?.completed),
  );
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

      reviewStats: {},
      recordAnswer: (code, correct) =>
        set((s) => ({
          reviewStats: { ...s.reviewStats, [code]: updateStat(s.reviewStats[code], correct) },
        })),

      campaignProgress: {},
      recordCampaignLevel: (key, score, total) =>
        set((s) => {
          const campaignProgress = {
            ...s.campaignProgress,
            [key]: {
              completed: total > 0 && score / total >= CAMPAIGN_PASS_THRESHOLD,
              bestScore: Math.max(score, s.campaignProgress[key]?.bestScore ?? 0),
              total,
            },
          };
          // Succès de progression (chapitre terminé, pays maîtrisés) débloqués ici aussi.
          const passing = evaluateAchievements({
            modeId: '',
            score: 0,
            total: 0,
            bestStreak: 0,
            isDaily: false,
            gamesPlayed: s.gamesPlayed,
            totalCorrect: s.totalCorrect,
            modesPlayed: s.modesPlayed,
            dailyDone: Object.keys(s.dailyHistory).length > 0,
            masteredCount: masteredCount(s.reviewStats),
            campaignChapterDone: anyChapterDone(campaignProgress),
            matchPerfect: false,
          });
          const newlyUnlocked = passing.filter((id) => !s.unlocked.includes(id));
          return { campaignProgress, unlocked: [...s.unlocked, ...newlyUnlocked] };
        }),

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

        const isMatch =
          summary.modeId === 'worldcup-match' || summary.modeId.startsWith('match-');
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
          masteredCount: masteredCount(s.reviewStats),
          campaignChapterDone: anyChapterDone(s.campaignProgress),
          matchPerfect: isMatch && summary.total > 0 && summary.score === summary.total,
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
