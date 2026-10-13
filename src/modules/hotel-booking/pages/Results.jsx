import { useState, useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import Hero from '../components/common/Hero';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import MemberToggle from '../components/booking/MemberToggle';
import HotelCard from '../components/hotel/HotelCard';
import HOTELS from '../data/hotels';
import { routes } from '../config/routes';
import { formatINR } from '../lib/format';
import './Results.css';

const AMENITY_OPTS = ['Kids Zone', 'Park', 'Pool', 'Spa', 'Banquet', 'Gym'];
const SORTS = [
  { key: 'recommended', label: 'Recommended' },
  { key: 'price-low', label: 'Price: Low to High' },
  { key: 'price-high', label: 'Price: High to Low' },
  { key: 'stars', label: 'Star rating' }
];

export default function Results() {
  const location = useLocation();
  const [params] = useSearchParams();
  const search = location.state || JSON.parse(sessionStorage.getItem('frcc-search') || '{}');
  const area = search.area || params.get('area') || '';

  const [maxPrice, setMaxPrice] = useState(50000);
  const [minStars, setMinStars] = useState(0);
  const [amenities, setAmenities] = useState([]);
  const [sort, setSort] = useState('recommended');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const results = useMemo(() => {
    let list = HOTELS.filter(h => !area || h.area === area);
    list = list.filter(h => h.priceFrom <= maxPrice);
    list = list.filter(h => h.stars >= minStars);
    if (amenities.length) {
      list = list.filter(h => amenities.every(a =>
        h.amenities.includes(a.toLowerCase().replace(' ', '-'))
      ));
    }
    switch (sort) {
      case 'price-low': list = [...list].sort((a, b) => a.priceFrom - b.priceFrom); break;
      case 'price-high': list = [...list].sort((a, b) => b.priceFrom - a.priceFrom); break;
      case 'stars': list = [...list].sort((a, b) => b.stars - a.stars); break;
    }
    return list;
  }, [area, maxPrice, minStars, amenities, sort]);

  function toggleAmenity(a) {
    setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  }

  return (
    <>
      <Header />
      <Hero
        title="Rooms & Resorts"
        crumbs={[{ label: 'Home', to: routes.home }, { label: 'Hotel', to: routes.hotelBooking }, { label: 'Resorts' }]}
      />
      <main className="container results-main">
        <div className="results-layout">
          <aside className={'filters-panel' + (filtersOpen ? ' filters-open' : '')}>
            <div className="filters-head">
              <h3>Filters</h3>
              <button className="filters-clear" onClick={() => { setMaxPrice(50000); setMinStars(0); setAmenities([]); }}>
                Clear all
              </button>
            </div>
            <div className="filter-group">
              <label className="filter-label">Max price / night</label>
              <input
                type="range" min="4000" max="50000" step="500"
                value={maxPrice}
                onChange={e => setMaxPrice(+e.target.value)}
              />
              <span className="filter-value">{formatINR(maxPrice)}</span>
            </div>
            <div className="filter-group">
              <label className="filter-label">Star rating</label>
              <div className="star-opts">
                {[0, 4, 5].map(s => (
                  <button
                    key={s}
                    className={'star-opt' + (minStars === s ? ' star-opt-active' : '')}
                    onClick={() => setMinStars(s)}
                  >
                    {s === 0 ? 'Any' : s + '★'}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <label className="filter-label">Amenities</label>
              {AMENITY_OPTS.map(a => (
                <label key={a} className="check-row">
                  <input
                    type="checkbox"
                    checked={amenities.includes(a)}
                    onChange={() => toggleAmenity(a)}
                  />
                  <span>{a}</span>
                </label>
              ))}
            </div>
          </aside>
          <div className="results-content">
            <div className="results-bar">
              <p className="results-count">{length} hotel{results.length !== 1 ? 's' : ''} found{area ? ' in ' + area : ''}</p>
              <div className="results-bar-right">
                <button className="filters-toggle" onClick={() => setFiltersOpen(v => !v)}>Filters</button>
                <select value={sort} onChange={e => setSort(e.target.value)} className="sort-select">
                  {SORTS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </div>
            </div>
            {results.length === 0 ? (
              <div className="no-results">
                <p>No hotels match your filters.</p>
                <button className="btn-secondary" onClick={() => { setMaxPrice(50000); setMinStars(0); setAmenities([]); }}>
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="results-grid">
                {results.map(h => <HotelCard key={h.id} hotel={h} />)}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <MemberToggle />
    </>
  );
}
