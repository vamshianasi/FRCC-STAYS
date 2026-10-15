import { formatINR, nightsBetween } from '../../lib/format';
import './PriceSummary.css';

export default function PriceSummary({ room, checkIn, checkOut }) {
  const nights = Math.max(1, nightsBetween(checkIn, checkOut));
  const base = room.pricePerNight * nights;
  const gst = Math.round(base * 0.18);
  const total = base + gst;

  return (
    <div className="price-summary">
      <h3 className="ps-title">Price summary</h3>
      <div className="ps-row">
        <span>{formatINR(room.pricePerNight)} × {nights} night{nights > 1 ? 's' : ''}</span>
        <span>{formatINR(base)}</span>
      </div>
      <div className="ps-row">
        <span>GST (18%)</span>
        <span>{formatINR(gst)}</span>
      </div>
      <div className="ps-divider" />
      <div className="ps-row ps-total">
        <span>Total</span>
        <span>{formatINR(total)}</span>
      </div>
    </div>
  );
}