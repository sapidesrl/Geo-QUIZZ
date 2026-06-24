import { describe, expect, it } from 'vitest';
import { type AchievementContext, evaluateAchievements } from './achievements';

const base: AchievementContext = {
  modeId: '',
  score: 0,
  total: 0,
  bestStreak: 0,
  isDaily: false,
  gamesPlayed: 0,
  totalCorrect: 0,
  modesPlayed: [],
  dailyDone: false,
  masteredCount: 0,
  campaignChapterDone: false,
  matchPerfect: false,
};

describe('succès — nouveautés', () => {
  it('débloque le chapitre de campagne terminé', () => {
    expect(evaluateAchievements({ ...base, campaignChapterDone: true })).toContain(
      'campaign-chapter',
    );
    expect(evaluateAchievements(base)).not.toContain('campaign-chapter');
  });

  it('débloque l’association parfaite', () => {
    expect(evaluateAchievements({ ...base, matchPerfect: true })).toContain('match-perfect');
  });

  it('débloque les paliers de maîtrise selon le nombre de pays', () => {
    expect(evaluateAchievements({ ...base, masteredCount: 25 })).toContain('mastery-25');
    expect(evaluateAchievements({ ...base, masteredCount: 25 })).not.toContain('mastery-50');
    const at100 = evaluateAchievements({ ...base, masteredCount: 100 });
    expect(at100).toEqual(expect.arrayContaining(['mastery-25', 'mastery-50', 'mastery-100']));
  });
});
