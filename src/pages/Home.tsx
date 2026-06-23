import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LANG_FLAGS, LANGS, setLang, type Lang } from '../i18n';
import { dailyKey } from '../lib/rng';
import { useGameStore } from '../store/useGameStore';

export default function Home() {
  const { t, i18n } = useTranslation();
  const soundOn = useGameStore((s) => s.soundOn);
  const toggleSound = useGameStore((s) => s.toggleSound);
  const dailyHistory = useGameStore((s) => s.dailyHistory);
  const dailyDoneToday = dailyHistory[dailyKey()] != null;
  const current = i18n.language as Lang;

  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <div className="mb-6 text-7xl">🌍</div>
      <h1 className="mb-3 text-4xl font-extrabold tracking-tight">Geo-QUIZZ</h1>
      <p className="mb-10 max-w-sm text-slate-300">{t('app.tagline')}</p>

      <div className="flex w-full max-w-xs flex-col gap-3">
        <Link
          to="/modes"
          className="rounded-xl bg-brand px-10 py-4 text-lg font-semibold shadow-lg transition hover:bg-brand-dark"
        >
          {t('app.play')}
        </Link>
        <Link
          to="/game/daily"
          className="rounded-xl border border-slate-600 px-10 py-3 font-semibold transition hover:bg-slate-800"
        >
          📅 {t('app.daily')} {dailyDoneToday && <span className="text-emerald-400">✓</span>}
        </Link>
        <Link
          to="/stats"
          className="rounded-xl border border-slate-600 px-10 py-3 font-semibold transition hover:bg-slate-800"
        >
          🏆 {t('app.trophies')}
        </Link>
      </div>

      <div className="mt-8 flex items-center gap-2" role="group" aria-label={t('app.language')}>
        {LANGS.map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => setLang(lang)}
            aria-pressed={current === lang}
            title={lang.toUpperCase()}
            className={`rounded-lg px-2 py-1 text-2xl transition ${
              current === lang ? 'bg-slate-700 ring-2 ring-brand' : 'opacity-60 hover:opacity-100'
            }`}
          >
            {LANG_FLAGS[lang]}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={toggleSound}
        className="mt-4 text-sm text-slate-400 hover:text-white"
        aria-pressed={soundOn}
      >
        {soundOn ? t('app.soundOn') : t('app.soundOff')}
      </button>
    </div>
  );
}
