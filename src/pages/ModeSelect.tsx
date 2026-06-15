import { Link, useNavigate } from 'react-router-dom';
import { gameModes } from '../modes';
import { useGameStore } from '../store/useGameStore';

export default function ModeSelect() {
  const navigate = useNavigate();
  const bestScores = useGameStore((s) => s.bestScores);
  const questionsPerGame = useGameStore((s) => s.questionsPerGame);
  const setQuestionsPerGame = useGameStore((s) => s.setQuestionsPerGame);

  return (
    <div className="py-4">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/" className="text-sm text-slate-300 hover:text-white">
          ← Accueil
        </Link>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          Questions :
          <select
            value={questionsPerGame}
            onChange={(e) => setQuestionsPerGame(Number(e.target.value))}
            className="rounded-lg border border-slate-600 bg-slate-800 px-2 py-1"
          >
            {[5, 10, 15, 20].map((n) => (
              <option key={n} value={n}>
                {n}
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
              {bestScores[mode.id] != null && (
                <span className="mt-1 block text-xs text-emerald-400">
                  Meilleur score : {bestScores[mode.id]}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
