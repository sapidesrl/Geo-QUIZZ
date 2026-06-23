import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  revealed: boolean;
  correct?: boolean;
  answerLabel: string;
  onSubmit: (value: string) => void;
}

export default function FreeTextInput({ revealed, correct, answerLabel, onSubmit }: Props) {
  const { t } = useTranslation();
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revealed && value.trim()) onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        disabled={revealed}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t('game.yourAnswer')}
        className="w-full rounded-xl border-2 border-slate-600 bg-slate-800 p-4 text-lg outline-none focus:border-brand disabled:opacity-70"
      />

      {revealed ? (
        <div
          className={`rounded-xl p-4 text-center font-semibold ${
            correct ? 'bg-emerald-500/20 text-emerald-200' : 'bg-rose-500/20 text-rose-200'
          }`}
        >
          {correct ? t('game.correct') : t('game.wrong')} {t('game.answer')}{' '}
          <strong>{answerLabel}</strong>
        </div>
      ) : (
        <button
          type="submit"
          disabled={!value.trim()}
          className="w-full rounded-xl bg-brand p-4 text-lg font-semibold transition hover:bg-brand-dark disabled:opacity-50"
        >
          {t('game.validate')}
        </button>
      )}
    </form>
  );
}
