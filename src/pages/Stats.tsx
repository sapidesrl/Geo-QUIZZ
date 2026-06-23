import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { achievements } from '../lib/achievements';
import { useGameStore } from '../store/useGameStore';

function Tile({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-xl bg-slate-800 p-3 text-center">
      <div className="text-2xl font-bold text-emerald-400">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}

export default function Stats() {
  const { t } = useTranslation();
  const gamesPlayed = useGameStore((s) => s.gamesPlayed);
  const totalCorrect = useGameStore((s) => s.totalCorrect);
  const totalAnswered = useGameStore((s) => s.totalAnswered);
  const modesPlayed = useGameStore((s) => s.modesPlayed);
  const unlocked = useGameStore((s) => s.unlocked);
  const dailyHistory = useGameStore((s) => s.dailyHistory);

  const accuracy = totalAnswered ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const dailyCount = Object.keys(dailyHistory).length;

  return (
    <div className="py-4">
      <div className="mb-4">
        <Link to="/" className="text-sm text-slate-300 hover:text-white">
          {t('nav.home')}
        </Link>
      </div>

      <h2 className="mb-4 text-2xl font-bold">{t('stats.title')}</h2>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <Tile value={gamesPlayed} label={t('stats.games')} />
        <Tile value={totalCorrect} label={t('stats.goodAnswers')} />
        <Tile value={`${accuracy}%`} label={t('stats.accuracy')} />
        <Tile value={modesPlayed.length} label={t('stats.modesTried')} />
        <Tile value={dailyCount} label={t('stats.dailies')} />
        <Tile value={`${unlocked.length}/${achievements.length}`} label={t('stats.achievements')} />
      </div>

      <h3 className="mb-3 text-lg font-semibold">{t('stats.achievementsTitle')}</h3>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {achievements.map((a) => {
          const got = unlocked.includes(a.id);
          return (
            <li
              key={a.id}
              className={`flex items-center gap-3 rounded-xl border-2 p-3 ${
                got
                  ? 'border-amber-500/50 bg-amber-500/10'
                  : 'border-slate-700 bg-slate-800/60 opacity-60'
              }`}
            >
              <span className={`text-3xl ${got ? '' : 'grayscale'}`}>{got ? a.icon : '🔒'}</span>
              <span className="flex-1">
                <span className="block font-semibold">
                  {t(`achievements.${a.id}.label`, { defaultValue: a.label })}
                </span>
                <span className="block text-sm text-slate-400">
                  {t(`achievements.${a.id}.description`, { defaultValue: a.description })}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
