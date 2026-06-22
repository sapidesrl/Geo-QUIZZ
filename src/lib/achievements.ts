/** Contexte d'évaluation des succès : la dernière partie + les cumuls (déjà à jour). */
export interface AchievementContext {
  modeId: string;
  score: number;
  total: number;
  bestStreak: number;
  isDaily: boolean;
  gamesPlayed: number;
  totalCorrect: number;
  modesPlayed: string[];
  dailyDone: boolean;
}

export interface Achievement {
  id: string;
  label: string;
  description: string;
  icon: string;
  test: (c: AchievementContext) => boolean;
}

/** Catalogue des succès débloquables (ordre d'affichage). */
export const achievements: Achievement[] = [
  {
    id: 'first-game',
    label: 'Première partie',
    description: 'Termine ta toute première partie.',
    icon: '🎯',
    test: (c) => c.gamesPlayed >= 1,
  },
  {
    id: 'perfect',
    label: 'Sans-faute',
    description: 'Réussis une partie à 100 %.',
    icon: '💯',
    test: (c) => c.total > 0 && c.score === c.total,
  },
  {
    id: 'streak-10',
    label: 'En feu',
    description: 'Enchaîne 10 bonnes réponses d’affilée.',
    icon: '🔥',
    test: (c) => c.bestStreak >= 10,
  },
  {
    id: 'explorer',
    label: 'Explorateur',
    description: 'Joue à 5 modes différents.',
    icon: '🧭',
    test: (c) => c.modesPlayed.length >= 5,
  },
  {
    id: 'globe-trotter',
    label: 'Globe-trotteur',
    description: 'Joue à 10 modes différents.',
    icon: '🌐',
    test: (c) => c.modesPlayed.length >= 10,
  },
  {
    id: 'centurion',
    label: 'Centurion',
    description: 'Cumule 100 bonnes réponses au total.',
    icon: '🏅',
    test: (c) => c.totalCorrect >= 100,
  },
  {
    id: 'veteran',
    label: 'Vétéran',
    description: 'Joue 25 parties.',
    icon: '🎖️',
    test: (c) => c.gamesPlayed >= 25,
  },
  {
    id: 'daily',
    label: 'Défi relevé',
    description: 'Termine un défi du jour.',
    icon: '📅',
    test: (c) => c.dailyDone,
  },
];

/** Renvoie les ids des succès actuellement validés par le contexte. */
export function evaluateAchievements(ctx: AchievementContext): string[] {
  return achievements.filter((a) => a.test(ctx)).map((a) => a.id);
}

export function getAchievement(id: string): Achievement | undefined {
  return achievements.find((a) => a.id === id);
}
