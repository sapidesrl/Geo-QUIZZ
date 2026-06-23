import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'react-router-dom';
import FlagImage from '../components/FlagImage';
import type { QuestionRecap } from '../engine/types';
import { getAchievement } from '../lib/achievements';
import { getModeById } from '../modes';
import { useGameStore } from '../store/useGameStore';

interface ResultState {
  score: number;
  total: number;
  bestStreak: number;
  elapsedMs: number;
  history: QuestionRecap[];
  newlyUnlocked?: string[];
}

function formatTime(ms: number, t: TFunction): string {
  const s = Math.round(ms / 1000);
  const m = Math.floor(s / 60);
  return m > 0 ? t('results.minSec', { m, s: s % 60 }) : t('results.sec', { s });
}

export default function Results() {
  const { t } = useTranslation();
  const { modeId } = useParams();
  const location = useLocation();
  const mode = getModeById(modeId);
  const best = useGameStore((s) => (modeId ? s.bestScores[modeId] : undefined));
  const state = location.state as ResultState | null;

  if (!state || !mode) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <p>{t('results.none')}</p>
        <Link to="/modes" className="rounded-xl bg-brand px-6 py-3 font-semibold">
          {t('nav.backToModes')}
        </Link>
      </div>
    );
  }

  const { score, total, bestStreak, elapsedMs, history, newlyUnlocked = [] } = state;
  const pct = Math.round((score / total) * 100);
  const emoji = pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '📚';
  const unlocked = newlyUnlocked.map(getAchievement).filter(Boolean);

  return (
    <div className="py-6">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-3 text-7xl">{emoji}</div>
        <h2 className="mb-1 text-2xl font-bold">
          {t(`modes.${mode.id}.label`, { defaultValue: mode.label })}
        </h2>
        <p className="text-5xl font-extrabold text-emerald-400">
          {score}/{total}
        </p>
        <p className="mt-1 text-slate-400">{t('results.pct', { pct })}</p>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-slate-800 p-3">
          <div className="text-xl font-bold text-amber-400">🔥 {bestStreak}</div>
          <div className="text-xs text-slate-400">{t('results.bestStreak')}</div>
        </div>
        <div className="rounded-xl bg-slate-800 p-3">
          <div className="text-xl font-bold">⏱ {formatTime(elapsedMs, t)}</div>
          <div className="text-xs text-slate-400">{t('results.time')}</div>
        </div>
        <div className="rounded-xl bg-slate-800 p-3">
          <div className="text-xl font-bold text-emerald-400">{best ?? score}</div>
          <div className="text-xs text-slate-400">{t('results.record')}</div>
        </div>
      </div>

      {unlocked.length > 0 && (
        <div className="animate-pop mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
          <h3 className="mb-2 text-sm font-semibold text-amber-300">
            {t('results.unlocked', { count: unlocked.length })}
          </h3>
          <ul className="space-y-2">
            {unlocked.map((a) => (
              <li key={a!.id} className="flex items-center gap-3">
                <span className="text-2xl">{a!.icon}</span>
                <span>
                  <span className="block font-semibold">
                    {t(`achievements.${a!.id}.label`, { defaultValue: a!.label })}
                  </span>
                  <span className="block text-sm text-slate-300">
                    {t(`achievements.${a!.id}.description`, { defaultValue: a!.description })}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {history.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-semibold text-slate-300">{t('results.recap')}</h3>
          <ul className="space-y-2">
            {history.map((q, i) => (
              <li
                key={i}
                className={`flex items-center gap-3 rounded-lg border-l-4 p-3 text-sm ${
                  q.correct
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-rose-500 bg-rose-500/10'
                }`}
              >
                <span>{q.correct ? '✅' : '❌'}</span>
                {q.flag && <FlagImage code={q.flag} className="text-xl shrink-0" />}
                <span className="flex-1">
                  <span className="block text-slate-300">{q.prompt}</span>
                  <span className="block font-semibold">
                    {q.answerLabel}
                    {q.distanceKm != null && (
                      <span className="ml-1 font-normal text-slate-400">
                        ({Math.round(q.distanceKm)} km)
                      </span>
                    )}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-xs flex-col gap-3">
        <Link
          to={`/game/${mode.id}`}
          className="rounded-xl bg-brand px-6 py-4 text-center font-semibold transition hover:bg-brand-dark"
        >
          {t('nav.replay')}
        </Link>
        <Link
          to="/modes"
          className="rounded-xl border border-slate-600 px-6 py-4 text-center font-semibold transition hover:bg-slate-800"
        >
          {t('nav.otherModes')}
        </Link>
      </div>
    </div>
  );
}
