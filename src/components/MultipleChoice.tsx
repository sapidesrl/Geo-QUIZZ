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
      {choices.map((choice) => {
        const isCorrect = choice.id === correctId;
        const isSelected = choice.id === selectedId;

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
            className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left text-base font-medium transition ${state}`}
          >
            {choice.flag && <FlagImage code={choice.flag} className="text-3xl shrink-0" />}
            <span>{choice.label}</span>
          </button>
        );
      })}
    </div>
  );
}
