import type { StyleSpecification } from 'maplibre-gl';
import { feature } from 'topojson-client';
import type { Topology } from 'topojson-specification';
// Géométrie mondiale embarquée (Natural Earth 50m) → carte 100 % hors-ligne, sans
// serveur de tuiles. Le 50m offre des frontières plus précises que le 110m pour
// un placement plus juste (chargé à la demande avec MapLibre).
import topology from 'world-atlas/countries-50m.json';

const countriesGeo = feature(
  topology as unknown as Topology,
  (topology as unknown as Topology).objects.countries,
) as GeoJSON.FeatureCollection;

// Les polygones portent un identifiant ISO numérique (ex. "250"). On le normalise
// en nombre pour que `feature-state` et `queryRenderedFeatures` (surlignage et
// résolution du pays cliqué en mode « situer un pays ») soient cohérents.
for (const f of countriesGeo.features) {
  if (f.id != null) f.id = Number(f.id);
}

/** Fond de carte vectoriel hors-ligne : océan + pays + frontières. */
export const offlineWorldStyle: StyleSpecification = {
  version: 8,
  sources: {
    countries: {
      type: 'geojson',
      data: countriesGeo as GeoJSON.GeoJSON,
    },
  },
  layers: [
    { id: 'ocean', type: 'background', paint: { 'background-color': '#0b2239' } },
    { id: 'land', type: 'fill', source: 'countries', paint: { 'fill-color': '#274b66' } },
    {
      id: 'borders',
      type: 'line',
      source: 'countries',
      paint: { 'line-color': '#4a7493', 'line-width': 0.6 },
    },
  ],
};
