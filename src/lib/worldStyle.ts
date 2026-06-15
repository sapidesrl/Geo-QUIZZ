import type { StyleSpecification } from 'maplibre-gl';
import { feature } from 'topojson-client';
import type { Topology } from 'topojson-specification';
// Géométrie mondiale embarquée (Natural Earth 110m, ~100 Ko) → carte 100 % hors-ligne,
// sans serveur de tuiles.
import topology from 'world-atlas/countries-110m.json';

const countriesGeo = feature(
  topology as unknown as Topology,
  (topology as unknown as Topology).objects.countries,
);

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
