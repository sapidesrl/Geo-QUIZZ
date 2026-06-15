import maplibregl, { type StyleSpecification } from 'maplibre-gl';
import { useEffect, useRef } from 'react';
import type { MapTarget } from '../engine/types';

interface Props {
  picked?: { lat: number; lng: number };
  target?: MapTarget;
  revealed: boolean;
  onPick: (p: { lat: number; lng: number }) => void;
}

// Fond de carte raster OpenStreetMap (sans clé). Un fond vectoriel hors-ligne
// complet est une amélioration ultérieure (cf. plan).
const OSM_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap',
    },
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
};

function makeMarker(color: string): HTMLDivElement {
  const el = document.createElement('div');
  el.style.cssText = `width:18px;height:18px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 0 0 1px rgba(0,0,0,.4);`;
  return el;
}

export default function MapPicker({ picked, target, revealed, onPick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map>();
  const pickedMarkerRef = useRef<maplibregl.Marker>();
  const targetMarkerRef = useRef<maplibregl.Marker>();
  const onPickRef = useRef(onPick);
  const revealedRef = useRef(revealed);
  onPickRef.current = onPick;
  revealedRef.current = revealed;

  // Initialisation de la carte (une seule fois).
  useEffect(() => {
    if (!containerRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: OSM_STYLE,
      center: [10, 25],
      zoom: 1,
      attributionControl: { compact: true },
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    map.on('click', (e) => {
      if (revealedRef.current) return;
      onPickRef.current({ lat: e.lngLat.lat, lng: e.lngLat.lng });
    });
    mapRef.current = map;
    return () => map.remove();
  }, []);

  // Marqueur du choix du joueur.
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

  // À la révélation : marqueur cible + cadrage sur les deux points.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!revealed || !target) {
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

  return (
    <div
      ref={containerRef}
      className="h-[55vh] min-h-[320px] w-full overflow-hidden rounded-xl ring-1 ring-slate-600"
    />
  );
}
