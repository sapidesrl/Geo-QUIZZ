import type { City } from '../engine/types';

/**
 * Les 16 villes hôtes de la Coupe du monde de la FIFA 2026 (États-Unis, Canada,
 * Mexique), confirmées par la FIFA. Coordonnées de l'aire urbaine.
 */
export const hostCities2026: City[] = [
  // États-Unis (11)
  { name: 'Atlanta', country: 'États-Unis', lat: 33.749, lng: -84.388 },
  { name: 'Boston', country: 'États-Unis', lat: 42.3601, lng: -71.0589 },
  { name: 'Dallas', country: 'États-Unis', lat: 32.7767, lng: -96.797 },
  { name: 'Houston', country: 'États-Unis', lat: 29.7604, lng: -95.3698 },
  { name: 'Kansas City', country: 'États-Unis', lat: 39.0997, lng: -94.5786 },
  { name: 'Los Angeles', country: 'États-Unis', lat: 34.0522, lng: -118.2437 },
  { name: 'Miami', country: 'États-Unis', lat: 25.7617, lng: -80.1918 },
  { name: 'New York / New Jersey', country: 'États-Unis', lat: 40.8135, lng: -74.0745 },
  { name: 'Philadelphie', country: 'États-Unis', lat: 39.9526, lng: -75.1652 },
  { name: 'San Francisco', country: 'États-Unis', lat: 37.403, lng: -121.9698 },
  { name: 'Seattle', country: 'États-Unis', lat: 47.6062, lng: -122.3321 },
  // Canada (2)
  { name: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832 },
  { name: 'Vancouver', country: 'Canada', lat: 49.2827, lng: -123.1207 },
  // Mexique (3)
  { name: 'Mexico', country: 'Mexique', lat: 19.4326, lng: -99.1332 },
  { name: 'Guadalajara', country: 'Mexique', lat: 20.6597, lng: -103.3496 },
  { name: 'Monterrey', country: 'Mexique', lat: 25.6866, lng: -100.3161 },
];
