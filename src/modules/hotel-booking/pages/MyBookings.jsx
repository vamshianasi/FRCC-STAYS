import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/common/Hero';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import MemberToggle from '../components/booking/MemberToggle';
import SmartImage from '../components/common/SmartImage';
import { routes } from '../config/routes';
import { loadBookings, cancelBooking } from '../lib/storage';
import { formatDate, formatINR } from '../lib/format';
import { getCancellationStatus } from '../config/cancellation';
import './MyBookings.css';

const FILTERS = ['Upcoming', 'Completed', 'Cancelled'];

export default function MyBookings() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('Upcoming');
  const [bookings, setBookings] = useState([]);
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    const all = loadBookings();
    // filter by current user (demo-user)
    const mine = all.filter(b => b.mobile === 'demo-user' || b.guestName === 'Guest');
    setBookings(mine);
  }, []);

  const filtered = bookings.filter(b => {
    if (filter === 'Upcoming') return b.status === 'Confirmed' || b.status === 'pending';
    if (filter === 'Completed') return b.status === 'Completed';
    if (filter === 'Cancelled') return b.status === 'Cancelled';
    return true;
  });

  function openCancel(b) {
    setCancelTarget(b);
    setCancelReason('');
    setCancelModal(true);
  }

  function confirmCancel() {
    if (!cancelReason || !cancelTarget) return;
    cancelBooking(cancelTarget.id, cancelReason);
    setBookings(loadBookings().filter(b => b.mobile === 'demo-user' || b.guestName === 'Guest'));
    setCancelModal(false);
    setCancelTarget(null);
  }

  function getStatusColor(status) {
    if (status === 'Confirmed') return 'var(--success)';
    if (status === 'pending') return 'var(--gold)';
    if (status === 'Cancelled') return 'var(--danger)';
    return 'var(--muted)';
  }

  return (
    <>
      <Header />
      <Hero
        title="My Bookings"
        crumbs={[{ label: 'Home', to: routes.home }, { label: 'Hotel' }, { label: 'My Bookings' }]}
      />
      <main className="container mb-main">
        <div className="mb-header">
          <h2 className="mb-title">Your Bookings</h2>
          <div className="mb-tabs">
            {FILTERS.map(f => (
              <button key={f} className={'mb-tab' + (filter === f ? ' active' : '')} onClick={() => setFilter(f)}>
                {f} <span className="tab-count">
                  {bookings.filter(b => (f === 'Upcoming' ? (b.status === 'Confirmed' || b.status === 'pending') : f === 'Completed' ? b.status === 'Completed' : b.status === 'Cancelled')).length}
                </span>
              </button>
            ))}
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="mb-empty">
            <p>No {filter.toLowerCase()} bookings found.</p>
            <a href={routes.hotelBooking} className="btn-secondary">Explore Hotels</a>
          </div>
        ) : (
          <div className="mb-grid">
            {filtered.map(b => {
              const cancelStatus = getCancellationStatus(b);
              const cover = b.hotel?.gallery?.find(g => g.category === 'Exterior') || b.room?.gallery?.[0];
              return (
                <div key={b.id} className="mb-card">
                  <div className="mb-card-img">
                    <SmartImage
                      src={cover?.file || '/images/placeholder.svg'}
                      alt={cover?.alt || b.hotel?.name}
                      className="mb-card-cover"
                    />
                    <span className="mb-status" style={{background: getStatusColor(b.status)}}>
                      {b.status}
                    </span>
                  </div>
                  <div className="mb-card-body">
                    <h3 className="mb-card-name">{b.hotel?.name}</h3>
                    <p className="mb-card-loc">{b.hotel?.locality}, {b.hotel?.area}</p>
                    <div className="mb-card-meta">
                      <span>{formatDate(b.checkIn)} – {formatDate(b.checkOut)}</span>
                      <span>·</span>
                      <span>{b.room?.name}</span>
                    </div>
                    <div className="mb-card-price">
                      <span className="mb-price">{formatINR(b.total)}</span>
                      <span className="mb-id">{b.id}</span>
                    </div>
                    <div className="mb-card-actions">
                      <button className="btn-outline" onClick={() => { navigate(`/book/hotel/confirmation/${b.id}`); }}>View Details</button>
                      {(b.status === 'Confirmed' || b.status === 'pending') && cancelStatus.allowed && (
                        <button className="btn-danger" onClick={() => openCancel(b)}>Cancel</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
      <MemberToggle />
      {cancelModal && (
        <div className="modal-overlay" onClick={() => setCancelModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Cancel Booking</h3>
            <p>Are you sure you want to cancel <strong>{cancelTarget?.id}</strong>?</p>
            <div className="modal-field">
              <label>Reason for cancellation</label>
              <select value={cancelReason} onChange={e => setCancelReason(e.target.value)}>
                <option value="">Select a reason</option>
                <option value="Plans changed">Plans changed</option>
                <option value="Found better rate">Found better rate</option>
                <option value="Medical emergency">Medical emergency</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="modal-refund">
              <span>Refund to {cancelTarget?.paymentMethod === 'Pay at Venue' ? 'N/A (no payment to refund)' : 'original method'}</span>
              <span>5–7 working days</span>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setCancelModal(false)}>Keep Booking</button>
              <button className="btn-primary" onClick={confirmCancel} disabled={!cancelReason}>Confirm Cancellation</button>
            </div>
          </div>
        </div>
      )}
      <Footer />
      <MemberToggle />
    </>
  );
}
