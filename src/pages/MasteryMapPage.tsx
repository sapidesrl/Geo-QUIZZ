import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { countries } from '../data/countries';
import { REVIEW_MAX_BOX } from '../lib/review';
import { useGameStore } from '../store/useGameStore';

// MapLibre chargé à la demande : il ne pèse sur le bundle que sur cette page.
const MasteryMap = lazy(() => import('../components/MasteryMap'));

const LEGEND: { color: string; key: string }[] = [
  { color: '#10b981', key: 'mastery.mastered' },
  { color: '#eab308', key: 'mastery.learning' },
  { color: '#ef4444', key: 'mastery.toReview' },
  { color: '#274b66', key: 'mastery.unseen' },
];

export default function MasteryMapPage() {
  const { t } = useTranslation();
  const stats = useGameStore((s) => s.reviewStats);

  let mastered = 0;
  let toReview = 0;
  for (const c of countries) {
    const s = stats[c.cca2];
    if (!s || s.seen === 0) continue;
    if (s.box >= REVIEW_MAX_BOX) mastered += 1;
    else toReview += 1;
  }
  const unseen = countries.length - mastered - toReview;

  return (
    <div className="py-4">
      <div className="mb-4">
        <Link to="/stats" className="text-sm text-slate-300 hover:text-white">
          ← {t('stats.title')}
        </Link>
      </div>

      <h2 className="mb-4 text-2xl font-bold">{t('mastery.title')}</h2>

      <div className="mb-4 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-slate-800 p-3">
          <div className="text-2xl font-bold text-emerald-400">{mastered}</div>
          <div className="text-xs text-slate-400">{t('mastery.mastered')}</div>
        </div>
        <div className="rounded-xl bg-slate-800 p-3">
          <div className="text-2xl font-bold text-rose-400">{toReview}</div>
          <div className="text-xs text-slate-400">{t('mastery.toReview')}</div>
        </div>
        <div className="rounded-xl bg-slate-800 p-3">
          <div className="text-2xl font-bold text-slate-300">{unseen}</div>
          <div className="text-xs text-slate-400">{t('mastery.unseen')}</div>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex h-[60vh] min-h-[360px] w-full items-center justify-center rounded-xl bg-slate-800 text-slate-400">
            {t('game.loadingMap')}
          </div>
        }
      >
        <MasteryMap stats={stats} />
      </Suspense>

      <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-slate-300">
        {LEGEND.map((l) => (
          <span key={l.key} className="flex items-center gap-1.5">
            <span
              className="inline-block h-3 w-3 rounded-sm ring-1 ring-white/20"
              style={{ backgroundColor: l.color }}
            />
            {t(l.key)}
          </span>
        ))}
      </div>
    </div>
  );
}
