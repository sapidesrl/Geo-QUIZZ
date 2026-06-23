import { lazy, Suspense, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useParams } from 'react-router-dom';
import FlagImage from '../components/FlagImage';
import MultipleChoice from '../components/MultipleChoice';
import { countries } from '../data/countries';
import {
  CAMPAIGN_PASS_THRESHOLD,
  CAMPAIGN_QUESTIONS,
  campaignLevelKey,
  getChapterById,
} from '../data/campaign';
import { checkAnswer } from '../engine/check';
import type { Answer, Country, GenerateOptions, Question } from '../engine/types';
import { capitalName, continentLabel, countryName } from '../i18n/display';
import { capitalMc } from '../modes/capital-mc';
import { flagMc } from '../modes/flag-mc';
import { locateCountry } from '../modes/locate-country';
import { useGameStore } from '../store/useGameStore';

const MapPicker = lazy(() => import('../components/MapPicker'));

type Phase = 'discover' | 'quiz' | 'results';

const byCode = new Map(countries.map((c) => [c.cca2, c]));

function getLevelGenerators(levelIndex: number) {
  const gens = [flagMc.generate, capitalMc.generate];
  if (levelIndex >= 2) gens.push(locateCountry.generate);
  return gens;
}

function buildCampaignQuestions(levelCountries: Country[], levelIndex: number): Question[] {
  const opts: GenerateOptions = { countries: levelCountries, cities: [] };
  const gens = getLevelGenerators(levelIndex);
  const maxUnique = levelCountries.length * gens.length;
  const count = Math.min(CAMPAIGN_QUESTIONS, maxUnique);
  const questions: Question[] = [];
  const seen = new Set<string>();
  const maxAttempts = count * 20;
  let attempts = 0;
  while (questions.length < count && attempts < maxAttempts) {
    const gen = gens[Math.floor(Math.random() * gens.length)];
    const q = gen(opts);
    const key = `${q.prompt}||${q.answerLabel}`;
    if (!seen.has(key)) {
      seen.add(key);
      questions.push(q);
    }
    attempts++;
  }
  return questions;
}

// ─── Phase Découverte ─────────────────────────────────────────────────────────

function DiscoverPhase({
  levelCountries,
  chapterIcon,
  chapterLabel,
  levelNum,
  levelTotal,
  onStart,
}: {
  levelCountries: Country[];
  chapterIcon: string;
  chapterLabel: string;
  levelNum: number;
  levelTotal: number;
  onStart: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="py-4">
      <div className="mb-4 text-center">
        <div className="text-sm text-slate-400">
          {chapterIcon} {chapterLabel} — {t('campaign.levelOf', { n: levelNum, total: levelTotal })}
        </div>
        <h2 className="mt-1 text-xl font-bold">{t('campaign.discoverTitle')}</h2>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3">
        {levelCountries.map((c) => (
          <div key={c.cca2} className="rounded-xl bg-slate-800 p-3 text-center">
            <FlagImage code={c.cca2} className="mb-1 text-5xl" />
            <div className="mt-1 text-sm font-bold">{countryName(c)}</div>
            <div className="text-xs text-slate-400">🏛️ {capitalName(c.capital)}</div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onStart}
        className="w-full rounded-xl bg-brand p-4 text-lg font-semibold transition hover:bg-brand-dark"
      >
        {t('campaign.startQuiz')}
      </button>
    </div>
  );
}

// ─── Phase Quiz ───────────────────────────────────────────────────────────────

function QuizPhase({
  questions,
  onFinish,
}: {
  questions: Question[];
  onFinish: (score: number) => void;
}) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();
  const [picked, setPicked] = useState<{ lat: number; lng: number }>();
  const [distanceKm, setDistanceKm] = useState<number>();
  const finalScoreRef = useRef(0);

  const question = questions[index];
  const progress = Math.round((index / questions.length) * 100);

  function submit(answer: Answer) {
    if (revealed) return;
    const { correct, distanceKm: d } = checkAnswer(question, answer);
    setLastCorrect(correct);
    setDistanceKm(d);
    if (correct) {
      finalScoreRef.current += 1;
      setScore((s) => s + 1);
    }
    setRevealed(true);
  }

  function next() {
    if (index + 1 >= questions.length) {
      onFinish(finalScoreRef.current);
      return;
    }
    setIndex((i) => i + 1);
    setRevealed(false);
    setLastCorrect(false);
    setSelectedId(undefined);
    setPicked(undefined);
    setDistanceKm(undefined);
  }

  function selectChoice(id: string) {
    setSelectedId(id);
    submit({ kind: 'choice', choiceId: id });
  }

  return (
    <div className="py-4">
      <div className="mb-6">
        <div className="mb-1 flex justify-between text-sm text-slate-300">
          <span>
            {index + 1} / {questions.length}
          </span>
          <span className="font-semibold text-emerald-400">{t('scorebar.score', { n: score })}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
          <div className="h-full bg-brand transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="mb-6 flex flex-col items-center gap-4 text-center">
        {question.flag && <FlagImage code={question.flag} className="text-7xl" />}
        <h2 className="text-xl font-bold">{question.prompt}</h2>
      </div>

      {question.inputType === 'multiple-choice' && (
        <MultipleChoice
          choices={question.choices ?? []}
          selectedId={selectedId}
          correctId={question.correctChoiceId}
          revealed={revealed}
          onSelect={selectChoice}
        />
      )}

      {question.inputType === 'map-pin' && (
        <div className="space-y-4">
          <Suspense
            fallback={
              <div className="flex h-[55vh] min-h-[320px] w-full items-center justify-center rounded-xl bg-slate-800 text-slate-400">
                {t('game.loadingMap')}
              </div>
            }
          >
            <MapPicker
              picked={picked}
              target={question.target}
              revealed={revealed}
              onPick={setPicked}
            />
          </Suspense>
          {!revealed ? (
            <button
              type="button"
              disabled={!picked}
              onClick={() => picked && submit({ kind: 'point', ...picked })}
              className="w-full rounded-xl bg-brand p-4 text-lg font-semibold transition hover:bg-brand-dark disabled:opacity-50"
            >
              {picked ? t('game.validate') : t('game.placePin')}
            </button>
          ) : (
            <div
              className={`animate-pop rounded-xl p-4 text-center font-semibold ${
                lastCorrect ? 'bg-emerald-500/20 text-emerald-200' : 'bg-rose-500/20 text-rose-200'
              }`}
            >
              {lastCorrect ? t('game.wellPlaced') : t('game.tooFar')}{' '}
              {distanceKm != null && t('game.distance', { km: Math.round(distanceKm) })}
            </div>
          )}
        </div>
      )}

      {revealed && (
        <button
          type="button"
          onClick={next}
          className="animate-pop mt-6 w-full rounded-xl bg-slate-200 p-4 text-lg font-semibold text-slate-900 transition hover:bg-white"
        >
          {index + 1 >= questions.length ? t('game.seeResult') : t('game.next')}
        </button>
      )}
    </div>
  );
}

// ─── Phase Résultats ──────────────────────────────────────────────────────────

function ResultsPhase({
  score,
  total,
  chapterId,
  levelIndex,
  totalLevels,
  onReplay,
}: {
  score: number;
  total: number;
  chapterId: string;
  levelIndex: number;
  totalLevels: number;
  onReplay: () => void;
}) {
  const { t } = useTranslation();
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const passed = total > 0 && score / total >= CAMPAIGN_PASS_THRESHOLD;
  const hasNext = levelIndex + 1 < totalLevels;

  return (
    <div className="py-4 text-center">
      <div className="mb-4 text-6xl">{passed ? '🏆' : '📚'}</div>
      <h2 className="mb-1 text-2xl font-extrabold">
        {t('campaign.score', { score, total })}
      </h2>
      <p className="mb-2 text-slate-400">{t('results.pct', { pct })}</p>

      {passed ? (
        <p className="mb-6 font-semibold text-emerald-400">{t('campaign.completed')}</p>
      ) : (
        <p className="mb-6 text-sm text-slate-400">{t('campaign.passThreshold')}</p>
      )}

      <div className="flex flex-col gap-3">
        {passed && hasNext && (
          <Link
            to={`/campaign/${chapterId}/${levelIndex + 1}`}
            className="w-full rounded-xl bg-brand p-4 text-lg font-semibold transition hover:bg-brand-dark"
          >
            {t('campaign.nextLevel')}
          </Link>
        )}
        {passed && !hasNext && (
          <div className="rounded-xl bg-emerald-500/20 p-4 font-semibold text-emerald-200">
            {t('campaign.chapterDone')}
          </div>
        )}
        <button
          type="button"
          onClick={onReplay}
          className="w-full rounded-xl border border-slate-600 p-4 font-semibold transition hover:bg-slate-800"
        >
          {t('campaign.replay')}
        </button>
        <Link
          to={`/campaign/${chapterId}`}
          className="w-full rounded-xl border border-slate-600 p-4 font-semibold transition hover:bg-slate-800"
        >
          {t('campaign.backToChapter')}
        </Link>
      </div>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function CampaignLevel() {
  const { chapterId, levelIndex: levelIndexStr } = useParams();
  const campaignProgress = useGameStore((s) => s.campaignProgress);
  const recordCampaignLevel = useGameStore((s) => s.recordCampaignLevel);

  const chapter = getChapterById(chapterId);
  const levelIndex = parseInt(levelIndexStr ?? '', 10);

  const levelCodes = chapter?.levels[levelIndex] ?? [];
  const levelKey = levelCodes.join(',');

  const levelCountries = useMemo(
    () => levelCodes.map((code) => byCode.get(code)).filter((c): c is Country => c != null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [levelKey],
  );

  const [replayCount, setReplayCount] = useState(0);
  const [phase, setPhase] = useState<Phase>('discover');
  const [finalScore, setFinalScore] = useState(0);

  const questions = useMemo(
    () => (levelCountries.length >= 4 ? buildCampaignQuestions(levelCountries, levelIndex) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [levelKey, levelIndex, replayCount],
  );

  // Validation des paramètres — après les hooks
  if (
    !chapter ||
    isNaN(levelIndex) ||
    levelIndex < 0 ||
    levelIndex >= chapter.levels.length
  ) {
    return <Navigate to="/campaign" replace />;
  }

  const isUnlocked =
    levelIndex === 0 ||
    (campaignProgress[campaignLevelKey(chapter.id, levelIndex - 1)]?.completed ?? false);
  if (!isUnlocked) return <Navigate to={`/campaign/${chapterId}`} replace />;

  function handleQuizFinish(score: number) {
    setFinalScore(score);
    recordCampaignLevel(campaignLevelKey(chapter!.id, levelIndex), score, questions.length);
    setPhase('results');
  }

  function handleReplay() {
    setReplayCount((n) => n + 1);
    setFinalScore(0);
    setPhase('discover');
  }

  const chapterLabel = continentLabel(chapter.region);
  const totalLevels = chapter.levels.length;

  if (phase === 'discover') {
    return (
      <DiscoverPhase
        levelCountries={levelCountries}
        chapterIcon={chapter.icon}
        chapterLabel={chapterLabel}
        levelNum={levelIndex + 1}
        levelTotal={totalLevels}
        onStart={() => setPhase('quiz')}
      />
    );
  }

  if (phase === 'quiz') {
    return <QuizPhase questions={questions} onFinish={handleQuizFinish} />;
  }

  return (
    <ResultsPhase
      score={finalScore}
      total={questions.length}
      chapterId={chapter.id}
      levelIndex={levelIndex}
      totalLevels={totalLevels}
      onReplay={handleReplay}
    />
  );
}
