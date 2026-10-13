import { isMember, MEMBER_DISCOUNT } from '../../config/member';
import { formatINR, nightsBetween } from '../../lib/format';
import './PriceSummary.css';

export default function PriceSummary({ room, checkIn, checkOut }) {
  const nights = Math.max(1, nightsBetween(checkIn, checkOut));
  const base = room.pricePerNight * nights;
  const memberDiscount = isMember ? Math.round(base * MEMBER_DISCOUNT) : 0;
  const subtotal = base - memberDiscount;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  return (
    <div className="price-summary">
      <h3 className="ps-title">Price summary</h3>
      <div className="ps-row">
        <span>{formatINR(room.pricePerNight)} × {nights} night{nights > 1 ? 's' : ''}</span>
        <span>{formatINR(base)}</span>
      </div>
      {isMember && memberDiscount > 0 && (
        <div className="ps-row ps-discount">
          <span>Member discount (30%)</span>
          <span>−{formatINR(memberDiscount)}</span>
        </div>
      )}
      <div className="ps-row">
        <span>GST (18%)</span>
        <span>{formatINR(gst)}</span>
      </div>
      {isMember && memberDiscount > 0 && (
        <div className="ps-row ps-save">
          <span>You save</span>
          <span>{formatINR(memberDiscount)}</span>
        </div>
      )}
      <div className="ps-divider" />
      <div className="ps-row ps-total">
        <span>Total</span>
        <span>{formatINR(total)}</span>
      </div>
    </div>
  );
}
