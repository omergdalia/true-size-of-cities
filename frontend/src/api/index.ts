/** API client – thin wrappers around fetch talking to the FastAPI backend. */

import type { CitySummary, CountrySummary, GeoJSONFeature, GeoJSONFeatureCollection } from '../types';

const BASE = '/api/v1';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

// ── Countries ──────────────────────────────────────────────────────────────

export const fetchCountries = (): Promise<CountrySummary[]> =>
  get('/countries');

export const fetchCountriesGeoJSON = (): Promise<GeoJSONFeatureCollection> =>
  get('/countries/geojson');

export const fetchCountry = (code: string): Promise<GeoJSONFeature> =>
  get(`/countries/${code}`);

// ── Cities ─────────────────────────────────────────────────────────────────

export const fetchCities = (countryCode?: string): Promise<CitySummary[]> =>
  get(`/cities${countryCode ? `?country_code=${countryCode}` : ''}`);

export const fetchCitiesGeoJSON = (countryCode?: string): Promise<GeoJSONFeatureCollection> =>
  get(`/cities/geojson${countryCode ? `?country_code=${countryCode}` : ''}`);

export const fetchCity = (cityId: string): Promise<GeoJSONFeature> =>
  get(`/cities/${cityId}`);
