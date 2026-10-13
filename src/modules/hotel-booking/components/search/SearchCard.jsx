import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../config/routes';
import './SearchCard.css';

const AREAS = ['Hyderabad', 'Vijayawada', 'Amaravathi'];

function fmtDate(d) {
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/');
}

function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export default function SearchCard() {
  const navigate = useNavigate();
  const today = new Date();
  const [area, setArea] = useState('');
  const [checkIn, setCheckIn] = useState(addDays(today, 7));
  const [checkOut, setCheckOut] = useState(addDays(today, 9));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!area) e.area = 'Please select an area';
    if (checkIn < today) e.checkIn = 'Check-in cannot be in the past';
    if (checkOut <= checkIn) e.checkOut = 'Check-out must be after check-in';
    if (adults < 1) e.adults = 'At least 1 adult required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    const state = {
      area,
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      adults,
      children
    };
    sessionStorage.setItem('frcc-search', JSON.stringify(state));
    navigate(routes.results, { state });
  }

  return (
    <div className="search-card">
      <div className="search-tabs">
        <button className="search-tab active" type="button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 18v-6a2 2 0 012-2h14a2 2 0 012 2v6M3 18h18M3 18v2m18-2v2M7 10V7a2 2 0 012-2h6a2 2 0 012 2v3"/></svg>
          Stay
        </button>
      </div>
      <div className="search-divider" />
      <form className="search-form" onSubmit={submit}>
        <div className={'field' + (errors.area ? ' field-error' : '')}>
          <label>Area</label>
          <div className="field-control">
            <svg className="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 21s-7-5.5-7-11a7 7 0 1114 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
            <select value={area} onChange={e => setArea(e.target.value)}>
              <option value="">Select area</option>
              {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          {errors.area && <span className="field-msg">{errors.area}</span>}
        </div>
        <div className={'field' + (errors.checkIn ? ' field-error' : '')}>
          <label>Check-in{checkIn && <> · {fmtDate(checkIn)}</>}</label>
          <div className="field-control">
            <svg className="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M3.5 10h17M8 3v4m8-4v4"/></svg>
            <input type="date" value={checkIn.toISOString().slice(0, 10)} onChange={e => setCheckIn(new Date(e.target.value))} />
          </div>
          {errors.checkIn && <span className="field-msg">{errors.checkIn}</span>}
        </div>
        <div className={'field' + (errors.checkOut ? ' field-error' : '')}>
          <label>Check-out{checkOut && <> · {fmtDate(checkOut)}</>}</label>
          <div className="field-control">
            <svg className="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M3.5 10h17M8 3v4m8-4v4"/></svg>
            <input type="date" value={checkOut.toISOString().slice(0, 10)} onChange={e => setCheckOut(new Date(e.target.value))} />
          </div>
          {errors.checkOut && <span className="field-msg">{errors.checkOut}</span>}
        </div>
        <div className={'field' + (errors.adults ? ' field-error' : '')}>
          <label>Adults</label>
          <div className="field-control">
            <svg className="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.5 3.5-5.5 7-5.5s6.2 2 7 5.5"/></svg>
            <input type="number" min="1" max="8" value={adults} onChange={e => setAdults(+e.target.value)} />
          </div>
          {errors.adults && <span className="field-msg">{errors.adults}</span>}
        </div>
        <div className="field">
          <label>Children</label>
          <div className="field-control">
            <svg className="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="7.5" r="3"/><path d="M6.5 21c.6-4 2.8-6 5.5-6s4.9 2 5.5 6"/></svg>
            <input type="number" min="0" max="6" value={children} onChange={e => setChildren(+e.target.value)} />
          </div>
        </div>
        <div className="field field-submit">
          <button type="submit" className="btn-primary search-submit">Check Availability</button>
        </div>
      </form>
      <p className="search-note">Free cancellation and instant confirmation details are shown on the booking page.</p>
    </div>
  );
}
