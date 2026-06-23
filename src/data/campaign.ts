import { countries } from './countries';

export interface CampaignChapter {
  id: string;
  region: string;
  icon: string;
  levels: string[][];
}

export const CAMPAIGN_QUESTIONS = 8;
export const CAMPAIGN_PASS_THRESHOLD = 0.75;

function buildLevels(region: string, levelSize = 7): string[][] {
  const pool = countries
    .filter((c) => c.region === region)
    .sort((a, b) => b.population - a.population)
    .map((c) => c.cca2);

  const levels: string[][] = [];
  for (let i = 0; i < pool.length; i += levelSize) {
    levels.push(pool.slice(i, i + levelSize));
  }

  // Si le dernier groupe est trop petit pour un QCM (< 4 choix), le fusionner avec l'avant-dernier.
  if (levels.length > 1 && (levels[levels.length - 1]?.length ?? 0) < 4) {
    const last = levels.pop()!;
    levels[levels.length - 1].push(...last);
  }

  return levels;
}

export const campaignChapters: CampaignChapter[] = [
  { id: 'europe', region: 'Europe', icon: '🏛️', levels: buildLevels('Europe') },
  { id: 'americas', region: 'Americas', icon: '🌎', levels: buildLevels('Americas') },
  { id: 'asia', region: 'Asia', icon: '🌏', levels: buildLevels('Asia') },
  { id: 'africa', region: 'Africa', icon: '🌍', levels: buildLevels('Africa') },
  { id: 'oceania', region: 'Oceania', icon: '🏝️', levels: buildLevels('Oceania') },
];

export function getChapterById(id: string | undefined): CampaignChapter | undefined {
  return campaignChapters.find((c) => c.id === id);
}

export function campaignLevelKey(chapterId: string, levelIndex: number): string {
  return `${chapterId}-${levelIndex}`;
}
