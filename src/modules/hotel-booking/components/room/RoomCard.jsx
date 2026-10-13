import { isMember, MEMBER_DISCOUNT } from '../../config/member';
import { formatINR } from '../../lib/format';
import Gallery from '../common/Gallery';
import './RoomCard.css';

export default function RoomCard({ room, nights, checkIn, checkOut, onSelect }) {
  const base = room.pricePerNight * nights;
  const memberPrice = isMember ? Math.round(base * (1 - MEMBER_DISCOUNT)) : null;

  return (
    <div className="room-card">
      <div className="room-card-top">
        <Gallery images={room.gallery} title={room.name} />
        <div className="room-card-info">
          <h3 className="room-card-name">{room.name}</h3>
          <div className="room-card-meta">
            <span>{room.size} sq ft</span>
            <span>·</span>
            <span>{room.bed}</span>
            <span>·</span>
            <span>Up to {room.maxOccupancy} guests</span>
          </div>
          <div className="room-card-amenities">
            {room.amenities.map(a => (
              <span key={a} className="amenity-tag">{a}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="room-card-bottom">
        <div className="room-card-price">
          {isMember && memberPrice && (
            <>
              <span className="price-member-tag">Member rate</span>
              <span className="price-orig">{formatINR(base)}</span>
              <span className="price-member">{formatINR(memberPrice)}</span>
            </>
          )}
          {!isMember && <span className="price-regular">{formatINR(base)}</span>}
          <span className="price-unit">/{nights} night{nights > 1 ? 's' : ''}</span>
        </div>
        <button className="btn-primary" onClick={() => onSelect(room)}>
          Select Room
        </button>
      </div>
    </div>
  );
}
