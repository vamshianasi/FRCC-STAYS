import { Link } from 'react-router-dom';
import { routes } from '../../config/routes';
import './Logo.css';

export default function Logo({ light = false }) {
  return (
    <Link to={routes.home} className={'logo' + (light ? ' logo-light' : '')} aria-label="FRCC home">
      <span className="logo-mark">F</span>
      <span className="logo-text">
        <span className="logo-name">FRCC</span>
        <span className="logo-tag">CLUB · RESORT · SOCIETY</span>
      </span>
    </Link>
  );
}
