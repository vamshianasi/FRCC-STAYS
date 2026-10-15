import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Hero from '../components/common/Hero';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

import StepProgress from '../components/booking/StepProgress';
import PriceSummary from '../components/booking/PriceSummary';
import { formatINR, formatDate, genId } from '../lib/format';
import { luhnCheck, detectCardType } from '../lib/luhn';
import { verifyUpi } from '../lib/verifyUpi';
import { addBooking } from '../lib/storage';
import { genCancellationId } from '../lib/format';
import { LOCATIONS, getLocation, getRoom } from '../config/locations';
import './Payment.css';

const METHODS = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallets', 'EMI', 'Pay at Venue'];

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state || JSON.parse(sessionStorage.getItem('frcc-booking') || '{}');
  const guest = JSON.parse(sessionStorage.getItem('frcc-guest') || '{}');

  // New format: booking has locationId and roomType
  // Old format: booking had hotel and room
  if (!booking.locationId && !booking.hotel) {
    navigate('/book/hotel');
    return null;
  }

  // Resolve location and room from new format
  const loc = booking.locationId ? getLocation(booking.locationId) : null;
  const room = booking.roomType ? getRoom(booking.locationId || 'hyderabad', booking.roomType) : null;
  const isNewFormat = !!booking.locationId;

  if (!room) {
    navigate('/book/hotel');
    return null;
  }

  const checkIn = isNewFormat ? booking.checkIn : (booking.hotel?.checkIn || '');
  const checkOut = isNewFormat ? booking.checkOut : (booking.hotel?.checkOut || '');
  const nights = Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000));
  const base = room.pricePerNight * nights;
  const gst = Math.round(base * 0.18);
  const total = base + gst;

  const [method, setMethod] = useState('UPI');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [upi, setUpi] = useState({ id: guest.upi?.id || '', verified: guest.upi?.verified || false, holder: guest.upi?.holder || '', confirmed: guest.upi?.confirmed || false });
  const [upiError, setUpiError] = useState('');
  const [cardError, setCardError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [processStage, setProcessStage] = useState(null);
  const [payAtVenue, setPayAtVenue] = useState(false);

  async function verifyUpiId() {
    if (!upi.id) { setUpiError('Enter a UPI ID'); return; }
    setUpiError('');
    try {
      const res = await verifyUpi(upi.id);
      setUpi({ id: upi.id, verified: true, holder: res.holderName, confirmed: false });
    } catch (err) {
      setUpiError(err.message);
    }
  }

  function validateCard() {
    const num = card.number.replace(/\s/g, '');
    if (!num || !luhnCheck(num)) { setCardError('Invalid card number'); return false; }
    if (!/^\d{2}\/\d{2}$/.test(card.expiry)) { setCardError('Invalid expiry (MM/YY)'); return false; }
    if (!/^\d{3,4}$/.test(card.cvv)) { setCardError('Invalid CVV'); return false; }
    if (!card.name.trim()) { setCardError('Enter cardholder name'); return false; }
    setCardError('');
    return true;
  }

  async function pay() {
    if (method === 'UPI' && (!upi.verified || !upi.confirmed)) { setUpiError('Verify UPI ID and confirm it belongs to you'); return; }
    if (method.match(/Card/) && !validateCard()) return;
    if (payAtVenue) {
      completeBooking('Pay at Venue', 'pending');
      return;
    }
    setProcessing(true);
    setProcessStage('validating');
    await new Promise(r => setTimeout(r, 800));
    setProcessStage('processing');
    await new Promise(r => setTimeout(r, 1200));
    setProcessStage('success');
    await new Promise(r => setTimeout(r, 600));
    completeBooking(method, 'confirmed');
  }

  function completeBooking(paymentMethod, status) {
    const bookingId = genId('FRCC');
    const newBooking = {
      id: bookingId,
      locationId: isNewFormat ? booking.locationId : (booking.hotel?.id || 'hyderabad'),
      city: isNewFormat ? loc?.city : (booking.hotel?.area || 'Hyderabad'),
      roomType: isNewFormat ? booking.roomType : (booking.hotel?.rooms?.find(r => r.name)?.name || 'Standard Room'),
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      adults: guest.adults,
      children: guest.children,
      guestName: guest.fullName,
      mobile: guest.mobile,
      email: guest.email,
      guestType: guest.guestType,
      specialRequests: guest.specialRequests,
      // WhatsApp (full number stored on the booking, always shown masked)
      whatsappCode: guest.whatsappCode,
      whatsappNumber: guest.whatsappNumber,
      whatsappNumberMasked: guest.whatsappNumberMasked,
      whatsappConsent: guest.whatsappConsent,
      // ID proof: type + MASKED number only
      idProof: guest.idProof,
      idProofLabel: guest.idProofLabel,
      idNumberMasked: guest.idNumberMasked,
      visaNumberMasked: guest.visaNumberMasked,
      paymentMethod, status, total, base, gst,
      createdAt: new Date().toISOString(),
      cancellationDeadline: new Date(new Date(booking.checkIn).getTime() - 48 * 3600000).toISOString()
    };
    addBooking(bookingId, newBooking);
    sessionStorage.removeItem('frcc-booking');
    sessionStorage.removeItem('frcc-guest');
    // Receipt is sent automatically by the Confirmation page on mount.
    navigate(`${routes.confirmation.replace(':bookingId', bookingId)}`);
  }

  return (
    <>
      <Header />
      <Hero
        title="Payment"
        crumbs={[
          { label: 'Home', to: '/book/hotel' },
          { label: 'Hotel' },
          { label: loc?.city || 'Resorts', to: `/book/hotel/stay/${loc?.id || 'hyderabad'}` },
          { label: roomType => roomType.type || 'Details', to: '/' },
          { label: 'Payment' }
        ]}
      />
      <main className="container payment-main">
        <StepProgress current={4} />
        <div className="payment-layout">
          <div className="payment-left">
            <div className="pay-card">
              <h2 className="card-title">Payment Method</h2>
              <div className="method-tabs">
                {METHODS.map(m => (
                  <button key={m} className={'method-tab' + (method === m ? ' active' : '')} onClick={() => setMethod(m)}>
                    {m}
                  </button>
                ))}
              </div>
              <div className="method-content">
                {method === 'UPI' && (
                  <div className="upi-form">
                    <div className="upi-field">
                      <label>UPI ID</label>
                      <input value={upi.id} onChange={e => setUpi({...upi, id: e.target.value, verified: false, confirmed: false})} placeholder="name@bank" />
                      <button className="btn-outline upi-verify" onClick={verifyUpiId} disabled={!upi.id}>Verify UPI ID</button>
                    </div>
                    {upi.verified && (
                      <div className="upi-verified">
                        <p><strong>Verified:</strong> {upi.holder}</p>
                        <label className="upi-confirm">
                          <input type="checkbox" checked={upi.confirmed} onChange={e => setUpi({...upi, confirmed: e.target.checked})} />
                          <span>This UPI ID belongs to me</span>
                        </label>
                      </div>
                    )}
                    {upiError && <p className="upi-error">{upiError}</p>}
                    <p className="upi-note">Demo mode: format name@bank. Verification simulated.</p>
                  </div>
                )}
                {method.match(/Card/) && (
                  <div className="card-form">
                    <div className="card-field">
                      <label>Card Number</label>
                      <input value={card.number} onChange={e => setCard({...card, number: e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()})} placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="card-row">
                      <div className="card-field half">
                        <label>Expiry (MM/YY)</label>
                        <input value={card.expiry} onChange={e => setCard({...card, expiry: e.target.value.replace(/(\d{2})/, '$1/').slice(0,5)})} placeholder="MM/YY" />
                      </div>
                      <div className="card-field half">
                        <label>CVV</label>
                        <input type="password" value={card.cvv} onChange={e => setCard({...card, cvv: e.target.value.slice(0,4)})} placeholder="CVV" />
                      </div>
                    </div>
                    <div className="card-field">
                      <label>Cardholder Name</label>
                      <input value={card.name} onChange={e => setCard({...card, name: e.target.value})} />
                    </div>
                    {cardError && <p className="card-error">{cardError}</p>}
                    <p className="card-note">Demo mode: Luhn validation only. Last 4 digits stored.</p>
                  </div>
                )}
                {['Net Banking', 'Wallets', 'EMI'].includes(method) && (
                  <div className="simple-method">
                    <p>Select <strong>{method}</strong> and you will be redirected to the provider's page.</p>
                    <p className="simple-note">Demo mode: no redirection, just confirm below.</p>
                  </div>
                )}
                {method === 'Pay at Venue' && (
                  <div className="pay-at-venue">
                    <label className="pay-venue-check">
                      <input type="checkbox" checked={payAtVenue} onChange={e => setPayAtVenue(e.target.checked)} />
                      <span>I understand I will pay at the venue and my booking will be confirmed.</span>
                    </label>
                  </div>
                )}
                {cardError && <p className="card-error">{cardError}</p>}
              </div>
            </div>
          </div>
          <aside className="payment-right">
            <PriceSummary room={room} checkIn={checkIn} checkOut={checkOut} />
            <button className="btn-primary pay-btn" onClick={pay} disabled={processing || (method === 'UPI' && (!upi.verified || !upi.confirmed)) || (method.match(/Card/) && (!card.number || !card.expiry || !card.cvv)) || (method === 'Pay at Venue' && !payAtVenue)}>
              {processing ? <span className="pay-btn-text">{processStage === 'validating' ? 'Validating...' : processStage === 'processing' ? 'Processing...' : 'Success! Redirecting...'}</span> : <span className="pay-btn-text">Pay {formatINR(total)}</span>}
            </button>
            {processing && processStage !== 'success' && (
              <div className="pay-progress">
                <div className="pay-spinner" />
                <span>{processStage === 'validating' ? 'Validating payment details...' : 'Processing payment...'}</span>
              </div>
            )}
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}