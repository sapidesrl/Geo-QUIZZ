interface Props {
  code: string;
  className?: string;
}

/** Affiche un drapeau (paquet flag-icons). La taille suit la `font-size` (text-*). */
export default function FlagImage({ code, className = '' }: Props) {
  return (
    <span
      className={`fi fi-${code} rounded shadow-md ring-1 ring-white/10 ${className}`}
      role="img"
      aria-label={`Drapeau ${code.toUpperCase()}`}
    />
  );
}
