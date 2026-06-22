import { Link } from 'react-router-dom';

interface Props {
  current: number; // index de la question (1-based)
  total: number;
  score: number;
  streak: number;
  elapsedMs: number;
}

function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

export default function ScoreBar({ current, total, score, streak, elapsedMs }: Props) {
  const progress = Math.round(((current - 1) / total) * 100);
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
        <Link to="/modes" className="hover:text-white">
          ← Modes
        </Link>
        <span className="tabular-nums">⏱ {formatTime(elapsedMs)}</span>
        <span>
          {current}/{total}
        </span>
        {streak >= 2 && <span className="font-semibold text-amber-400">🔥 {streak}</span>}
        <span className="font-semibold text-emerald-400">Score {score}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
        <div className="h-full bg-brand transition-all" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
