/** React-Query hooks for fetching geographic data. */

import { useQuery } from '@tanstack/react-query';
import { fetchCities, fetchCitiesGeoJSON, fetchCountries, fetchCountriesGeoJSON } from '../api';

export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountries,
    staleTime: Infinity, // static data – never re-fetch
  });
}

export function useCountriesGeoJSON() {
  return useQuery({
    queryKey: ['countries', 'geojson'],
    queryFn: fetchCountriesGeoJSON,
    staleTime: Infinity,
  });
}

export function useCities(countryCode?: string) {
  return useQuery({
    queryKey: ['cities', countryCode ?? 'all'],
    queryFn: () => fetchCities(countryCode),
    staleTime: Infinity,
  });
}

export function useCitiesGeoJSON(cityIds?: string[]) {
  // Re-fetch the full collection; the map component will filter by active IDs.
  return useQuery({
    queryKey: ['cities', 'geojson'],
    queryFn: () => fetchCitiesGeoJSON(),
    staleTime: Infinity,
    select: (data) => {
      if (!cityIds || cityIds.length === 0) return { ...data, features: [] };
      return {
        ...data,
        features: data.features.filter((f) =>
          cityIds.includes(f.properties.id as string),
        ),
      };
    },
  });
}
