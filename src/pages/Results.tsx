import { Link, useLocation, useParams } from 'react-router-dom';
import { getModeById } from '../modes';
import { useGameStore } from '../store/useGameStore';

interface ResultState {
  score: number;
  total: number;
}

export default function Results() {
  const { modeId } = useParams();
  const location = useLocation();
  const mode = getModeById(modeId);
  const best = useGameStore((s) => (modeId ? s.bestScores[modeId] : undefined));
  const state = location.state as ResultState | null;

  if (!state || !mode) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <p>Aucun résultat à afficher.</p>
        <Link to="/modes" className="rounded-xl bg-brand px-6 py-3 font-semibold">
          Retour aux modes
        </Link>
      </div>
    );
  }

  const { score, total } = state;
  const pct = Math.round((score / total) * 100);
  const emoji = pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '📚';

  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <div className="mb-4 text-7xl">{emoji}</div>
      <h2 className="mb-2 text-2xl font-bold">{mode.label}</h2>
      <p className="mb-1 text-5xl font-extrabold text-emerald-400">
        {score}/{total}
      </p>
      <p className="mb-8 text-slate-400">{pct}% de bonnes réponses</p>
      {best != null && (
        <p className="mb-8 text-sm text-slate-400">Meilleur score : {best}</p>
      )}

      <div className="flex w-full max-w-xs flex-col gap-3">
        <Link
          to={`/game/${mode.id}`}
          className="rounded-xl bg-brand px-6 py-4 font-semibold transition hover:bg-brand-dark"
        >
          Rejouer
        </Link>
        <Link
          to="/modes"
          className="rounded-xl border border-slate-600 px-6 py-4 font-semibold transition hover:bg-slate-800"
        >
          Autres modes
        </Link>
      </div>
    </div>
  );
}
