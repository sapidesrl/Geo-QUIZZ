import { Link } from 'react-router-dom';
import { dailyKey } from '../lib/rng';
import { useGameStore } from '../store/useGameStore';

export default function Home() {
  const soundOn = useGameStore((s) => s.soundOn);
  const toggleSound = useGameStore((s) => s.toggleSound);
  const dailyHistory = useGameStore((s) => s.dailyHistory);
  const dailyDoneToday = dailyHistory[dailyKey()] != null;

  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <div className="mb-6 text-7xl">🌍</div>
      <h1 className="mb-3 text-4xl font-extrabold tracking-tight">Geo-QUIZZ</h1>
      <p className="mb-10 max-w-sm text-slate-300">
        Teste ta géographie : capitales, drapeaux, frontières, monnaies, langues et
        localisation sur la carte du monde.
      </p>

      <div className="flex w-full max-w-xs flex-col gap-3">
        <Link
          to="/modes"
          className="rounded-xl bg-brand px-10 py-4 text-lg font-semibold shadow-lg transition hover:bg-brand-dark"
        >
          Jouer
        </Link>
        <Link
          to="/game/daily"
          className="rounded-xl border border-slate-600 px-10 py-3 font-semibold transition hover:bg-slate-800"
        >
          📅 Défi du jour {dailyDoneToday && <span className="text-emerald-400">✓</span>}
        </Link>
        <Link
          to="/stats"
          className="rounded-xl border border-slate-600 px-10 py-3 font-semibold transition hover:bg-slate-800"
        >
          🏆 Trophées
        </Link>
      </div>

      <button
        type="button"
        onClick={toggleSound}
        className="mt-8 text-sm text-slate-400 hover:text-white"
        aria-pressed={soundOn}
      >
        {soundOn ? '🔊 Sons activés' : '🔇 Sons coupés'}
      </button>
    </div>
  );
}
