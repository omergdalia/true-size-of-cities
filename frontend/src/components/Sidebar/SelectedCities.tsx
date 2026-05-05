/** SelectedCities – shows the active city overlays with remove buttons. */

import { useMapStore } from '../../store/mapStore';
import { CITY_COLORS } from '../Map/cityColors';

export default function SelectedCities() {
  const { overlaidCities, removeCityOverlay, clearCityOverlays } = useMapStore();

  if (overlaidCities.length === 0) return null;

  return (
    <div className="selected-cities">
      <div className="selected-cities-header">
        <span className="sidebar-label">Active overlays</span>
        <button className="clear-btn" onClick={clearCityOverlays} title="Remove all overlays">
          Clear all
        </button>
      </div>
      <ul className="selected-city-list" role="list">
        {overlaidCities.map((city, idx) => (
          <li key={city.id} className="selected-city-item">
            <span
              className="city-list-dot"
              style={{ background: CITY_COLORS[idx % CITY_COLORS.length] }}
            />
            <span className="selected-city-name">
              {city.name}
              <small> ({city.country})</small>
            </span>
            <span className="selected-city-area">{city.area_km2.toLocaleString()} km²</span>
            <button
              className="remove-btn"
              onClick={() => removeCityOverlay(city.id)}
              aria-label={`Remove ${city.name}`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
