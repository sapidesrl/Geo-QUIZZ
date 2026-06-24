import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router-dom';
import MatchGame from '../components/MatchGame';
import { continentMatchGroups, getChapterById } from '../data/campaign';

/** Association par continent : relier chaque pays d'un chapitre à son drapeau et sa capitale. */
export default function ContinentMatch() {
  const { t } = useTranslation();
  const { chapterId } = useParams();
  const chapter = getChapterById(chapterId);
  const groups = useMemo(() => (chapter ? continentMatchGroups(chapter.region) : []), [chapter]);

  if (!chapter) return <Navigate to="/campaign" replace />;

  return (
    <MatchGame
      groups={groups}
      recordModeId={`match-${chapter.id}`}
      backTo={`/campaign/${chapter.id}`}
      backLabel={t('campaign.backToChapter')}
      resultIcon={chapter.icon}
    />
  );
}
