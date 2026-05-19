/** Sidebar – the left-hand panel containing country + city controls. */

import CountrySelector from './CountrySelector';
import CitySelector from './CitySelector';
import SelectedCities from './SelectedCities';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <header className="sidebar-header">
        <h1 className="sidebar-title">True Size of Cities</h1>
        <p className="sidebar-subtitle">
          Compare capital city footprints against any country
        </p>
      </header>

      <section className="sidebar-section">
        <CountrySelector />
      </section>

      <section className="sidebar-section">
        <SelectedCities />
      </section>

      <section className="sidebar-section sidebar-section--grow">
        <CitySelector />
      </section>
    </aside>
  );
}
