import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import MatchGame from '../components/MatchGame';
import { worldCupGroups } from '../data/worldcup-groups';

/** Association des 12 groupes officiels de la Coupe du monde 2026. */
export default function WorldCupMatch() {
  const { t } = useTranslation();
  const groups = useMemo(
    () => worldCupGroups.map((g) => ({ id: g.id, codes: g.teams })),
    [],
  );
  return (
    <MatchGame
      groups={groups}
      recordModeId="worldcup-match"
      backTo="/modes"
      backLabel={t('nav.modes')}
      resultIcon="⚽"
    />
  );
}
