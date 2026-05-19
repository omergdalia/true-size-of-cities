/** Shared TypeScript types for the True Size of Cities app. */

// ── GeoJSON ────────────────────────────────────────────────────────────────

export interface GeoJSONGeometry {
  type: string;
  coordinates: unknown;
}

export interface GeoJSONFeature<P = Record<string, unknown>> {
  type: 'Feature';
  id?: string | null;
  properties: P;
  geometry: GeoJSONGeometry;
}

export interface GeoJSONFeatureCollection<P = Record<string, unknown>> {
  type: 'FeatureCollection';
  name?: string;
  features: GeoJSONFeature<P>[];
}

// ── Domain models ──────────────────────────────────────────────────────────

export interface CountrySummary {
  code: string;
  name: string;
  capital: string;
}

export interface CitySummary {
  id: string;
  name: string;
  country: string;
  country_code: string;
  lat: number;
  lon: number;
  urban_radius_km: number;
  area_km2: number;
}

export interface CityProperties extends CitySummary {}

export interface CountryProperties extends CountrySummary {}
