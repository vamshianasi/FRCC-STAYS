import { Link } from 'react-router-dom';
import Logo from './Logo';
import { routes } from '../../config/routes';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-col footer-brand">
          <Logo light />
          <p className="footer-desc">
            A private club resort offering rooms, halls, parking and activities
            across Hyderabad, Vijayawada and Amaravathi.
          </p>
          <div className="social-row">
            <a href="#" aria-label="Facebook" className="social-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.3 0-1.1-.1-2.1-.1-2.1 0-3.6 1.3-3.6 3.7V11H8.3v3h2.4v7h2.8z"/></svg>
            </a>
            <a href="#" aria-label="Instagram" className="social-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>
            </a>
            <a href="#" aria-label="Twitter" className="social-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.8 4h2.7l-6 6.8L21.5 20h-5.5l-4.3-5.6L6.7 20H4l6.4-7.3L3.7 4h5.7l3.9 5.1L17.8 4zm-1 14.3h1.5L8.9 5.6H7.3l9.5 12.7z"/></svg>
            </a>
            <a href="#" aria-label="LinkedIn" className="social-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6.9 8.6H4V20h2.9V8.6zM5.4 7.3a1.7 1.7 0 100-3.4 1.7 1.7 0 000 3.4zM9.5 20h2.9v-5.7c0-.3 0-.6.1-.8.2-.6.7-1.2 1.5-1.2 1.1 0 1.5.8 1.5 2V20h2.9v-6.1c0-2.6-1.4-3.8-3.2-3.8-1.5 0-2.1.8-2.5 1.4V8.6H9.5V20z"/></svg>
            </a>
          </div>
        </div>
        <div className="footer-col">
          <h4 className="footer-title">Quick links</h4>
          <Link to={routes.hotelBooking} className="footer-link">Hotel Booking</Link>
          <Link to={routes.myBookings} className="footer-link">My Bookings</Link>
        </div>
        <div className="footer-col">
          <h4 className="footer-title">Support</h4>
          <a href="#" className="footer-link">Help Centre</a>
          <a href="#" className="footer-link">Cancellation Policy</a>
          <a href="#" className="footer-link">Contact Concierge</a>
        </div>
        <div className="footer-col">
          <h4 className="footer-title">Contact</h4>
          <p className="footer-text">FRCC Club Resort, Banjara Hills Road 12, Hyderabad 500034</p>
          <p className="footer-text">+91 40 0000 0000</p>
          <p className="footer-text">stay@frcc.club</p>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© 2026 FRCC. All rights reserved.</span>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Accessibility</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
