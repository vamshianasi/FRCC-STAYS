import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Hero from '../components/common/Hero';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

import StepProgress from '../components/booking/StepProgress';
import PriceSummary from '../components/booking/PriceSummary';
import { formatDate, formatINR, nightsBetween } from '../lib/format';
import { verifyUpi } from '../lib/verifyUpi';
import { ID_TYPES, NEEDS_VISA, isValidId, maskId, idErrorMessage, formatIdInput } from '../lib/idProof';
import { COUNTRY_CODES, normaliseWhatsApp, isValidWhatsApp, whatsappErrorMessage, maskWhatsApp } from '../lib/whatsappNumber';
import { LOCATIONS, getLocation, getRoom } from '../config/locations';
import './GuestDetails.css';

const GUEST_TYPES = ['Leisure', 'Business', 'Wedding', 'Event', 'Other'];

const ID_HELPER = 'Please carry the same original ID for verification at check-in.';

export default function GuestDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state || JSON.parse(sessionStorage.getItem('frcc-booking') || '{}');

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
    // Fallback: try to find room by old format
    navigate('/book/hotel');
    return null;
  }

  const checkIn = isNewFormat ? booking.checkIn : (booking.hotel?.checkIn || '');
  const checkOut = isNewFormat ? booking.checkOut : (booking.hotel?.checkOut || '');
  const nights = nightsBetween(checkIn, checkOut);
  const base = room.pricePerNight * nights;
  const gst = Math.round(base * 0.18);
  const total = base + gst;

  const [form, setForm] = useState({
    fullName: '', mobile: '', email: '', adults: room?.capacity || 2, children: 0,
    guestType: 'Leisure', specialRequests: '',
    idProof: '', idNumber: '', visaNumber: ''
  });
  const [waCode, setWaCode] = useState('+91');
  const [waNumber, setWaNumber] = useState('');
  const [waSameAsMobile, setWaSameAsMobile] = useState(false);
  const [waConsent, setWaConsent] = useState(false);
  const [errors, setErrors] = useState({});
  const [upi, setUpi] = useState({ id: '', verified: false, holder: '', confirmed: false });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (booking.guestName) setForm(f => ({ ...f, fullName: booking.guestName }));
    if (booking.adults !== undefined) setForm(f => ({ ...f, adults: booking.adults }));
    if (booking.children !== undefined) setForm(f => ({ ...f, children: booking.children }));
  }, [booking]);

  // "Same as mobile number" keeps the two in sync until the guest edits the
  // WhatsApp field, which un-checks the box.
  useEffect(() => {
    if (waSameAsMobile) setWaNumber(form.mobile.replace(/\D/g, '').slice(0, 10));
  }, [waSameAsMobile, form.mobile]);

  function handleWaNumberChange(value) {
    setWaNumber(normaliseWhatsApp(waCode, value));
    if (value !== form.mobile.replace(/\D/g, '').slice(0, 10)) setWaSameAsMobile(false);
  }

  function handleWaCodeChange(code) {
    setWaCode(code);
    setWaNumber(normaliseWhatsApp(code, waNumber));
  }

  function handleIdNumberChange(value) {
    setForm({ ...form, idNumber: formatIdInput(form.idProof, value) });
  }

  function handleIdTypeChange(value) {
    setForm({ ...form, idProof: value, idNumber: '' });
    if (value !== NEEDS_VISA) setForm(f => ({ ...f, visaNumber: '' }));
  }

  function validate() {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.mobile.trim()) e.mobile = 'Mobile is required';
    else if (!/^\d{10}$/.test(form.mobile)) e.mobile = 'Enter a valid 10-digit mobile number';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (form.adults < 1) e.adults = 'At least 1 adult required';
    if (!form.guestType) e.guestType = 'Select a guest type';

    // WhatsApp
    if (!waNumber) e.whatsapp = 'WhatsApp number is required';
    else if (!isValidWhatsApp(waCode, waNumber)) e.whatsapp = whatsappErrorMessage(waCode, waNumber);
    if (!waConsent) e.whatsappConsent = 'Please confirm to receive the receipt on WhatsApp';

    // ID proof (optional, but must be well formed when given)
    if (form.idProof) {
      if (!form.idNumber.trim()) e.idNumber = 'Enter the ID number';
      else if (!isValidId(form.idProof, form.idNumber)) e.idNumber = idErrorMessage(form.idProof, form.idNumber);
      if (form.idProof === NEEDS_VISA) {
        if (!form.visaNumber.trim()) e.visaNumber = 'Enter the visa number';
        else if (!/^[A-Z0-9]{6,9}$/.test(form.visaNumber.trim().toUpperCase())) e.visaNumber = 'Visa number must be 6 to 9 letters or digits';
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleUpiVerify() {
    try {
      const res = await verifyUpi(form.mobile + '@upi'); // demo: use mobile@upi format
      setUpi({ id: form.mobile + '@upi', verified: true, holder: res.holderName, confirmed: false });
    } catch {
      setUpi({ id: '', verified: false, holder: '', confirmed: false });
      setErrors({ upi: 'Could not verify that UPI ID' });
    }
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // Only the MASKED ID number is stored, never the full number.
    const payload = {
      ...form,
      idProofLabel: form.idProof ? (ID_TYPES.find(t => t.value === form.idProof)?.label || '') : '',
      idNumberMasked: form.idProof ? maskId(form.idProof, form.idNumber) : '',
      visaNumberMasked: form.visaNumber ? ('X'.repeat(Math.max(0, form.visaNumber.trim().length - 2)) + form.visaNumber.trim().slice(-2)) : '',
      idNumber: undefined,
      visaNumber: undefined,
      whatsappCode: waCode,
      whatsappNumber: waCode + waNumber,
      whatsappNumberMasked: maskWhatsApp(waCode, waNumber),
      whatsappConsent: waConsent,
      upi
    };
    sessionStorage.setItem('frcc-guest', JSON.stringify(payload));
    setSubmitting(false);
    navigate('/book/hotel/payment');
  }

  const waValid = isValidWhatsApp(waCode, waNumber);

  // Breadcrumb: new format shows city, old format showed hotel name
  const cityName = loc ? loc.city : 'Hotel';
  const roomName = room.type;

  return (
    <>
      <Header />
      <Hero
        title="Guest Details"
        crumbs={[
          { label: 'Home', to: '/book/hotel' },
          { label: cityName, to: `/book/hotel/stay/${loc?.id || 'hyderabad'}` },
          { label: roomName, to: '/' }
        ]}
      />
      <main className="container guest-main">
        <StepProgress current={3} />
        <div className="guest-layout">
          <div className="guest-left">
            <div className="guest-card">
              <h2 className="card-title">Guest Information</h2>
              <form className="guest-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className={'fg' + (errors.fullName ? ' fg-error' : '')}>
                    <label>Full Name</label>
                    <input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
                    {errors.fullName && <span className="fg-msg">{errors.fullName}</span>}
                  </div>

                  <div className={'fg' + (errors.mobile ? ' fg-error' : '')}>
                    <label>Mobile</label>
                    <input type="tel" inputMode="numeric" maxLength={10} value={form.mobile}
                      onChange={e => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })} />
                    {errors.mobile && <span className="fg-msg">{errors.mobile}</span>}
                  </div>

                  <div className={'fg wa-field' + (errors.whatsapp || errors.whatsappConsent ? ' fg-error' : '')}>
                    <label>WhatsApp Number</label>
                    <div className="wa-row">
                      <select className="wa-code" value={waCode} onChange={e => handleWaCodeChange(e.target.value)} aria-label="Country code">
                        {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                      </select>
                      <input type="tel" inputMode="numeric" value={waNumber}
                        onChange={e => handleWaNumberChange(e.target.value)} placeholder="98XXXXXX10" />
                    </div>
                    <label className="wa-check">
                      <input type="checkbox" checked={waSameAsMobile} onChange={e => setWaSameAsMobile(e.target.checked)} />
                      <span>Same as mobile number</span>
                    </label>
                    <label className="wa-check">
                      <input type="checkbox" checked={waConsent} onChange={e => setWaConsent(e.target.checked)} />
                      <span>Send my booking confirmation and receipt to this WhatsApp number.</span>
                    </label>
                    <span className="wa-helper">Your receipt will be sent here after booking.</span>
                    {waNumber && !waValid && <span className="fg-msg">{errors.whatsapp || whatsappErrorMessage(waCode, waNumber)}</span>}
                    {errors.whatsapp && !waNumber && <span className="fg-msg">{errors.whatsapp}</span>}
                    {errors.whatsappConsent && <span className="fg-msg">{errors.whatsappConsent}</span>}
                  </div>

                  <div className={'fg' + (errors.email ? ' fg-error' : '')}>
                    <label>Email</label>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    {errors.email && <span className="fg-msg">{errors.email}</span>}
                  </div>

                  <div className={'fg' + (errors.adults ? ' fg-error' : '')}>
                    <label>Adults</label>
                    <input type="number" min="1" max="8" value={form.adults} onChange={e => setForm({ ...form, adults: +e.target.value })} />
                    {errors.adults && <span className="fg-msg">{errors.adults}</span>}
                  </div>

                  <div className="fg">
                    <label>Children</label>
                    <input type="number" min="0" max="6" value={form.children} onChange={e => setForm({ ...form, children: +e.target.value })} />
                  </div>

                  <div className={'fg' + (errors.guestType ? ' fg-error' : '')}>
                    <label>Guest Type</label>
                    <select value={form.guestType} onChange={e => setForm({ ...form, guestType: e.target.value })}>
                      {GUEST_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {errors.guestType && <span className="fg-msg">{errors.guestType}</span>}
                  </div>
                </div>

                <div className="fg" style={{ gridColumn: '1 / -1' }}>
                  <label>Special Requests</label>
                  <textarea value={form.specialRequests} onChange={e => setForm({ ...form, specialRequests: e.target.value })} rows="3" />
                </div>

                <div className="fg" style={{ gridColumn: '1 / -1' }}>
                  <label>ID Proof (optional)</label>
                  <select value={form.idProof} onChange={e => handleIdTypeChange(e.target.value)}>
                    <option value="">None</option>
                    {ID_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>

                {form.idProof && (
                  <div className="fg" style={{ gridColumn: '1 / -1' }}>
                    <label>{ID_TYPES.find(t => t.value === form.idProof)?.label} Number</label>
                    <input
                      value={form.idNumber}
                      onChange={e => handleIdNumberChange(e.target.value)}
                      placeholder={ID_TYPES.find(t => t.value === form.idProof)?.placeholder}
                    />
                    {form.idProof === NEEDS_VISA && (
                      <div className="wa-visa-field">
                        <label>Visa number</label>
                        <input
                          value={form.visaNumber}
                          maxLength={9}
                          onChange={e => setForm({ ...form, visaNumber: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })}
                          placeholder="V1234567"
                        />
                        {errors.visaNumber && <span className="fg-msg">{errors.visaNumber}</span>}
                      </div>
                    )}
                    {errors.idNumber && <span className="fg-msg">{errors.idNumber}</span>}
                  </div>
                )}
                <span className="wa-helper">{ID_HELPER}</span>
              </form>
            </div>
          </div>
          <aside className="guest-right">
            <PriceSummary room={room} checkIn={checkIn} checkOut={checkOut} />
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}