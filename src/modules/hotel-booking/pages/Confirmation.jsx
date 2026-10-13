import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Hero from '../components/common/Hero';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import MemberToggle from '../components/booking/MemberToggle';
import StepProgress from '../components/booking/StepProgress';
import PriceSummary from '../components/booking/PriceSummary';
import { routes } from '../config/routes';
import { loadBookings } from '../lib/storage';
import { formatDate, formatINR } from '../lib/format';
import { getCancellationStatus } from '../config/cancellation';
import './Confirmation.css';

export default function Confirmation() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const all = loadBookings();
    const b = all.find(x => x.id === bookingId);
    if (!b) { navigate(routes.myBookings); return; }
    setBooking(b);
  }, [bookingId]);

  if (!booking) return <Header />;

  const cancelStatus = getCancellationStatus(booking);

  function openCancel() { setCancelModal(true); }
  function confirmCancel() {
    setCancelling(true);
    // In real app, call cancelBooking from storage
    setTimeout(() => {
      setBooking(prev => ({ ...prev, status: 'Cancelled', cancellationId: 'CAN-' + Date.now().toString().slice(-8), cancelledAt: new Date().toISOString() }));
      setCancelModal(false);
      setCancelling(false);
    }, 600);
  }

  if (!booking) return null;

  return (
    <>
      <Header />
      <Hero
        title="Booking Confirmed"
        crumbs={[{ label: 'Home', to: routes.home }, { label: 'Hotel' }, { label: 'Resorts' }, { label: 'Confirmed' }]}
      />
      <main className="container confirm-main">
        <StepProgress current={5} />
        <div className="confirm-success">
          <div className="success-icon" />
          <h1 className="confirm-title">Booking Confirmed!</h1>
          <p className="confirm-sub">Your booking ID is <strong>{booking.id}</strong></p>
        </div>
        <div className="confirm-layout">
          <div className="confirm-left">
            <div className="confirm-card">
              <h2 className="card-title">Booking Details</h2>
              <div className="confirm-info">
                <div className="ci-row"><span>Hotel</span><span>{booking.hotel.name}</span></div>
                <div className="ci-row"><span>Room</span><span>{booking.room.name}</span></div>
                <div className="ci-row"><span>Check-in</span><span>{formatDate(booking.checkIn)} · 2:00 PM</span></div>
                <div className="ci-row"><span>Check-out</span><span>{formatDate(booking.checkOut)} · 11:00 AM</span></div>
                <div className="ci-row"><span>Guests</span><span>{booking.adults} Adults, {booking.children} Children</span></div>
                <div className="ci-row"><span>Booking ID</span><span>{booking.id}</span></div>
                <div className="ci-row"><span>Payment</span><span>{booking.paymentMethod} · {booking.status === 'pending' ? 'Pay at Venue' : 'Confirmed'}</span></div>
              </div>
            </div>
            <div className="cancel-section">
              <button className="cancel-btn" onClick={openCancel} disabled={!cancelStatus.allowed || booking.status === 'Cancelled'}>
                {booking.status === 'Cancelled' ? 'Already Cancelled' : cancelStatus.allowed ? 'Cancel Booking' : 'Cancellation not allowed'}
              </button>
              {cancelStatus.allowed && booking.status !== 'Cancelled' && (
                <p className="cancel-deadline">Free cancellation until <strong>{formatDate(cancelStatus.deadline)} · 2:00 PM</strong></p>
              )}
              {!cancelStatus.allowed && booking.status !== 'Cancelled' && (
                <p className="cancel-blocked">{cancelStatus.reason}</p>
              )}
            </div>
          </div>
          <aside className="confirm-right">
            <PriceSummary room={booking.room} checkIn={booking.checkIn} checkOut={booking.checkOut} />
          </aside>
        </div>
      </main>
      <Footer />
      <MemberToggle />
      {cancelModal && (
        <div className="modal-overlay" onClick={() => setCancelModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Cancel Booking</h3>
            <p>Are you sure you want to cancel <strong>{booking.id}</strong>?</p>
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
              <span>Refund to {booking.paymentMethod === 'Pay at Venue' ? 'N/A (no payment to refund)' : 'original method'}</span>
              <span>5–7 working days</span>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setCancelModal(false)}>Keep Booking</button>
              <button className="btn-primary" onClick={confirmCancel} disabled={cancelling || !cancelReason}>
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
      <MemberToggle />
    </>
  );
}