/**
 * MapContainer – mounts a Mapbox GL JS map and orchestrates the country and
 * city overlay layers.  Pass VITE_MAPBOX_TOKEN in your .env file.
 */

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { useMapStore } from '../../store/mapStore';
import { useCountriesGeoJSON, useCitiesGeoJSON } from '../../hooks/useGeoData';

import { CITY_COLORS } from './cityColors';

// ── constants ──────────────────────────────────────────────────────────────

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

const DEFAULT_CENTER: [number, number] = [0, 20];
const DEFAULT_ZOOM = 2;

// ── component ──────────────────────────────────────────────────────────────

export default function MapContainer() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const initialized = useRef(false);

  const { selectedCountryCode, overlaidCities } = useMapStore();

  const cityIds = overlaidCities.map((c) => c.id);
  const { data: countriesGeoJSON } = useCountriesGeoJSON();
  const { data: citiesGeoJSON } = useCitiesGeoJSON(cityIds);

  // ── initialise map ────────────────────────────────────────────────────────
  useEffect(() => {
    if (initialized.current || !mapContainer.current) return;
    initialized.current = true;

    if (!MAPBOX_TOKEN) {
      console.warn(
        '[TrueSizeOfCities] Set VITE_MAPBOX_TOKEN in frontend/.env to enable the map.',
      );
    }

    mapboxgl.accessToken = MAPBOX_TOKEN ?? '';

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      attributionControl: true,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

    map.on('load', () => {
      // Country fill + outline layers
      map.addSource('countries', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });
      map.addLayer({
        id: 'countries-fill',
        type: 'fill',
        source: 'countries',
        paint: {
          'fill-color': [
            'case',
            ['==', ['get', 'code'], selectedCountryCode ?? ''],
            '#4f86c6',
            '#c8d9ef',
          ],
          'fill-opacity': 0.4,
        },
      });
      map.addLayer({
        id: 'countries-outline',
        type: 'line',
        source: 'countries',
        paint: { 'line-color': '#2a5599', 'line-width': 1 },
      });

      // City overlay layers (fill + outline)
      map.addSource('city-overlays', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });
      map.addLayer({
        id: 'city-overlays-fill',
        type: 'fill',
        source: 'city-overlays',
        paint: {
          'fill-color': ['get', 'mapColor'],
          'fill-opacity': 0.55,
        },
      });
      map.addLayer({
        id: 'city-overlays-outline',
        type: 'line',
        source: 'city-overlays',
        paint: {
          'line-color': ['get', 'mapColor'],
          'line-width': 2,
        },
      });

      // City label layer
      map.addLayer({
        id: 'city-overlays-label',
        type: 'symbol',
        source: 'city-overlays',
        layout: {
          'text-field': ['get', 'name'],
          'text-size': 13,
          'text-anchor': 'center',
        },
        paint: {
          'text-color': '#1a1a1a',
          'text-halo-color': '#ffffff',
          'text-halo-width': 2,
        },
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      initialized.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── update country source & highlight ─────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const source = map.getSource('countries') as mapboxgl.GeoJSONSource | undefined;
    if (!source) return;

    if (countriesGeoJSON) {
      source.setData(countriesGeoJSON as GeoJSON.FeatureCollection);
    }

    map.setPaintProperty('countries-fill', 'fill-color', [
      'case',
      ['==', ['get', 'code'], selectedCountryCode ?? ''],
      '#4f86c6',
      '#c8d9ef',
    ]);

    // Fly to selected country
    if (selectedCountryCode && countriesGeoJSON) {
      const feature = countriesGeoJSON.features.find(
        (f) => f.properties?.code === selectedCountryCode,
      );
      if (feature && feature.geometry?.type === 'Polygon') {
        const coords = (feature.geometry as GeoJSON.Polygon).coordinates[0];
        const lons = coords.map((c) => c[0]);
        const lats = coords.map((c) => c[1]);
        const bounds: mapboxgl.LngLatBoundsLike = [
          [Math.min(...lons), Math.min(...lats)],
          [Math.max(...lons), Math.max(...lats)],
        ];
        map.fitBounds(bounds, { padding: 60, maxZoom: 6, duration: 800 });
      }
    }
  }, [countriesGeoJSON, selectedCountryCode]);

  // ── update city overlay source ─────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const source = map.getSource('city-overlays') as mapboxgl.GeoJSONSource | undefined;
    if (!source) return;

    if (!citiesGeoJSON) {
      source.setData({ type: 'FeatureCollection', features: [] });
      return;
    }

    // Attach a colour to each city feature for the map expressions
    const coloredFeatures = citiesGeoJSON.features.map((f, idx) => ({
      ...f,
      properties: {
        ...f.properties,
        mapColor: CITY_COLORS[idx % CITY_COLORS.length],
      },
    }));

    source.setData({
      ...citiesGeoJSON,
      features: coloredFeatures,
    } as GeoJSON.FeatureCollection);
  }, [citiesGeoJSON]);

  return (
    <div
      ref={mapContainer}
      style={{ width: '100%', height: '100%' }}
      aria-label="Map"
    />
  );
}
