import { HashRouter, Route, Routes } from 'react-router-dom';
import Campaign from './pages/Campaign';
import CampaignChapter from './pages/CampaignChapter';
import CampaignLevel from './pages/CampaignLevel';
import ContinentMatch from './pages/ContinentMatch';
import Game from './pages/Game';
import Home from './pages/Home';
import ModeSelect from './pages/ModeSelect';
import Results from './pages/Results';
import Stats from './pages/Stats';
import WorldCupMatch from './pages/WorldCupMatch';

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
          <Route path="/campaign" element={<Campaign />} />
          <Route path="/campaign/:chapterId" element={<CampaignChapter />} />
          <Route path="/campaign/:chapterId/match" element={<ContinentMatch />} />
          <Route path="/campaign/:chapterId/:levelIndex" element={<CampaignLevel />} />
          <Route path="/worldcup-match" element={<WorldCupMatch />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
