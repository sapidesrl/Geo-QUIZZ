import { useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import FlagImage from '../components/FlagImage';
import FreeTextInput from '../components/FreeTextInput';
import MapPicker from '../components/MapPicker';
import MultipleChoice from '../components/MultipleChoice';
import ScoreBar from '../components/ScoreBar';
import { checkAnswer } from '../engine/check';
import type { Answer, Question } from '../engine/types';
import { getModeById } from '../modes';
import { useGameStore } from '../store/useGameStore';

export default function Game() {
  const { modeId } = useParams();
  const navigate = useNavigate();
  const mode = getModeById(modeId);
  const questionsPerGame = useGameStore((s) => s.questionsPerGame);
  const recordScore = useGameStore((s) => s.recordScore);

  const session = useMemo<Question[]>(
    () => (mode ? Array.from({ length: questionsPerGame }, () => mode.generate()) : []),
    [mode, questionsPerGame],
  );

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string>();
  const [picked, setPicked] = useState<{ lat: number; lng: number }>();
  const [distanceKm, setDistanceKm] = useState<number>();

  if (!mode) return <Navigate to="/modes" replace />;

  const question = session[index];

  function submit(answer: Answer) {
    if (revealed) return;
    const result = checkAnswer(question, answer);
    setLastCorrect(result.correct);
    setDistanceKm(result.distanceKm);
    if (result.correct) setScore((s) => s + 1);
    setRevealed(true);
  }

  function next() {
    if (index + 1 >= session.length) {
      recordScore(mode!.id, score);
      navigate(`/results/${mode!.id}`, { state: { score, total: session.length } });
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
      <ScoreBar current={index + 1} total={session.length} score={score} />

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
          <MapPicker
            picked={picked}
            target={question.target}
            revealed={revealed}
            onPick={setPicked}
          />
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
              className={`rounded-xl p-4 text-center font-semibold ${
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
          className="mt-6 w-full rounded-xl bg-slate-200 p-4 text-lg font-semibold text-slate-900 transition hover:bg-white"
        >
          {index + 1 >= session.length ? 'Voir le résultat' : 'Question suivante →'}
        </button>
      )}
    </div>
  );
}
