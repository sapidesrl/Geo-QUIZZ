import type { Choice } from '../engine/types';
import FlagImage from './FlagImage';

interface Props {
  choices: Choice[];
  selectedId?: string;
  correctId?: string;
  revealed: boolean;
  onSelect: (id: string) => void;
}

export default function MultipleChoice({
  choices,
  selectedId,
  correctId,
  revealed,
  onSelect,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {choices.map((choice, i) => {
        const isCorrect = choice.id === correctId;
        const isSelected = choice.id === selectedId;
        // Choix « drapeau seul » (sans libellé) : drapeau agrandi et centré.
        const flagOnly = Boolean(choice.flag) && !choice.label;

        let state = 'border-slate-600 bg-slate-800 hover:border-brand hover:bg-slate-700';
        if (revealed && isCorrect) {
          state = 'border-emerald-500 bg-emerald-500/20 text-emerald-100';
        } else if (revealed && isSelected && !isCorrect) {
          state = 'border-rose-500 bg-rose-500/20 text-rose-100';
        } else if (revealed) {
          state = 'border-slate-700 bg-slate-800/50 opacity-60';
        }

        return (
          <button
            key={choice.id}
            type="button"
            disabled={revealed}
            onClick={() => onSelect(choice.id)}
            className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left text-base font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
              flagOnly ? 'justify-center' : ''
            } ${state}`}
          >
            {!revealed && (
              <span
                aria-hidden
                className="hidden h-6 w-6 shrink-0 items-center justify-center rounded border border-slate-600 text-xs text-slate-400 sm:flex"
              >
                {i + 1}
              </span>
            )}
            {choice.flag && (
              <FlagImage code={choice.flag} className={`shrink-0 ${flagOnly ? 'text-6xl' : 'text-3xl'}`} />
            )}
            {choice.label && <span>{choice.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
