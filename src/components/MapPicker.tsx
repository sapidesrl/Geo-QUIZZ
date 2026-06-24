import maplibregl from 'maplibre-gl';
import { useEffect, useRef } from 'react';
import { cca2ByCcn3, ccn3ByCca2 } from '../data/countries';
import type { MapTarget } from '../engine/types';
import { offlineWorldStyle } from '../lib/worldStyle';

interface Props {
  picked?: { lat: number; lng: number };
  /** Mode « sélection de polygone » : code cca2 du pays désigné par le joueur. */
  pickedCode?: string;
  target?: MapTarget;
  revealed: boolean;
  onPick: (p: { lat: number; lng: number }) => void;
  /** Mode « sélection de polygone » : appelé avec le cca2 du pays cliqué. */
  onPickRegion?: (code: string) => void;
}

function makeMarker(color: string): HTMLDivElement {
  const el = document.createElement('div');
  el.style.cssText = `width:18px;height:18px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 0 0 1px rgba(0,0,0,.4);`;
  return el;
}

/** Résout un code (cca2 ou repli `#<ccn3>`) en identifiant numérique de polygone. */
function codeToFeatureId(code: string | undefined): number | undefined {
  if (!code) return undefined;
  if (code.startsWith('#')) {
    const n = Number(code.slice(1));
    return Number.isFinite(n) ? n : undefined;
  }
  return ccn3ByCca2.get(code);
}

export default function MapPicker({
  picked,
  pickedCode,
  target,
  revealed,
  onPick,
  onPickRegion,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map>();
  const loadedRef = useRef(false);
  const pickedMarkerRef = useRef<maplibregl.Marker>();
  const targetMarkerRef = useRef<maplibregl.Marker>();
  const highlightedRef = useRef<Set<number>>(new Set());
  const selectedIdRef = useRef<number>();

  const onPickRef = useRef(onPick);
  const onPickRegionRef = useRef(onPickRegion);
  const revealedRef = useRef(revealed);
  const targetRef = useRef(target);
  const pickedCodeRef = useRef(pickedCode);
  onPickRef.current = onPick;
  onPickRegionRef.current = onPickRegion;
  revealedRef.current = revealed;
  targetRef.current = target;
  pickedCodeRef.current = pickedCode;

  function clearHighlights(map: maplibregl.Map) {
    for (const id of highlightedRef.current) {
      map.setFeatureState({ source: 'countries', id }, { hl: null });
    }
    highlightedRef.current.clear();
    selectedIdRef.current = undefined;
  }

  function setHighlight(map: maplibregl.Map, id: number, value: string) {
    map.setFeatureState({ source: 'countries', id }, { hl: value });
    highlightedRef.current.add(id);
  }

  // Initialisation de la carte (une seule fois).
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
      // Couche de surlignage des pays (mode « situer un pays »), pilotée par
      // feature-state : bleu = sélection, vert = bonne réponse, rouge = erreur.
      map.addLayer(
        {
          id: 'highlight',
          type: 'fill',
          source: 'countries',
          paint: {
            'fill-color': [
              'match',
              ['feature-state', 'hl'],
              'correct',
              '#10b981',
              'wrong',
              '#ef4444',
              'selected',
              '#3b82f6',
              'rgba(0,0,0,0)',
            ],
            'fill-opacity': 0.75,
          },
        },
        'borders',
      );
      loadedRef.current = true;
    });

    map.on('click', (e) => {
      if (revealedRef.current) return;
      // Mode « sélection de polygone » : on résout le pays cliqué.
      if (targetRef.current?.code != null) {
        const feats = map.queryRenderedFeatures(e.point, { layers: ['land'] });
        const f = feats[0];
        if (!f || f.id == null) return;
        const id = Number(f.id);
        if (selectedIdRef.current != null) {
          map.setFeatureState({ source: 'countries', id: selectedIdRef.current }, { hl: null });
          highlightedRef.current.delete(selectedIdRef.current);
        }
        setHighlight(map, id, 'selected');
        selectedIdRef.current = id;
        onPickRegionRef.current?.(cca2ByCcn3.get(id) ?? `#${id}`);
        return;
      }
      // Mode « placement au repère » : on remonte les coordonnées.
      onPickRef.current({ lat: e.lngLat.lat, lng: e.lngLat.lng });
    });

    mapRef.current = map;
    return () => map.remove();
  }, []);

  // Marqueur du choix du joueur (mode repère uniquement).
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!picked) {
      pickedMarkerRef.current?.remove();
      pickedMarkerRef.current = undefined;
      return;
    }
    if (!pickedMarkerRef.current) {
      pickedMarkerRef.current = new maplibregl.Marker({ element: makeMarker('#2563eb') });
    }
    pickedMarkerRef.current.setLngLat([picked.lng, picked.lat]).addTo(map);
  }, [picked]);

  // Nouvelle question : on efface les surlignages précédents.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loadedRef.current) return;
    clearHighlights(map);
  }, [target]);

  // À la révélation, mode repère : marqueur cible + cadrage sur les deux points.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!revealed || !target || target.code != null) {
      targetMarkerRef.current?.remove();
      targetMarkerRef.current = undefined;
      return;
    }

    if (!targetMarkerRef.current) {
      targetMarkerRef.current = new maplibregl.Marker({ element: makeMarker('#10b981') });
    }
    targetMarkerRef.current
      .setLngLat([target.lng, target.lat])
      .setPopup(new maplibregl.Popup({ offset: 16 }).setText(target.label))
      .addTo(map)
      .togglePopup();

    if (picked) {
      const bounds = new maplibregl.LngLatBounds()
        .extend([picked.lng, picked.lat])
        .extend([target.lng, target.lat]);
      map.fitBounds(bounds, { padding: 80, maxZoom: 6, duration: 600 });
    } else {
      map.flyTo({ center: [target.lng, target.lat], zoom: 4 });
    }
  }, [revealed, target, picked]);

  // À la révélation, mode polygone : surligne le bon pays (et l'erreur éventuelle).
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loadedRef.current) return;
    const t = targetRef.current;
    if (!revealed || t?.code == null) return;

    clearHighlights(map);
    const code = pickedCodeRef.current;
    if (code && code !== t.code) {
      const wrongId = codeToFeatureId(code);
      if (wrongId != null) setHighlight(map, wrongId, 'wrong');
    }
    const correctId = ccn3ByCca2.get(t.code);
    if (correctId != null) setHighlight(map, correctId, 'correct');

    map.flyTo({ center: [t.lng, t.lat], zoom: 3, duration: 600 });
  }, [revealed]);

  return (
    <div
      ref={containerRef}
      className="h-[55vh] min-h-[320px] w-full overflow-hidden rounded-xl ring-1 ring-slate-600"
    />
  );
}
