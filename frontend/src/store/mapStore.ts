/**
 * Zustand store – tracks the currently highlighted country and the set of
 * capital-city overlays the user has pinned to the map.
 */

import { create } from 'zustand';
import type { CitySummary, CountrySummary } from '../types';

interface MapState {
  /** ISO-3166-1 alpha-2 code of the country to highlight, or null for none. */
  selectedCountryCode: string | null;
  selectedCountry: CountrySummary | null;

  /** Cities the user has chosen to overlay on the map. */
  overlaidCities: CitySummary[];

  setSelectedCountry: (country: CountrySummary | null) => void;
  addCityOverlay: (city: CitySummary) => void;
  removeCityOverlay: (cityId: string) => void;
  clearCityOverlays: () => void;
}

export const useMapStore = create<MapState>((set) => ({
  selectedCountryCode: null,
  selectedCountry: null,
  overlaidCities: [],

  setSelectedCountry: (country) =>
    set({ selectedCountry: country, selectedCountryCode: country?.code ?? null }),

  addCityOverlay: (city) =>
    set((state) => ({
      overlaidCities: state.overlaidCities.some((c) => c.id === city.id)
        ? state.overlaidCities
        : [...state.overlaidCities, city],
    })),

  removeCityOverlay: (cityId) =>
    set((state) => ({
      overlaidCities: state.overlaidCities.filter((c) => c.id !== cityId),
    })),

  clearCityOverlays: () => set({ overlaidCities: [] }),
}));
