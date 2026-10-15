import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import Hero from '../components/common/Hero';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

import StepProgress from '../components/booking/StepProgress';
import PriceSummary from '../components/booking/PriceSummary';
import { routes } from '../config/routes';
import { loadBookings, updateBooking, cancelBooking } from '../lib/storage';
import { formatDate } from '../lib/format';
import { getCancellationStatus, CANCELLATION_NOTE } from '../config/cancellation';
import { sendReceiptToWhatsApp, applyReceiptSent, WHATSAPP_MODE } from '../services/whatsapp';
import { LOCATIONS, getLocation, getRoom } from '../config/locations';
import './Confirmation.css';

export default function Confirmation() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  // Receipt delivery status
  const [waStatus, setWaStatus] = useState('sending'); // sending | sent | failed | rate_limited
  const [waInfo, setWaInfo] = useState(null);
  const autoSent = useRef(false);

  useEffect(() => {
    const b = loadBookings().find(x => x.id === bookingId);
    if (!b) { navigate(routes.myBookings); return; }
    setBooking(b);
  }, [bookingId]);

  // Determine location and room info from new or old booking format
  let loc, room, cityName, roomName;

  if (booking.locationId) {
    // New format
    loc = getLocation(booking.locationId);
    cityName = loc?.city || 'Stay';
    room = getRoom(booking.locationId, booking.roomType);
    roomName = room?.type || booking.roomType || 'Room';
  } else if (booking.hotel) {
    // Old format fallback
    loc = LOCATIONS.find(l => l.id === booking.hotel.id);
    cityName = loc?.city || booking.hotel.area || 'Hotel';
    room = loc?.rooms.find(r => r.name === booking.room.name);
    roomName = booking.room.name || 'Room';
  }

  // Send the receipt automatically once, right after the booking is saved.
  useEffect(() => {
    if (!booking || autoSent.current) return;
    if (!booking.whatsappNumber) { setWaStatus('failed'); setWaInfo({ error: 'No WhatsApp number on this booking' }); return; }
    if (booking.receiptSent?.status === 'sent' && booking.receiptSent.mode === WHATSAPP_MODE) {
      setWaStatus('sent');
      setWaInfo(booking.receiptSent);
      return;
    }
    autoSent.current = true;
    deliver(booking);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking?.id]);

  async function deliver(target) {
    setWaStatus('sending');
    setWaInfo(null);
    const result = await sendReceiptToWhatsApp(target);
    setWaStatus(result.status === 'sent' ? 'sent' : result.status);
    setWaInfo(result);
    const updated = updateBooking(target.id, applyReceiptSent(target, result));
    if (updated) setBooking(updated);
  }

  const cancelStatus = getCancellationStatus(booking || {});

  function openCancel() { setCancelModal(true); }

  async function confirmCancel() {
    if (!cancelReason || !booking) return;
    setCancelling(true);
    await new Promise(r => setTimeout(r, 600));
    const cancelled = cancelBooking(booking.id, cancelReason);
    setBooking(cancelled);
    setCancelModal(false);
    setCancelling(false);
    // Updated "Booking Cancelled" receipt is sent automatically.
    if (cancelled) deliver(cancelled);
  }

  if (!booking) return <Header />;

  const masked = booking.whatsappNumberMasked || '';
  const demoNote = waInfo?.mode === 'demo';
  const isCancelled = booking.status === 'Cancelled';
  const canCancel = cancelStatus.allowed && !isCancelled;

  function statusLine() {
    if (waStatus === 'sending') return <span className="wa-status wa-status--sending">Sending receipt to WhatsApp...</span>;
    if (waStatus === 'sent') {
      return (
        <span className="wa-status wa-status--sent">
          Receipt sent to {masked}
          {demoNote && ' (demo mode, no real message sent)'}
        </span>
      );
    }
    if (waStatus === 'rate_limited') {
      return (
        <span className="wa-status wa-status--failed">
          {waInfo?.error || 'Please try again later'}
          {' '}
          <button className="wa-resend" onClick={() => deliver(booking)}>Resend</button>
        </span>
      );
    }
    return (
      <span className="wa-status wa-status--failed">
        {waInfo?.error || 'Could not send the receipt'}
        {' '}
        <button className="wa-resend" onClick={() => deliver(booking)}>Resend</button>
      </span>
    );
  }

  return (
    <>
      <Header />
      <Hero
        title="Booking Confirmed"
        crumbs={[
          { label: 'Home', to: routes.home },
          { label: 'Hotel' },
          { label: cityName, to: `/book/hotel/stay/${booking.locationId || 'hyderabad'}` },
          { label: roomName, to: '/' }
        ]}
      />
      <main className="container confirm-main">
        <StepProgress current={5} />
        <div className="confirm-success">
          <div className="success-icon" />
          <h1 className="confirm-title">Booking Confirmed!</h1>
          <p className="confirm-sub">Your booking ID is <strong>{booking.id}</strong></p>
        </div>

        <div className="confirm-receipt-bar">
          {statusLine()}
        </div>

        <div className="confirm-layout">
          <div className="confirm-left">
            <div className="confirm-card">
              <h2 className="card-title">Booking Details</h2>
              <div className="confirm-info">
                <div className="ci-row"><span>Stay</span><span>{cityName}</span></div>
                <div className="ci-row"><span>Room</span><span>{roomName}</span></div>
                <div className="ci-row"><span>Check-in</span><span>{formatDate(booking.checkIn)} · 2:00 PM</span></div>
                <div className="ci-row"><span>Check-out</span><span>{formatDate(booking.checkOut)} · 11:00 AM</span></div>
                <div className="ci-row"><span>Guests</span><span>{booking.adults} Adults, {booking.children} Children</span></div>
                <div className="ci-row"><span>WhatsApp</span><span>{masked}</span></div>
                {booking.idProofLabel && (
                  <div className="ci-row"><span>ID proof</span><span>{booking.idProofLabel} {booking.idNumberMasked}</span></div>
                )}
                <div className="ci-row"><span>Booking ID</span><span>{booking.id}</span></div>
                <div className="ci-row"><span>Payment</span><span>{booking.paymentMethod} · {booking.status === 'pending' ? 'Pay at Venue' : 'Confirmed'}</span></div>
              </div>
            </div>

            {canCancel && (
              <div className="cancel-section">
                <p className="cancel-deadline">Free cancellation until <strong>{formatDate(cancelStatus.deadline)} · 2:00 PM</strong></p>
              </div>
            )}

            <div className="confirm-actions">
              <button
                className="frcc-btn frcc-btn--gold"
                onClick={() => deliver(booking)}
                disabled={waStatus === 'sending'}
              >
                Download Receipt
              </button>
              <button className="frcc-btn frcc-btn--navy" onClick={() => navigate(routes.myBookings)}>
                My Bookings
              </button>
              {isCancelled ? (
                <span className="cancelled-badge">Cancelled</span>
              ) : (
                <button
                  className="frcc-btn frcc-btn--danger"
                  onClick={openCancel}
                  disabled={!cancelStatus.allowed}
                >
                  Cancel Booking
                </button>
              )}
            </div>

            {!canCancel && !isCancelled && (
              <p className="cancel-note">{CANCELLATION_NOTE}</p>
            )}

            {booking.receiptSent?.at && (
              <p className="confirm-last-sent">Last sent {new Date(booking.receiptSent.at).toLocaleString('en-IN')}</p>
            )}
          </div>
          <aside className="confirm-right">
            <PriceSummary room={room} checkIn={booking.checkIn} checkOut={booking.checkOut} />
          </aside>
        </div>
      </main>
      <Footer />

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
    </>
  );
}