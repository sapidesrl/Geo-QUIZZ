import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <div className="mb-6 text-7xl">🌍</div>
      <h1 className="mb-3 text-4xl font-extrabold tracking-tight">Geo-QUIZZ</h1>
      <p className="mb-10 max-w-sm text-slate-300">
        Teste ta géographie : capitales, drapeaux et localisation sur la carte du monde.
      </p>
      <Link
        to="/modes"
        className="rounded-xl bg-brand px-10 py-4 text-lg font-semibold shadow-lg transition hover:bg-brand-dark"
      >
        Jouer
      </Link>
    </div>
  );
}
