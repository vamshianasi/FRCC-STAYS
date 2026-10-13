import { Link } from 'react-router-dom';
import { routes } from '../../config/routes';
import './Hero.css';

export default function Hero({ title, crumbs, className }) {
  return (
    <div className={`hero-band${className ? ` ${className}` : ''}`}>
      <div className="container">
        <nav className="hero-breadcrumb" aria-label="Breadcrumb">
          {crumbs.map((c, i) => (
            <span key={i} className="crumb-wrap">
              {c.to ? <Link to={c.to} className="crumb">{c.label}</Link> : <span className="crumb crumb-current">{c.label}</span>}
              {i < crumbs.length - 1 && <span className="crumb-sep">›</span>}
            </span>
          ))}
        </nav>
        <h1 className="hero-title">{title}</h1>
        <p className="hero-subtitle">Rooms by wing and view, with member rates on every stay.</p>
      </div>
    </div>
  );
}
