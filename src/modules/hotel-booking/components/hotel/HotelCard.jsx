import { Link } from 'react-router-dom';
import { routes } from '../../config/routes';
import { formatINR } from '../../lib/format';
import SmartImage from '../common/SmartImage';
import './HotelCard.css';

export default function HotelCard({ hotel }) {
  const cover = hotel.gallery.find(g => g.category === 'Exterior') || hotel.gallery[0];
  return (
    <Link to={routes.hotelDetails.replace(':hotelId', hotel.id)} className="hotel-card">
      <div className="hotel-card-img">
        <SmartImage src={cover.file} alt={cover.alt} className="hotel-card-cover" />
        <span className="hotel-card-stars">{'★'.repeat(hotel.stars)}</span>
      </div>
      <div className="hotel-card-body">
        <h3 className="hotel-card-name">{hotel.name}</h3>
        <p className="hotel-card-loc">{hotel.locality}, {hotel.area}</p>
        <div className="hotel-card-amenities">
          {hotel.amenities.slice(0, 4).map(a => (
            <span key={a} className="amenity-tag">{a}</span>
          ))}
        </div>
        <div className="hotel-card-price">
          <span className="price-from">from</span>
          <span className="price-val">{formatINR(hotel.priceFrom)}</span>
          <span className="price-unit">/ night</span>
        </div>
      </div>
    </Link>
  );
}
