import maplibregl from 'maplibre-gl';
import { useEffect, useRef } from 'react';
import { ccn3ByCca2 } from '../data/countries';
import type { ReviewStats } from '../lib/review';
import { offlineWorldStyle } from '../lib/worldStyle';

/**
 * Carte du monde colorée selon la maîtrise par pays (boîtes de Leitner), via
 * `feature-state` sur la géométrie embarquée — même mécanisme que le surlignage
 * du mode « situer un pays ». Vert = maîtrisé, jaune = en cours, rouge = à revoir,
 * couleur de base = jamais vu.
 */
export default function MasteryMap({ stats }: { stats: ReviewStats }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef(stats);
  statsRef.current = stats;

  useEffect(() => {
    if (!containerRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: offlineWorldStyle,
      center: [10, 25],
      zoom: 1,
      attributionControl: false,
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    map.on('load', () => {
      map.addLayer(
        {
          id: 'mastery',
          type: 'fill',
          source: 'countries',
          paint: {
            'fill-color': [
              'case',
              ['>=', ['coalesce', ['feature-state', 'box'], -1], 5],
              '#10b981',
              ['>=', ['coalesce', ['feature-state', 'box'], -1], 2],
              '#eab308',
              ['>=', ['coalesce', ['feature-state', 'box'], -1], 0],
              '#ef4444',
              'rgba(0,0,0,0)',
            ],
            'fill-opacity': 0.8,
          },
        },
        'borders',
      );
      for (const [cca2, s] of Object.entries(statsRef.current)) {
        const id = ccn3ByCca2.get(cca2);
        if (id != null) map.setFeatureState({ source: 'countries', id }, { box: s.box });
      }
    });

    return () => map.remove();
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-[60vh] min-h-[360px] w-full overflow-hidden rounded-xl ring-1 ring-slate-600"
    />
  );
}
