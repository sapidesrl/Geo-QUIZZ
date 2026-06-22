import { HashRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import ModeSelect from './pages/ModeSelect';
import Game from './pages/Game';
import Results from './pages/Results';
import Stats from './pages/Stats';

export default function App() {
  return (
    <HashRouter>
      <div className="mx-auto flex min-h-full max-w-2xl flex-col px-4 pb-8 pt-[max(1rem,env(safe-area-inset-top))]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/modes" element={<ModeSelect />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/game/:modeId" element={<Game />} />
          <Route path="/results/:modeId" element={<Results />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
