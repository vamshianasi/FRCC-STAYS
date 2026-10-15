import Hero from '../components/common/Hero';
import SearchCard from '../components/search/SearchCard';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

import { routes } from '../config/routes';

export default function HotelBooking() {
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
            <span className="eyebrow">Destinations</span>
            <h2 className="section-title">Explore by area</h2>
          </div>
          <div className="area-grid">
            {['hyderabad', 'vijayawada'].map(locationId => {
              const location = {
                hyderabad: { name: 'Hyderabad', price: 3499 },
                vijayawada: { name: 'Vijayawada', price: 2999 }
              }[locationId];
              return (
                <a
                  key={locationId}
                  href={"/book/hotel/stay/" + locationId}
                  className="area-card"
                >
                  <div className="navy-card">
                    <div className="card-header">
                      <h3>{location.name}</h3>
                    </div>
                    <div className="card-body">
                      <p className="card-price">Rooms from Rs {location.price}</p>
                    </div>
                    <div className="card-footer">
                      <svg
                        viewBox="0 0 24 24"
                        width={24}
                        height={24}
                        fill="none"
                        stroke="#C9A227"
                        strokeWidth="1.5"
                        aria-hidden="true"
                      >
                        <path d="M7 12l2 2 4-4m6 2a4 4 0 11-8 0 4 4 0 018 0 4 4 0 01-4 4v.5m0-1.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0v.5Z" />
                      </svg>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}