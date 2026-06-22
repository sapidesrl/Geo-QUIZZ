import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import FlagImage from '../components/FlagImage';
import FreeTextInput from '../components/FreeTextInput';
import MultipleChoice from '../components/MultipleChoice';
import ScoreBar from '../components/ScoreBar';
import { checkAnswer } from '../engine/check';
import { defaultGenerateOptions } from '../engine/generate';
import { buildGenerateOptions } from '../engine/pool';
import type { Answer, Question, QuestionRecap } from '../engine/types';
import { dailyKey, dailySeed, withSeed } from '../lib/rng';
import { playCorrect, playFinish, playWrong } from '../lib/sound';
import { getModeById } from '../modes';
import { useGameStore } from '../store/useGameStore';

/** Nombre de questions du défi du jour (fixe, identique pour tous). */
const DAILY_QUESTIONS = 10;

// Chargé à la demande : MapLibre + géométrie monde ne pèsent sur le bundle
// que pour les modes carte.
const MapPicker = lazy(() => import('../components/MapPicker'));

export default function Game() {
  const { modeId } = useParams();
  const navigate = useNavigate();
  const mode = getModeById(modeId);
  const questionsPerGame = useGameStore((s) => s.questionsPerGame);
  const continent = useGameStore((s) => s.continent);
  const difficulty = useGameStore((s) => s.difficulty);
  const soundOn = useGameStore((s) => s.soundOn);
  const recordGame = useGameStore((s) => s.recordGame);

  const isDaily = mode?.id === 'daily';

  const session = useMemo<Question[]>(() => {
    if (!mode) return [];
    // Défi du jour : tirage déterministe (même quiz pour tous), filtres ignorés.
    if (isDaily) {
      return withSeed(dailySeed(), () =>
        Array.from({ length: DAILY_QUESTIONS }, () => mode.generate(defaultGenerateOptions)),
      );
    }
    const opts = buildGenerateOptions(continent, difficulty);
    return Array.from({ length: questionsPerGame }, () => mode.generate(opts));
  }, [mode, isDaily, questionsPerGame, continent, difficulty]);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string>();
  const [picked, setPicked] = useState<{ lat: number; lng: number }>();
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

  if (!mode) return <Navigate to="/modes" replace />;

  const question = session[index];

  function submit(answer: Answer) {
    if (revealed) return;
    const result = checkAnswer(question, answer);
    setLastCorrect(result.correct);
    setDistanceKm(result.distanceKm);
    if (result.correct) {
      setScore((s) => s + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak((b) => Math.max(b, newStreak));
      if (soundOn) playCorrect();
    } else {
      setStreak(0);
      if (soundOn) playWrong();
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
    setDistanceKm(undefined);
  }

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
          onSelect={(id) => {
            setSelectedChoiceId(id);
            submit({ kind: 'choice', choiceId: id });
          }}
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
                Chargement de la carte…
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
              {picked ? 'Valider' : 'Touche la carte pour placer ton repère'}
            </button>
          ) : (
            <div
              className={`animate-pop rounded-xl p-4 text-center font-semibold ${
                lastCorrect ? 'bg-emerald-500/20 text-emerald-200' : 'bg-rose-500/20 text-rose-200'
              }`}
            >
              {lastCorrect ? '✅ Bien situé !' : '❌ Trop loin.'}{' '}
              {distanceKm != null && <>À {Math.round(distanceKm)} km de la cible.</>}
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
          {index + 1 >= session.length ? 'Voir le résultat' : 'Question suivante →'}
        </button>
      )}
    </div>
  );
}
