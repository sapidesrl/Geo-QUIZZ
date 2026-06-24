import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import FlagImage from '../components/FlagImage';
import FreeTextInput from '../components/FreeTextInput';
import MultipleChoice from '../components/MultipleChoice';
import ScoreBar from '../components/ScoreBar';
import { countries } from '../data/countries';
import { checkAnswer } from '../engine/check';
import { defaultGenerateOptions } from '../engine/generate';
import { buildGenerateOptions } from '../engine/pool';
import type { Answer, Question, QuestionRecap } from '../engine/types';
import { dailyKey, dailySeed, withSeed } from '../lib/rng';
import { selectReviewPool } from '../lib/review';
import { playCorrect, playFinish, playWrong, vibrate } from '../lib/sound';
import { getModeById } from '../modes';
import { useGameStore } from '../store/useGameStore';

/** Nombre de questions du défi du jour (fixe, identique pour tous). */
const DAILY_QUESTIONS = 10;

// Chargé à la demande : MapLibre + géométrie monde ne pèsent sur le bundle
// que pour les modes carte.
const MapPicker = lazy(() => import('../components/MapPicker'));

export default function Game() {
  const { t } = useTranslation();
  const { modeId } = useParams();
  const navigate = useNavigate();
  const mode = getModeById(modeId);
  const questionsPerGame = useGameStore((s) => s.questionsPerGame);
  const continent = useGameStore((s) => s.continent);
  const difficulty = useGameStore((s) => s.difficulty);
  const soundOn = useGameStore((s) => s.soundOn);
  const recordGame = useGameStore((s) => s.recordGame);
  const recordAnswer = useGameStore((s) => s.recordAnswer);
  const reviewStats = useGameStore((s) => s.reviewStats);

  const isDaily = mode?.id === 'daily';
  const isReview = mode?.id === 'review';

  // Lu via une ref pour que le tirage de révision soit figé au début de la
  // session (sinon chaque réponse modifierait reviewStats et régénérerait le quiz).
  const reviewStatsRef = useRef(reviewStats);
  reviewStatsRef.current = reviewStats;

  const session = useMemo<Question[]>(() => {
    if (!mode) return [];

    function buildSession(generate: () => Question, count: number): Question[] {
      const questions: Question[] = [];
      const seen = new Set<string>();
      // Plafond : évite une boucle infinie si le pool est trop petit.
      const maxAttempts = count * 10;
      let attempts = 0;
      while (questions.length < count && attempts < maxAttempts) {
        const q = generate();
        const key = `${q.prompt}||${q.answerLabel}`;
        if (!seen.has(key)) {
          seen.add(key);
          questions.push(q);
        }
        attempts++;
      }
      return questions;
    }

    // Défi du jour : tirage déterministe (même quiz pour tous), filtres ignorés.
    if (isDaily) {
      return withSeed(dailySeed(), () =>
        buildSession(() => mode.generate(defaultGenerateOptions), DAILY_QUESTIONS),
      );
    }
    // Révision : on restreint le pool aux pays les plus faibles (figés au départ).
    if (isReview) {
      const opts = { countries: selectReviewPool(reviewStatsRef.current, countries), cities: [] };
      return buildSession(() => mode.generate(opts), questionsPerGame);
    }
    const opts = buildGenerateOptions(continent, difficulty);
    return buildSession(() => mode.generate(opts), questionsPerGame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, isDaily, isReview, questionsPerGame, continent, difficulty]);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string>();
  const [picked, setPicked] = useState<{ lat: number; lng: number }>();
  const [pickedCode, setPickedCode] = useState<string>();
  const [distanceKm, setDistanceKm] = useState<number>();
  const [history, setHistory] = useState<QuestionRecap[]>([]);

  // Chronomètre : démarre/redémarre avec la session, tick chaque seconde.
  const startRef = useRef(Date.now());
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    startRef.current = Date.now();
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [session]);

  // Raccourcis clavier : 1–4 pour répondre (QCM), Entrée/Espace/→ pour continuer.
  // Alimenté par des refs pour rester branché sur l'état courant sans se ré-enregistrer.
  const selectChoiceRef = useRef<(id: string) => void>(() => {});
  const nextRef = useRef<() => void>(() => {});
  const questionRef = useRef<Question>();
  const revealedKbRef = useRef(revealed);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const q = questionRef.current;
      if (!q) return;
      if (!revealedKbRef.current) {
        if (q.inputType === 'multiple-choice' && q.choices) {
          const n = Number(e.key);
          if (Number.isInteger(n) && n >= 1 && n <= q.choices.length) {
            selectChoiceRef.current(q.choices[n - 1].id);
          }
        }
        return;
      }
      // Question révélée : passer à la suivante (sauf si un bouton a déjà le focus).
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
        if (document.activeElement?.tagName === 'BUTTON') return;
        e.preventDefault();
        nextRef.current();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!mode) return <Navigate to="/modes" replace />;

  const question = session[index];

  function submit(answer: Answer) {
    if (revealed) return;
    const result = checkAnswer(question, answer);
    if (question.subjectCode) recordAnswer(question.subjectCode, result.correct);
    setLastCorrect(result.correct);
    setDistanceKm(result.distanceKm);
    if (result.correct) {
      setScore((s) => s + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak((b) => Math.max(b, newStreak));
      if (soundOn) playCorrect();
      vibrate(30);
    } else {
      setStreak(0);
      if (soundOn) playWrong();
      vibrate([60, 40, 60]);
    }
    setHistory((h) => [
      ...h,
      {
        prompt: question.prompt,
        answerLabel: question.answerLabel,
        correct: result.correct,
        flag: question.flag,
        distanceKm: result.distanceKm,
      },
    ]);
    setRevealed(true);
  }

  function next() {
    if (index + 1 >= session.length) {
      const newlyUnlocked = recordGame({
        modeId: mode!.id,
        score,
        total: session.length,
        bestStreak,
        isDaily,
        dailyKey: isDaily ? dailyKey() : undefined,
      });
      if (soundOn) playFinish();
      navigate(`/results/${mode!.id}`, {
        state: {
          score,
          total: session.length,
          bestStreak,
          elapsedMs: Date.now() - startRef.current,
          history,
          newlyUnlocked,
        },
      });
      return;
    }
    setIndex((i) => i + 1);
    setRevealed(false);
    setLastCorrect(false);
    setSelectedChoiceId(undefined);
    setPicked(undefined);
    setPickedCode(undefined);
    setDistanceKm(undefined);
  }

  function selectChoice(id: string) {
    setSelectedChoiceId(id);
    submit({ kind: 'choice', choiceId: id });
  }

  // Branche les refs des raccourcis clavier sur les fonctions et l'état courants.
  selectChoiceRef.current = selectChoice;
  nextRef.current = next;
  questionRef.current = question;
  revealedKbRef.current = revealed;

  return (
    <div className="py-4">
      <ScoreBar
        current={index + 1}
        total={session.length}
        score={score}
        streak={streak}
        elapsedMs={now - startRef.current}
      />

      <div className="mb-6 flex flex-col items-center gap-4 text-center">
        {question.flag && <FlagImage code={question.flag} className="text-7xl" />}
        <h2 className="text-xl font-bold">{question.prompt}</h2>
      </div>

      {question.inputType === 'multiple-choice' && (
        <MultipleChoice
          choices={question.choices ?? []}
          selectedId={selectedChoiceId}
          correctId={question.correctChoiceId}
          revealed={revealed}
          onSelect={selectChoice}
        />
      )}

      {question.inputType === 'free-text' && (
        <FreeTextInput
          revealed={revealed}
          correct={lastCorrect}
          answerLabel={question.answerLabel}
          onSubmit={(value) => submit({ kind: 'text', value })}
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
              pickedCode={pickedCode}
              target={question.target}
              revealed={revealed}
              onPick={setPicked}
              onPickRegion={setPickedCode}
            />
          </Suspense>
          {question.target?.code != null ? (
            !revealed ? (
              <button
                type="button"
                disabled={!pickedCode}
                onClick={() => pickedCode && submit({ kind: 'region', code: pickedCode })}
                className="w-full rounded-xl bg-brand p-4 text-lg font-semibold transition hover:bg-brand-dark disabled:opacity-50"
              >
                {pickedCode ? t('game.validate') : t('game.selectCountry')}
              </button>
            ) : (
              <div
                className={`animate-pop rounded-xl p-4 text-center font-semibold ${
                  lastCorrect ? 'bg-emerald-500/20 text-emerald-200' : 'bg-rose-500/20 text-rose-200'
                }`}
              >
                {lastCorrect ? t('game.rightCountry') : t('game.wrongCountry')}{' '}
                {!lastCorrect && `${t('game.answer')} ${question.answerLabel}`}
              </div>
            )
          ) : !revealed ? (
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
          {index + 1 >= session.length ? t('game.seeResult') : t('game.next')}
        </button>
      )}
    </div>
  );
}
