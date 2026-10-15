import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../config/routes';
import './SearchCard.css';

const AREAS = ['Hyderabad', 'Vijayawada'];

function toDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function todayStr() {
  return toDateStr(new Date());
}

function addDaysStr(dateStr, n) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return toDateStr(d);
}

function fmtDisplay(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

/**
 * SearchCard — area + dates + guests.
 *
 * No default values: check-in, check-out and adults start empty and are required.
 * `initial` is only supplied by the results page so it can show the values from
 * the previous search. The landing page renders <SearchCard /> with no initial
 * values, so the card is always empty on a fresh load or refresh.
 */
export default function SearchCard({ initial }) {
  const navigate = useNavigate();
  const init = initial || {};
  const [area, setArea] = useState(init.area || '');
  const [checkIn, setCheckIn] = useState(init.checkIn ? String(init.checkIn).slice(0, 10) : '');
  const [checkOut, setCheckOut] = useState(init.checkOut ? String(init.checkOut).slice(0, 10) : '');
  const [adults, setAdults] = useState(init.adults ? String(init.adults) : '');
  const [children, setChildren] = useState(init.children ? String(init.children) : '');
  const [errors, setErrors] = useState({});

  function handleCheckIn(value) {
    setCheckIn(value);
    // If the new check-in is on/after the chosen check-out, clear check-out.
    if (value && checkOut && checkOut <= value) setCheckOut('');
  }

  function validate() {
    const e = {};
    if (!area) e.area = 'Select area';
    if (!checkIn) e.checkIn = 'Select check-in date';
    else if (checkIn < todayStr()) e.checkIn = 'Check-in cannot be in the past';
    if (!checkOut) e.checkOut = 'Select check-out date';
    else if (checkIn && checkOut <= checkIn) e.checkOut = 'Check-out must be after check-in';
    if (!adults) e.adults = 'Select number of adults';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    const state = {
      area,
      checkIn: new Date(checkIn + 'T00:00:00').toISOString(),
      checkOut: new Date(checkOut + 'T00:00:00').toISOString(),
      adults: Number(adults),
      children: children ? Number(children) : 0
    };
    sessionStorage.setItem('frcc-search', JSON.stringify(state));
    navigate(routes.stayLocation, { state });
  }

  const checkOutMin = checkIn ? addDaysStr(checkIn, 1) : undefined;

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
          <label>Check-in{checkIn && <> · {fmtDisplay(checkIn)}</>}</label>
          <div className="field-control">
            <svg className="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M3.5 10h17M8 3v4m8-4v4"/></svg>
            <input
              type="date"
              value={checkIn}
              min={todayStr()}
              onChange={e => handleCheckIn(e.target.value)}
            />
          </div>
          {errors.checkIn && <span className="field-msg">{errors.checkIn}</span>}
        </div>

        <div className={'field' + (errors.checkOut ? ' field-error' : '')}>
          <label>Check-out{checkOut && <> · {fmtDisplay(checkOut)}</>}</label>
          <div className="field-control">
            <svg className="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M3.5 10h17M8 3v4m8-4v4"/></svg>
            <input
              type="date"
              value={checkOut}
              min={checkOutMin}
              disabled={!checkIn}
              onChange={e => setCheckOut(e.target.value)}
            />
          </div>
          {errors.checkOut && <span className="field-msg">{errors.checkOut}</span>}
        </div>

        <div className={'field' + (errors.adults ? ' field-error' : '')}>
          <label>Adults</label>
          <div className="field-control">
            <svg className="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.5 3.5-5.5 7-5.5s6.2 2 7 5.5"/></svg>
            <select value={adults} onChange={e => setAdults(e.target.value)}>
              <option value="">Select</option>
              {Array.from({ length: 10 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          {errors.adults && <span className="field-msg">{errors.adults}</span>}
        </div>

        <div className="field">
          <label>Children</label>
          <div className="field-control">
            <svg className="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="7.5" r="3"/><path d="M6.5 21c.6-4 2.8-6 5.5-6s4.9 2 5.5 6"/></svg>
            <select value={children} onChange={e => setChildren(e.target.value)}>
              <option value="">0</option>
              {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
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