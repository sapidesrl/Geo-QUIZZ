import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { campaignChapters } from '../data/campaign';
import { continentLabel } from '../i18n/display';
import { useGameStore } from '../store/useGameStore';

export default function Campaign() {
  const { t } = useTranslation();
  const campaignProgress = useGameStore((s) => s.campaignProgress);

  return (
    <div className="py-4">
      <div className="mb-6">
        <Link to="/" className="text-sm text-slate-400 hover:text-white">
          {t('nav.home')}
        </Link>
        <h1 className="mt-2 text-2xl font-extrabold">{t('campaign.title')}</h1>
        <p className="mt-1 text-sm text-slate-400">{t('campaign.tagline')}</p>
      </div>

      <div className="flex flex-col gap-3">
        {campaignChapters.map((chapter) => {
          const done = chapter.levels.filter(
            (_, i) => campaignProgress[`${chapter.id}-${i}`]?.completed,
          ).length;
          const total = chapter.levels.length;
          const pct = total > 0 ? (done / total) * 100 : 0;

          return (
            <Link
              key={chapter.id}
              to={`/campaign/${chapter.id}`}
              className="flex items-center gap-4 rounded-xl bg-slate-800 p-4 transition hover:bg-slate-700"
            >
              <span className="shrink-0 text-4xl">{chapter.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="font-bold">{continentLabel(chapter.region)}</div>
                <div className="text-xs text-slate-400">
                  {t('campaign.levelProgress', { done, total })}
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-600">
                  <div
                    className="h-full bg-brand transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <span className="shrink-0 text-slate-500">›</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
