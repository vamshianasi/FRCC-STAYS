import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Hero from '../components/common/Hero';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import MemberToggle from '../components/booking/MemberToggle';
import StepProgress from '../components/booking/StepProgress';
import Gallery from '../components/common/Gallery';
import RoomCard from '../components/room/RoomCard';
import PriceSummary from '../components/booking/PriceSummary';
import HOTELS from '../data/hotels';
import { routes } from '../config/routes';
import { formatDate, nightsBetween } from '../lib/format';
import './HotelDetails.css';

export default function HotelDetails() {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const hotel = HOTELS.find(h => h.id === hotelId);
  const [selected, setSelected] = useState(null);

  const search = location.state || JSON.parse(sessionStorage.getItem('frcc-search') || '{}');
  const checkIn = search.checkIn || new Date(Date.now() + 7 * 86400000).toISOString();
  const checkOut = search.checkOut || new Date(Date.now() + 9 * 86400000).toISOString();

  if (!hotel) {
    return (
      <>
        <Header />
        <main className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
          <p>Hotel not found.</p>
          <button className="btn-secondary" onClick={() => navigate(routes.results)}>Back to results</button>
        </main>
        <Footer />
      </>
    );
  }

  function selectRoom(room) {
    const booking = { hotel, room, checkIn, checkOut, adults: search.adults || 2, children: search.children || 0 };
    sessionStorage.setItem('frcc-booking', JSON.stringify(booking));
    navigate(routes.guestDetails, { state: booking });
  }

  const nights = nightsBetween(checkIn, checkOut);

  return (
    <>
      <Header />
      <Hero
        title={hotel.name}
        crumbs={[{ label: 'Home', to: routes.home }, { label: 'Hotel', to: routes.hotelBooking }, { label: 'Resorts', to: routes.results }, { label: hotel.locality }]}
      />
      <main className="container hotel-details-main">
        <StepProgress current={2} />
        <div className="hotel-detail-layout">
          <div className="hotel-detail-left">
            <Gallery images={hotel.gallery} title={hotel.name} />
            <div className="hotel-info-card">
              <div className="hotel-info-head">
                <h2 className="hotel-name">{hotel.name}</h2>
                <span className="hotel-stars">{'★'.repeat(hotel.stars)}</span>
              </div>
              <p className="hotel-loc">{hotel.locality}, {hotel.area}</p>
              <div className="hotel-amenities">
                {hotel.amenities.map(a => (
                  <span key={a} className="amenity-tag">{a.replace('-', ' ')}</span>
                ))}
              </div>
              <div className="stay-dates">
                <div className="stay-date">
                  <span className="stay-date-label">Check-in</span>
                  <span className="stay-date-val">{formatDate(checkIn)}</span>
                </div>
                <div className="stay-date">
                  <span className="stay-date-label">Check-out</span>
                  <span className="stay-date-val">{formatDate(checkOut)}</span>
                </div>
                <div className="stay-date">
                  <span className="stay-date-label">Nights</span>
                  <span className="stay-date-val">{nights}</span>
                </div>
              </div>
            </div>
            <section className="rooms-section">
              <h2 className="rooms-title">Choose your room</h2>
              {hotel.rooms.map(room => (
                <RoomCard
                  key={room.id}
                  room={room}
                  nights={nights}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onSelect={selectRoom}
                />
              ))}
            </section>
          </div>
          <aside className="hotel-detail-right">
            {selected && <PriceSummary room={selected} checkIn={checkIn} checkOut={checkOut} />}
            {!selected && (
              <div className="price-summary">
                <h3 className="ps-title">Price summary</h3>
                <p className="ps-hint">Select a room to see the price breakdown.</p>
              </div>
            )}
          </aside>
        </div>
      </main>
      <Footer />
      <MemberToggle />
    </>
  );
}
