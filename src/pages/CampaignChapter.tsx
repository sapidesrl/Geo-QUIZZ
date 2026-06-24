import { useTranslation } from 'react-i18next';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getChapterById } from '../data/campaign';
import { continentLabel } from '../i18n/display';
import { useGameStore } from '../store/useGameStore';

export default function CampaignChapter() {
  const { t } = useTranslation();
  const { chapterId } = useParams();
  const chapter = getChapterById(chapterId);
  const campaignProgress = useGameStore((s) => s.campaignProgress);

  if (!chapter) return <Navigate to="/campaign" replace />;

  function isUnlocked(i: number): boolean {
    if (i === 0) return true;
    return campaignProgress[`${chapter!.id}-${i - 1}`]?.completed ?? false;
  }

  const modesIcon = (i: number) => (i === 0 ? '🚩' : i === 1 ? '🚩 🏛️' : '🚩 🏛️ 🗺️');

  return (
    <div className="py-4">
      <div className="mb-6">
        <Link to="/campaign" className="text-sm text-slate-400 hover:text-white">
          ← {t('campaign.title')}
        </Link>
        <h1 className="mt-2 flex items-center gap-2 text-2xl font-extrabold">
          <span>{chapter.icon}</span>
          {continentLabel(chapter.region)}
        </h1>
      </div>

      <div className="flex flex-col gap-2">
        {chapter.levels.map((codes, i) => {
          const unlocked = isUnlocked(i);
          const progress = campaignProgress[`${chapter.id}-${i}`];

          return (
            <div key={i}>
              {unlocked ? (
                <Link
                  to={`/campaign/${chapter.id}/${i}`}
                  className="flex items-center gap-3 rounded-xl bg-slate-800 p-4 transition hover:bg-slate-700"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700 text-sm font-bold">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">
                      {t('campaign.levelOf', { n: i + 1, total: chapter.levels.length })}
                    </div>
                    <div className="text-xs text-slate-400">
                      {codes.length} {t('campaign.countries')} · {modesIcon(i)}
                    </div>
                  </div>
                  <div className="shrink-0 text-sm">
                    {progress ? (
                      <span className={progress.completed ? 'text-emerald-400' : 'text-rose-400'}>
                        {progress.completed ? '✅' : '❌'} {progress.bestScore}/{progress.total}
                      </span>
                    ) : (
                      <span className="text-slate-500">›</span>
                    )}
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-3 rounded-xl bg-slate-900 p-4 opacity-40">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-lg">
                    🔒
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-slate-500">
                      {t('campaign.levelOf', { n: i + 1, total: chapter.levels.length })}
                    </div>
                    <div className="text-xs text-slate-600">{t('campaign.locked')}</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Link
        to={`/campaign/${chapter.id}/match`}
        className="mt-4 flex items-center gap-3 rounded-xl border border-slate-600 p-4 font-semibold transition hover:bg-slate-800"
      >
        <span className="text-2xl">🔗</span>
        <span>{t('campaign.matchButton')}</span>
      </Link>
    </div>
  );
}
