import { formatINR } from '../../lib/format';
import Gallery from '../common/Gallery';
import { availabilityForLocation, roomsLeft, stockMessage } from '../../lib/availability';
import { LOCATIONS, getLocation } from '../../config/locations';
import './RoomCard.css';

export default function RoomCard({ room, nights, checkIn, checkOut, onSelect }) {
  const hasDates = !!nights;
  const base = hasDates ? room.pricePerNight * nights : null;
  const location = getLocation(room.locationId || 'hyderabad');
  const availability = location ? availabilityForLocation(location, checkIn, checkOut) : [];
  const roomTypeAvailability = availability.find(r => r.type === room.name);
  const stock = roomTypeAvailability ? stockMessage(roomTypeAvailability) : null;

  return (
    <div className="room-card">
      <div className="room-card-top">
        <Gallery images={room.gallery} title={room.name} owner={room.id} />
        <div className="room-card-info">
          <h3 className="room-card-name">{room.name}</h3>
          <div className="room-card-meta">
            <span>{room.size} sq ft</span>
            <span>·</span>
            <span>{room.bed}</span>
            <span>·</span>
            <span>Up to {room.maxOccupancy} guests</span>
          </div>
        </div>
      </div>
      <div className="room-card-bottom">
        <div className="room-card-price">
          {hasDates ? (
            <>
              <span className="price-regular">{formatINR(base)}</span>
              <span className="price-unit">/{nights
                .toString()
                .padStart(2, '0')} night{nights > 1 ? 's' : ''}</span>
            </>
          ) : (
            <span className="price-pending">Select dates to see price</span>
          )}
        </div>
        {hasDates && (
          <div className="room-card-availability">
            {stock && <span className="stock-message">{stock}</span>}
            {roomTypeAvailability && !roomTypeAvailability.soldOut && (
              <button className="btn-primary" onClick={() => onSelect(room)}>
                Select Room
              </button>
            )}
            {roomTypeAvailability && roomTypeAvailability.soldOut && (
              <span className="sold-out">Sold out</span>
            )}
          </div>
        )}
        {!hasDates && (
          <button className="btn-primary" disabled>Select Room</button>
        )}
      </div>
    </div>
  );
}