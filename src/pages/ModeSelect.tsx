import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { countries } from '../data/countries';
import { CONTINENTS } from '../engine/pool';
import { continentFilterLabel } from '../i18n/display';
import { countriesToReview } from '../lib/review';
import { gameModes } from '../modes';
import { categoryOrder, modeCategory } from '../modes/categories';
import type { Difficulty } from '../store/useGameStore';
import { useGameStore } from '../store/useGameStore';

const DIFFICULTIES: { value: Difficulty; labelKey: string }[] = [
  { value: 'facile', labelKey: 'filters.easy' },
  { value: 'moyen', labelKey: 'filters.medium' },
  { value: 'difficile', labelKey: 'filters.hard' },
];

const selectClass = 'rounded-lg border border-slate-600 bg-slate-800 px-2 py-1 text-slate-100';

export default function ModeSelect() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const bestScores = useGameStore((s) => s.bestScores);
  const bestStreaks = useGameStore((s) => s.bestStreaks);
  const questionsPerGame = useGameStore((s) => s.questionsPerGame);
  const setQuestionsPerGame = useGameStore((s) => s.setQuestionsPerGame);
  const continent = useGameStore((s) => s.continent);
  const setContinent = useGameStore((s) => s.setContinent);
  const difficulty = useGameStore((s) => s.difficulty);
  const setDifficulty = useGameStore((s) => s.setDifficulty);
  const reviewStats = useGameStore((s) => s.reviewStats);
  const reviewCount = countriesToReview(reviewStats, countries).length;

  return (
    <div className="py-4">
      <div className="mb-4">
        <Link to="/" className="text-sm text-slate-300 hover:text-white">
          {t('nav.home')}
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-2 text-sm text-slate-300">
        <label className="flex flex-col gap-1">
          {t('filters.questions')}
          <select
            value={questionsPerGame}
            onChange={(e) => setQuestionsPerGame(Number(e.target.value))}
            className={selectClass}
          >
            {[5, 10, 15, 20].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          {t('filters.continent')}
          <select
            value={continent}
            onChange={(e) => setContinent(e.target.value)}
            className={selectClass}
          >
            {CONTINENTS.map((c) => (
              <option key={c} value={c}>
                {continentFilterLabel(c)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          {t('filters.difficulty')}
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className={selectClass}
          >
            {DIFFICULTIES.map((d) => (
              <option key={d.value} value={d.value}>
                {t(d.labelKey)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <h2 className="mb-4 text-2xl font-bold">{t('modeselect.title')}</h2>

      {categoryOrder.map((cat) => {
        const modes = gameModes.filter(
          (m) => m.id !== 'daily' && modeCategory[m.id] === cat.id,
        );
        if (modes.length === 0 && cat.id !== 'worldcup') return null;
        return (
          <section key={cat.id} className="mb-7">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-200">
              <span>{cat.icon}</span>
              {t(`categories.${cat.id}`)}
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {modes.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => navigate(`/game/${mode.id}`)}
                  className="flex items-start gap-4 rounded-xl border-2 border-slate-700 bg-slate-800 p-4 text-left transition hover:border-brand hover:bg-slate-700"
                >
                  <span className="text-3xl">{mode.icon}</span>
                  <span className="flex-1">
                    <span className="block font-semibold">
                      {t(`modes.${mode.id}.label`, { defaultValue: mode.label })}
                    </span>
                    <span className="block text-sm text-slate-400">
                      {t(`modes.${mode.id}.description`, { defaultValue: mode.description })}
                    </span>
                    {mode.id === 'review' && reviewCount > 0 && (
                      <span className="mt-1 block text-xs font-semibold text-amber-400">
                        {t('modeselect.toReview', { n: reviewCount })}
                      </span>
                    )}
                    {(bestScores[mode.id] != null || bestStreaks[mode.id] != null) && (
                      <span className="mt-1 block text-xs text-slate-400">
                        {bestScores[mode.id] != null && (
                          <span className="text-emerald-400">
                            {t('modeselect.record', { n: bestScores[mode.id] })}
                          </span>
                        )}
                        {bestStreaks[mode.id] ? (
                          <span className="ml-2 text-amber-400">🔥 {bestStreaks[mode.id]}</span>
                        ) : null}
                      </span>
                    )}
                  </span>
                </button>
              ))}

              {/* Mode spécial « association » (hors moteur de questions). */}
              {cat.id === 'worldcup' && (
                <Link
                  to="/worldcup-match"
                  className="flex items-start gap-4 rounded-xl border-2 border-slate-700 bg-slate-800 p-4 text-left transition hover:border-brand hover:bg-slate-700"
                >
                  <span className="text-3xl">🔗</span>
                  <span className="flex-1">
                    <span className="block font-semibold">{t('match.label')}</span>
                    <span className="block text-sm text-slate-400">{t('match.description')}</span>
                    {bestScores['worldcup-match'] != null && (
                      <span className="mt-1 block text-xs text-emerald-400">
                        {t('modeselect.record', { n: bestScores['worldcup-match'] })}
                      </span>
                    )}
                  </span>
                </Link>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
