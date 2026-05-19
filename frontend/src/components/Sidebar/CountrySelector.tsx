/** CountrySelector – dropdown to choose the base country to highlight. */

import { useMapStore } from '../../store/mapStore';
import { useCountries } from '../../hooks/useGeoData';

export default function CountrySelector() {
  const { data: countries, isLoading, error } = useCountries();
  const { selectedCountry, setSelectedCountry } = useMapStore();

  if (isLoading) return <p className="sidebar-loading">Loading countries…</p>;
  if (error) return <p className="sidebar-error">Failed to load countries.</p>;

  return (
    <div className="country-selector">
      <label htmlFor="country-select" className="sidebar-label">
        Base country
      </label>
      <select
        id="country-select"
        className="sidebar-select"
        value={selectedCountry?.code ?? ''}
        onChange={(e) => {
          const code = e.target.value;
          const country = countries?.find((c) => c.code === code) ?? null;
          setSelectedCountry(country);
        }}
      >
        <option value="">— choose a country —</option>
        {countries?.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
