import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Hero from '../components/common/Hero';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import MemberToggle from '../components/booking/MemberToggle';
import StepProgress from '../components/booking/StepProgress';
import PriceSummary from '../components/booking/PriceSummary';
import { routes } from '../config/routes';
import { formatDate, formatINR, nightsBetween } from '../lib/format';
import { isMember, MEMBER_DISCOUNT } from '../config/member';
import { genId } from '../lib/format';
import { verifyUpi } from '../lib/verifyUpi';
import { loadBookings } from '../lib/storage';
import './GuestDetails.css';

const GUEST_TYPES = ['Leisure', 'Business', 'Wedding', 'Event', 'Other'];

export default function GuestDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state || JSON.parse(sessionStorage.getItem('frcc-booking') || '{}');
  if (!booking.hotel) { navigate('/book/hotel'); return null; }

  const { hotel, room, checkIn, checkOut, adults, children } = booking;
  const nights = nightsBetween(checkIn, checkOut);
  const base = room.pricePerNight * nights;
  const discount = isMember ? Math.round(base * MEMBER_DISCOUNT) : 0;
  const subtotal = base - discount;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const [form, setForm] = useState({
    fullName: '', mobile: '', email: '', adults, children,
    guestType: 'Leisure', specialRequests: '', idProof: '', idNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [upi, setUpi] = useState({ id: '', verified: false, holder: '', confirmed: false });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (booking.guestName) setForm(f => ({ ...f, fullName: booking.guestName }));
  }, []);

  function validate() {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.mobile.trim()) e.mobile = 'Mobile is required';
    else if (!/^\d{10}$/.test(form.mobile)) e.mobile = 'Enter a valid 10-digit mobile number';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (form.adults < 1) e.adults = 'At least 1 adult required';
    if (!form.guestType) e.guestType = 'Select a guest type';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleUpiVerify() {
    try {
      const res = await verifyUpi(form.mobile + '@upi'); // demo: use mobile@upi format
      setUpi({ id: form.mobile + '@upi', verified: true, holder: res.holderName, confirmed: false });
    } catch (err) {
      setUpi({ id: '', verified: false, holder: '', confirmed: false });
      setErrors({ upi: err.message });
    }
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    sessionStorage.setItem('frcc-guest', JSON.stringify({ ...form, upi }));
    setSubmitting(false);
    navigate('/book/hotel/payment');
  }

  return (
    <>
      <Header />
      <Hero
        title="Guest Details"
        crumbs={[{ label: 'Home', to: '/book/hotel' }, { label: 'Hotel', to: '/book/hotel' }, { label: 'Resorts', to: '/book/hotel/results' }, { label: 'Details' }]}
      />
      <main className="container guest-main">
        <StepProgress current={3} />
        <div className="guest-layout">
          <div className="guest-left">
            <div className="guest-card">
              <h2 className="card-title">Guest Information</h2>
              <form onSubmit={handleSubmit} className="guest-form">
                <div className="form-grid">
                  <div className={'fg' + (errors.fullName ? ' fg-error' : '')}>
                    <label>Full Name</label>
                    <input value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} />
                    {errors.fullName && <span className="fg-msg">{errors.fullName}</span>}
                  </div>
                  <div className={'fg' + (errors.mobile ? ' fg-error' : '')}>
                    <label>Mobile</label>
                    <input type="tel" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} />
                    {errors.mobile && <span className="fg-msg">{errors.mobile}</span>}
                  </div>
                  <div className={'fg' + (errors.email ? ' fg-error' : '')}>
                    <label>Email</label>
                    <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                    {errors.email && <span className="fg-msg">{errors.email}</span>}
                  </div>
                  <div className={'fg' + (errors.adults ? ' fg-error' : '')}>
                    <label>Adults</label>
                    <input type="number" min="1" max="8" value={form.adults} onChange={e => setForm({...form, adults: +e.target.value})} />
                    {errors.adults && <span className="fg-msg">{errors.adults}</span>}
                  </div>
                  <div className="fg">
                    <label>Children</label>
                    <input type="number" min="0" max="6" value={form.children} onChange={e => setForm({...form, children: +e.target.value})} />
                  </div>
                  <div className={'fg' + (errors.guestType ? ' fg-error' : '')}>
                    <label>Guest Type</label>
                    <select value={form.guestType} onChange={e => setForm({...form, guestType: e.target.value})}>
                      {GUEST_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {errors.guestType && <span className="fg-msg">{errors.guestType}</span>}
                  </div>
                </div>
                <div className="fg" style={{gridColumn: '1 / -1'}}>
                  <label>Special Requests</label>
                  <textarea value={form.specialRequests} onChange={e => setForm({...form, specialRequests: e.target.value})} rows="3" />
                </div>
                <div className="fg" style={{gridColumn: '1 / -1'}}>
                  <label>ID Proof (optional)</label>
                  <select value={form.idProof} onChange={e => setForm({...form, idProof: e.target.value})}>
                    <option value="">None</option>
                    <option value="Aadhaar">Aadhaar</option>
                    <option value="Passport">Passport</option>
                    <option value="Driving Licence">Driving Licence</option>
                  </select>
                </div>
                <div className="fg" style={{gridColumn: '1 / -1'}}>
                  <label>ID Number (if applicable)</label>
                  <input value={form.idNumber} onChange={e => setForm({...form, idNumber: e.target.value})} />
                </div>
                <div style={{gridColumn: '1 / -1', marginTop: '10px'}}>
                  <button type="submit" className="btn-primary form-submit" disabled={submitting}>
                    {submitting ? 'Processing...' : 'Continue to Payment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <aside className="guest-right">
            <PriceSummary room={booking.room} checkIn={booking.checkIn} checkOut={booking.checkOut} />
          </aside>
        </div>
      </main>
      <Footer />
      <MemberToggle />
    </>
  );
}