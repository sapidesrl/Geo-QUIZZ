import { Fragment, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import FlagImage from '../components/FlagImage';
import { resolveTeam, worldCupGroups } from '../data/worldcup-groups';
import type { Lang } from '../i18n';
import { shuffle } from '../lib/shuffle';
import { playCorrect, playFinish, playWrong, vibrate } from '../lib/sound';
import { useGameStore } from '../store/useGameStore';

// Couleur + numéro par pays du groupe : rend le lien drapeau↔pays↔capitale lisible.
const PALETTE = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];

const POINTS_PER_GROUP = 8; // 4 drapeaux + 4 capitales
const TOTAL_POINTS = worldCupGroups.length * POINTS_PER_GROUP;

type Selection = { type: 'flag' | 'capital'; id: string } | undefined;
type Line = { key: string; x1: number; y1: number; x2: number; y2: number; color: string };

/** Crée un ref-callback qui stocke/retire l'élément dans une Map indexée par code. */
function mapRef(map: Map<string, HTMLButtonElement>, code: string) {
  return (el: HTMLButtonElement | null) => {
    if (el) map.set(code, el);
    else map.delete(code);
  };
}

export default function WorldCupMatch() {
  const { t, i18n } = useTranslation();
  const soundOn = useGameStore((s) => s.soundOn);
  const recordGame = useGameStore((s) => s.recordGame);

  const [groupIndex, setGroupIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [done, setDone] = useState(false);
  const [replay, setReplay] = useState(0);

  // Liens : drapeau (cca2) → pays (cca2) ; capitale (cca2 du propriétaire) → pays.
  const [flagLink, setFlagLink] = useState<Record<string, string>>({});
  const [capLink, setCapLink] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Selection>();
  const [checked, setChecked] = useState(false);

  const group = worldCupGroups[groupIndex];

  // Équipes résolues (drapeau + nom + capitale localisés). Re-résolu si la langue change.
  const teams = useMemo(
    () => group.teams.map((code) => resolveTeam(code, i18n.language as Lang)),
    [group, i18n.language],
  );
  const teamByCode = useMemo(() => new Map(teams.map((tm) => [tm.code, tm])), [teams]);

  // Index couleur/numéro par équipe (ordre fixe au milieu).
  const colorOf = useMemo(() => {
    const m = new Map<string, number>();
    group.teams.forEach((code, i) => m.set(code, i));
    return m;
  }, [group]);

  // Ordre des colonnes (mélangé, indépendant de la langue ; regénéré par groupe / rejoue).
  const flagOrder = useMemo(
    () => shuffle(group.teams),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groupIndex, replay],
  );
  const capitalOrder = useMemo(
    () => shuffle(group.teams),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groupIndex, replay],
  );

  const allLinked =
    Object.keys(flagLink).length === group.teams.length &&
    Object.keys(capLink).length === group.teams.length;

  // Tracé des lignes reliant les cases liées (drapeau↔pays, capitale↔pays).
  const wrapRef = useRef<HTMLDivElement>(null);
  const flagRefs = useRef(new Map<string, HTMLButtonElement>());
  const countryRefs = useRef(new Map<string, HTMLButtonElement>());
  const capRefs = useRef(new Map<string, HTMLButtonElement>());
  const [lines, setLines] = useState<Line[]>([]);

  useLayoutEffect(() => {
    function compute() {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const base = wrap.getBoundingClientRect();
      const out: Line[] = [];
      // Drapeau (gauche) → pays (milieu) : bord droit du drapeau vers bord gauche du pays.
      for (const [flagCode, countryCode] of Object.entries(flagLink)) {
        const f = flagRefs.current.get(flagCode);
        const c = countryRefs.current.get(countryCode);
        if (!f || !c) continue;
        const fr = f.getBoundingClientRect();
        const cr = c.getBoundingClientRect();
        out.push({
          key: `f-${flagCode}`,
          x1: fr.right - base.left,
          y1: fr.top + fr.height / 2 - base.top,
          x2: cr.left - base.left,
          y2: cr.top + cr.height / 2 - base.top,
          color: PALETTE[colorOf.get(countryCode) ?? 0],
        });
      }
      // Pays (milieu) → capitale (droite) : bord droit du pays vers bord gauche de la capitale.
      for (const [capCode, countryCode] of Object.entries(capLink)) {
        const p = capRefs.current.get(capCode);
        const c = countryRefs.current.get(countryCode);
        if (!p || !c) continue;
        const pr = p.getBoundingClientRect();
        const cr = c.getBoundingClientRect();
        out.push({
          key: `c-${capCode}`,
          x1: cr.right - base.left,
          y1: cr.top + cr.height / 2 - base.top,
          x2: pr.left - base.left,
          y2: pr.top + pr.height / 2 - base.top,
          color: PALETTE[colorOf.get(countryCode) ?? 0],
        });
      }
      setLines(out);
    }
    compute();
    const wrap = wrapRef.current;
    const ro = new ResizeObserver(compute);
    if (wrap) ro.observe(wrap);
    window.addEventListener('resize', compute);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', compute);
    };
  }, [flagLink, capLink, colorOf, groupIndex, teams]);

  function assignToCountry(countryCca2: string) {
    if (!selected || checked) return;
    const setter = selected.type === 'flag' ? setFlagLink : setCapLink;
    setter((prev) => {
      const next = { ...prev };
      // 1:1 — un pays ne reçoit qu'un drapeau / qu'une capitale.
      for (const k of Object.keys(next)) if (next[k] === countryCca2) delete next[k];
      if (prev[selected.id] === countryCca2) delete next[selected.id];
      else next[selected.id] = countryCca2;
      return next;
    });
    setSelected(undefined);
  }

  function toggleSelect(type: 'flag' | 'capital', id: string) {
    if (checked) return;
    setSelected((s) => (s && s.type === type && s.id === id ? undefined : { type, id }));
  }

  function validate() {
    if (!allLinked || checked) return;
    let score = 0;
    for (const code of group.teams) {
      if (flagLink[code] === code) score += 1;
      if (capLink[code] === code) score += 1;
    }
    setTotalScore((s) => s + score);
    setChecked(true);
    if (soundOn) (score === POINTS_PER_GROUP ? playCorrect : playWrong)();
    vibrate(score === POINTS_PER_GROUP ? 30 : [60, 40, 60]);
  }

  function nextGroup() {
    if (groupIndex + 1 >= worldCupGroups.length) {
      recordGame({
        modeId: 'worldcup-match',
        score: totalScore,
        total: TOTAL_POINTS,
        bestStreak: 0,
        isDaily: false,
      });
      if (soundOn) playFinish();
      setDone(true);
      return;
    }
    setGroupIndex((i) => i + 1);
    setFlagLink({});
    setCapLink({});
    setSelected(undefined);
    setChecked(false);
  }

  function restart() {
    setGroupIndex(0);
    setTotalScore(0);
    setFlagLink({});
    setCapLink({});
    setSelected(undefined);
    setChecked(false);
    setDone(false);
    setReplay((n) => n + 1);
  }

  if (done) {
    const pct = Math.round((totalScore / TOTAL_POINTS) * 100);
    return (
      <div className="py-8 text-center">
        <div className="mb-4 text-6xl">{pct >= 75 ? '🏆' : '⚽'}</div>
        <h2 className="mb-1 text-2xl font-extrabold">
          {t('match.finalScore', { score: totalScore, total: TOTAL_POINTS })}
        </h2>
        <p className="mb-6 text-slate-400">{t('results.pct', { pct })}</p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={restart}
            className="w-full rounded-xl bg-brand p-4 text-lg font-semibold transition hover:bg-brand-dark"
          >
            {t('match.replay')}
          </button>
          <Link
            to="/modes"
            className="w-full rounded-xl border border-slate-600 p-4 font-semibold transition hover:bg-slate-800"
          >
            {t('nav.backToModes')}
          </Link>
        </div>
      </div>
    );
  }

  // Badge coloré (numéro du pays lié) affiché sur un drapeau / une capitale.
  function LinkBadge({ countryCca2 }: { countryCca2?: string }) {
    if (countryCca2 == null) return null;
    const i = colorOf.get(countryCca2) ?? 0;
    return (
      <span
        className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
        style={{ backgroundColor: PALETTE[i] }}
      >
        {i + 1}
      </span>
    );
  }

  function cardStateClass(type: 'flag' | 'capital', id: string) {
    const linked = (type === 'flag' ? flagLink : capLink)[id];
    if (checked) {
      const correct = linked === id;
      return correct
        ? 'border-emerald-500 bg-emerald-500/10'
        : 'border-rose-500 bg-rose-500/10';
    }
    if (selected?.type === type && selected.id === id) return 'border-brand bg-slate-700 ring-2 ring-brand';
    if (linked) return 'border-slate-500 bg-slate-700';
    return 'border-slate-700 bg-slate-800 hover:border-slate-500';
  }

  return (
    <div className="flex flex-1 flex-col py-4">
      <div className="mb-3">
        <Link to="/modes" className="text-sm text-slate-300 hover:text-white">
          {t('nav.modes')}
        </Link>
      </div>

      <div className="mb-1 flex items-center justify-between text-sm text-slate-300">
        <span>
          {t('match.groupOf', { id: group.id, n: groupIndex + 1, total: worldCupGroups.length })}
        </span>
        <span className="font-semibold text-emerald-400">
          {t('scorebar.score', { n: totalScore })}
        </span>
      </div>
      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-slate-700">
        <div
          className="h-full bg-brand transition-all"
          style={{ width: `${(groupIndex / worldCupGroups.length) * 100}%` }}
        />
      </div>

      <p className="mb-4 text-center text-sm text-slate-400">{t('match.instructions')}</p>

      <div className="flex flex-1 flex-col justify-center">
      <div ref={wrapRef} className="relative">
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
          {lines.map((l) => (
            <line
              key={l.key}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              stroke={l.color}
              strokeWidth={3}
              strokeLinecap="round"
              opacity={0.9}
            />
          ))}
        </svg>
        {/* Grille en ordre rangée-par-rangée : chaque rangée aligne drapeau /
            pays / capitale à la même hauteur (align-items: stretch). */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2 sm:gap-3">
          <div className="mb-1 text-center text-xs font-semibold uppercase text-slate-500">
            {t('match.flags')}
          </div>
          <div className="mb-1 text-center text-xs font-semibold uppercase text-slate-500">
            {t('match.countries')}
          </div>
          <div className="mb-1 text-center text-xs font-semibold uppercase text-slate-500">
            {t('match.capitals')}
          </div>

          {group.teams.map((_, i) => {
            const flagCode = flagOrder[i];
            const tm = teams[i];
            const capCode = capitalOrder[i];
            return (
              <Fragment key={i}>
                {/* Drapeau */}
                <button
                  ref={mapRef(flagRefs.current, flagCode)}
                  type="button"
                  onClick={() => toggleSelect('flag', flagCode)}
                  disabled={checked}
                  className={`flex items-center gap-2 rounded-xl border-2 p-2 transition ${cardStateClass('flag', flagCode)}`}
                >
                  <FlagImage code={teamByCode.get(flagCode)?.flag ?? flagCode} className="text-3xl" />
                  <LinkBadge countryCca2={flagLink[flagCode]} />
                </button>

                {/* Pays */}
                <button
                  ref={mapRef(countryRefs.current, tm.code)}
                  type="button"
                  onClick={() => assignToCountry(tm.code)}
                  disabled={checked || !selected}
                  className="flex min-w-[7rem] items-center gap-2 rounded-xl border-2 border-slate-600 bg-slate-900 p-2 text-left text-sm font-semibold transition enabled:hover:border-brand disabled:opacity-90"
                >
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: PALETTE[i] }}
                  >
                    {i + 1}
                  </span>
                  <span className="leading-tight">{tm.name}</span>
                </button>

                {/* Capitale */}
                <button
                  ref={mapRef(capRefs.current, capCode)}
                  type="button"
                  onClick={() => toggleSelect('capital', capCode)}
                  disabled={checked}
                  className={`flex items-center justify-between gap-2 rounded-xl border-2 p-2 text-left text-sm transition ${cardStateClass('capital', capCode)}`}
                >
                  <span className="leading-tight">{teamByCode.get(capCode)?.capital}</span>
                  <LinkBadge countryCca2={capLink[capCode]} />
                </button>
              </Fragment>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        {!checked ? (
          <button
            type="button"
            disabled={!allLinked}
            onClick={validate}
            className="w-full rounded-xl bg-brand p-4 text-lg font-semibold transition hover:bg-brand-dark disabled:opacity-50"
          >
            {t('match.validate')}
          </button>
        ) : (
          <button
            type="button"
            onClick={nextGroup}
            className="animate-pop w-full rounded-xl bg-slate-200 p-4 text-lg font-semibold text-slate-900 transition hover:bg-white"
          >
            {groupIndex + 1 >= worldCupGroups.length ? t('game.seeResult') : t('match.nextGroup')}
          </button>
        )}
      </div>
      </div>
    </div>
  );
}
