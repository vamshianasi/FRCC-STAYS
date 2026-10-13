import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { routes } from '../../config/routes';
import { currentUser } from '../../auth/currentUser';
import './Header.css';

const bookItems = [
  { label: 'Hotel', to: routes.hotelBooking, active: true },
  { label: 'Hall', to: routes.hall },
  { label: 'Parking', to: routes.parking },
  { label: 'Activities', to: routes.activities },
  { label: 'My Bookings', to: routes.myBookings }
];

export default function Header() {
  const [bookOpen, setBookOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const bookRef = useRef(null);
  const avatarRef = useRef(null);

  const onHotelPage = location.pathname.startsWith('/book/hotel');

  useEffect(() => {
    function onClick(e) {
      if (bookRef.current && !bookRef.current.contains(e.target)) setBookOpen(false);
      if (avatarRef.current && !avatarRef.current.contains(e.target)) setAvatarOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => { setMobileOpen(false); setBookOpen(false); setAvatarOpen(false); }, [location.pathname]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />
        <button
          className={'hamburger' + (mobileOpen ? ' is-open' : '')}
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
        <nav className={'main-nav' + (mobileOpen ? ' nav-open' : '')}>
          <NavLink to={routes.home} end className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Home</NavLink>
          <NavLink to={routes.facilities} className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Facilities</NavLink>
          <NavLink to={routes.activities} className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Activities</NavLink>
          <div className="nav-dropdown" ref={bookRef}>
            <button
              className={'nav-link nav-dropdown-toggle' + (onHotelPage ? ' active' : '')}
              onClick={() => setBookOpen(v => !v)}
            >
              Book
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
            {bookOpen && (
              <div className="dropdown-menu">
                {bookItems.map(item => (
                  <Link key={item.label} to={item.to} className={'dropdown-item' + (item.active && onHotelPage ? ' dropdown-item-active' : '')}>
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <NavLink to={routes.membership} className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Membership</NavLink>
          <div className="avatar-wrap" ref={avatarRef}>
            <button className="avatar" onClick={() => setAvatarOpen(v => !v)} aria-label="Account">
              {currentUser.initial}
            </button>
            {avatarOpen && (
              <div className="dropdown-menu dropdown-menu-right">
                <Link to={routes.myBookings} className="dropdown-item">My Bookings</Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
