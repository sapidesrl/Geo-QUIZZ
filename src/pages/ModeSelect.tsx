import { Link, useNavigate } from 'react-router-dom';
import { CONTINENTS } from '../engine/pool';
import { gameModes } from '../modes';
import type { Difficulty } from '../store/useGameStore';
import { useGameStore } from '../store/useGameStore';

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 'facile', label: 'Facile' },
  { value: 'moyen', label: 'Moyen' },
  { value: 'difficile', label: 'Difficile' },
];

const selectClass = 'rounded-lg border border-slate-600 bg-slate-800 px-2 py-1 text-slate-100';

export default function ModeSelect() {
  const navigate = useNavigate();
  const bestScores = useGameStore((s) => s.bestScores);
  const bestStreaks = useGameStore((s) => s.bestStreaks);
  const questionsPerGame = useGameStore((s) => s.questionsPerGame);
  const setQuestionsPerGame = useGameStore((s) => s.setQuestionsPerGame);
  const continent = useGameStore((s) => s.continent);
  const setContinent = useGameStore((s) => s.setContinent);
  const difficulty = useGameStore((s) => s.difficulty);
  const setDifficulty = useGameStore((s) => s.setDifficulty);

  return (
    <div className="py-4">
      <div className="mb-4">
        <Link to="/" className="text-sm text-slate-300 hover:text-white">
          ← Accueil
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-2 text-sm text-slate-300">
        <label className="flex flex-col gap-1">
          Questions
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
          Continent
          <select
            value={continent}
            onChange={(e) => setContinent(e.target.value)}
            className={selectClass}
          >
            {CONTINENTS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          Difficulté
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className={selectClass}
          >
            {DIFFICULTIES.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <h2 className="mb-4 text-2xl font-bold">Choisis un mode</h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {gameModes.map((mode) => (
          <button
            key={mode.id}
            type="button"
            onClick={() => navigate(`/game/${mode.id}`)}
            className="flex items-start gap-4 rounded-xl border-2 border-slate-700 bg-slate-800 p-4 text-left transition hover:border-brand hover:bg-slate-700"
          >
            <span className="text-3xl">{mode.icon}</span>
            <span className="flex-1">
              <span className="block font-semibold">{mode.label}</span>
              <span className="block text-sm text-slate-400">{mode.description}</span>
              {(bestScores[mode.id] != null || bestStreaks[mode.id] != null) && (
                <span className="mt-1 block text-xs text-slate-400">
                  {bestScores[mode.id] != null && (
                    <span className="text-emerald-400">Record {bestScores[mode.id]}</span>
                  )}
                  {bestStreaks[mode.id] ? (
                    <span className="ml-2 text-amber-400">🔥 {bestStreaks[mode.id]}</span>
                  ) : null}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
