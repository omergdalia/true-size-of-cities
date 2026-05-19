/**
 * CitySelector – searchable list of capital cities.  Clicking a city adds it
 * as an overlay on the map; clicking again removes it.
 */

import { useState } from 'react';
import { useMapStore } from '../../store/mapStore';
import { useCities } from '../../hooks/useGeoData';
import { CITY_COLORS } from '../Map/cityColors';
import type { CitySummary } from '../../types';

export default function CitySelector() {
  const [query, setQuery] = useState('');
  const { data: cities, isLoading, error } = useCities();
  const { overlaidCities, addCityOverlay, removeCityOverlay } = useMapStore();

  const overlaidIds = new Set(overlaidCities.map((c) => c.id));

  const filtered: CitySummary[] =
    cities?.filter(
      (c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.country.toLowerCase().includes(query.toLowerCase()),
    ) ?? [];

  const toggle = (city: CitySummary) => {
    if (overlaidIds.has(city.id)) {
      removeCityOverlay(city.id);
    } else {
      addCityOverlay(city);
    }
  };

  if (isLoading) return <p className="sidebar-loading">Loading cities…</p>;
  if (error) return <p className="sidebar-error">Failed to load cities.</p>;

  return (
    <div className="city-selector">
      <label htmlFor="city-search" className="sidebar-label">
        Add city overlay
      </label>
      <input
        id="city-search"
        type="search"
        className="sidebar-search"
        placeholder="Search cities…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <ul className="city-list" role="list">
        {filtered.map((city, _idx) => {
          const isActive = overlaidIds.has(city.id);
          const colorIdx = overlaidCities.findIndex((c) => c.id === city.id);
          const dotColor = isActive ? CITY_COLORS[colorIdx % CITY_COLORS.length] : 'transparent';

          return (
            <li key={city.id}>
              <button
                className={`city-list-item ${isActive ? 'city-list-item--active' : ''}`}
                onClick={() => toggle(city)}
                aria-pressed={isActive}
                title={`${city.name}, ${city.country} – ~${city.area_km2.toLocaleString()} km²`}
              >
                <span
                  className="city-list-dot"
                  style={{ background: dotColor, border: isActive ? 'none' : '1px solid #999' }}
                />
                <span className="city-list-name">{city.name}</span>
                <span className="city-list-country">{city.country}</span>
                <span className="city-list-area">{city.area_km2.toLocaleString()} km²</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
