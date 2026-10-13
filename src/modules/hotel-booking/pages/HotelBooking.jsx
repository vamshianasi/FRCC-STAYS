import Hero from '../components/common/Hero';
import SearchCard from '../components/search/SearchCard';
import HotelCard from '../components/hotel/HotelCard';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import MemberToggle from '../components/booking/MemberToggle';
import SmartImage from '../components/common/SmartImage';
import AreaCollage from '../components/layout/AreaCollage';
import HOTELS from '../data/hotels';
import { routes } from '../config/routes';
import './HotelBooking.css';

const AREA_CARDS = [
  { name: 'Hyderabad', count: 14 },
  { name: 'Vijayawada', count: 11 },
  { name: 'Amaravathi', count: 11 }
];

export default function HotelBooking() {
  const featured = HOTELS.slice(0, 6);
  return (
    <>
      <Header />
      <Hero
        title="Hotel Booking"
        crumbs={[{ label: 'Home', to: routes.home }, { label: 'Hotel' }]}
        className="hero-band--with-search"
      />
      <main className="container booking-main">
        <SearchCard />
        <section className="featured-section">
          <div className="section-head">
            <span className="eyebrow">Featured</span>
            <h2 className="section-title">Handpicked stays</h2>
          </div>
          <div className="hotel-grid">
            {featured.map(h => <HotelCard key={h.id} hotel={h} />)}
          </div>
        </section>
        <section className="areas-section">
          <div className="section-head">
            <span className="eyebrow">Destinations</span>
            <h2 className="section-title">Explore by area</h2>
          </div>
          <div className="area-grid">
            {AREA_CARDS.map(a => (
              <a key={a.name} href={routes.results + '?area=' + a.name} className="area-card">
                <AreaCollage area={a.name} count={a.count} />
              </a>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <MemberToggle />
    </>
  );
}
