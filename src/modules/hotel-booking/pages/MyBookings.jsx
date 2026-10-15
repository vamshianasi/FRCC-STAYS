import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/common/Hero';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

import SmartImage from '../components/common/SmartImage';
import { routes } from '../config/routes';
import { loadBookings, cancelBooking, updateBooking } from '../lib/storage';
import { formatDate, formatINR } from '../lib/format';
import { getCancellationStatus, CANCELLATION_NOTE } from '../config/cancellation';
import { TABS, DEFAULT_TAB, tabForBooking, filterByTab, tabCounts, sortBookings } from '../lib/bookingTabs';
import { sendReceiptToWhatsApp, applyReceiptSent } from '../services/whatsapp';
import './MyBookings.css';

export default function MyBookings() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState(DEFAULT_TAB);
  const [bookings, setBookings] = useState([]);
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  // Per-booking receipt status: { [bookingId]: { status, error, to, at } }
  const [receiptState, setReceiptState] = useState({});

  function reload() {
    setBookings(sortBookings(loadBookings()));
  }

  useEffect(() => { reload(); }, []);

  const counts = tabCounts(bookings);
  const filtered = sortBookings(filterByTab(bookings, filter));

  function openCancel(b) {
    setCancelTarget(b);
    setCancelReason('');
    setCancelModal(true);
  }

  function confirmCancel() {
    if (!cancelReason || !cancelTarget) return;
    const cancelled = cancelBooking(cancelTarget.id, cancelReason);
    reload();
    setCancelModal(false);
    setCancelTarget(null);
    // Cancellation receipt is sent automatically.
    if (cancelled) deliver(cancelled);
  }

  async function deliver(target) {
    setReceiptState(s => ({ ...s, [target.id]: { status: 'sending' } }));
    const result = await sendReceiptToWhatsApp(target);
    setReceiptState(s => ({ ...s, [target.id]: result }));
    updateBooking(target.id, applyReceiptSent(target, result));
    reload();
  }

  function statusColor(status) {
    if (status === 'Cancelled') return 'var(--danger)';
    if (status === 'pending') return 'var(--gold)';
    return 'var(--success)';
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
            {TABS.map(t => (
              <button key={t} className={'mb-tab' + (filter === t ? ' active' : '')} onClick={() => setFilter(t)}>
                {t} <span className="tab-count">{counts[t]}</span>
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
              const rs = receiptState[b.id];
              const lastSent = rs?.status === 'sent' ? rs.at : b.receiptSent?.at;
              const isCancelled = b.status === 'Cancelled' || !!b.cancelledAt;
              const isUpcoming = tabForBooking(b) === 'Upcoming';
              const canCancel = isUpcoming && cancelStatus.allowed && !isCancelled;
              const refundNote = b.paymentMethod === 'Pay at Venue'
                ? 'No payment made, nothing to refund'
                : `Refund of ${formatINR(b.total)} to the original method in 5–7 working days`;
              return (
                <div key={b.id} className="mb-card">
                  <div className="mb-card-img">
                    <SmartImage
                      src={cover?.file || '/images/placeholder.svg'}
                      alt={cover?.alt || b.hotel?.name}
                      className="mb-card-cover"
                      owner={b.id}
                    />
                    <span className="mb-status" style={{ background: statusColor(b.status) }}>
                      {b.status === 'confirmed' ? 'Confirmed' : b.status === 'pending' ? 'Pay at Venue' : b.status}
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

                    {rs && (
                      <p className={'mb-receipt-status mb-receipt-status--' + rs.status}>
                        {rs.status === 'sending' && 'Sending receipt to WhatsApp...'}
                        {rs.status === 'sent' && `Receipt sent to ${rs.to}${rs.mode === 'demo' ? ' (demo mode, no real message sent)' : ''}`}
                        {rs.status === 'rate_limited' && (rs.error || 'Please try again later')}
                        {rs.status === 'failed' && (
                          <>
                            {rs.error || 'Could not send'}
                            <button className="wa-resend" onClick={() => deliver(b)}>Resend</button>
                          </>
                        )}
                      </p>
                    )}
                    {lastSent && !rs && (
                      <p className="mb-receipt-status mb-receipt-status--sent">
                        Last sent {new Date(lastSent).toLocaleString('en-IN')}
                      </p>
                    )}

                    {isCancelled && (
                      <div className="mb-cancel-info">
                        {b.cancellationId && (
                          <p className="mb-cancel-info-row">
                            <span>Cancellation ID</span><span>{b.cancellationId}</span>
                          </p>
                        )}
                        <p className="mb-cancel-info-row">
                          <span>Cancelled on</span>
                          <span>{b.cancelledAt ? formatDate(b.cancelledAt) : '—'}</span>
                        </p>
                        <p className="mb-cancel-info-row">
                          <span>Reason</span><span>{b.cancellationReason || '—'}</span>
                        </p>
                        <p className="mb-cancel-note">{refundNote}</p>
                      </div>
                    )}

                    <div className={'mb-card-actions' + (isUpcoming ? '' : ' mb-card-actions--2')}>
                      <button
                        className="frcc-btn frcc-btn--outline"
                        onClick={() => deliver(b)}
                        disabled={rs?.status === 'sending'}
                      >
                        Download Receipt
                      </button>
                      <button
                        className="frcc-btn frcc-btn--navy"
                        onClick={() => navigate(`/book/hotel/confirmation/${b.id}`)}
                      >
                        View Details
                      </button>
                      {isUpcoming && (
                        <button
                          className="frcc-btn frcc-btn--danger"
                          onClick={() => openCancel(b)}
                          disabled={!canCancel}
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>

                    {isUpcoming && !canCancel && (
                      <p className="cancel-note">{CANCELLATION_NOTE}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />

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
    </>
  );
}