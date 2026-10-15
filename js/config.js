/**
 * FRCC STAYS - Central configuration (single source of truth).
 * Cancellation rule: a booking can be cancelled at any time up to
 * CANCELLATION_WINDOW_HOURS before the check-in moment.
 * Check-in moment = check-in date at CHECKIN_TIME in TIMEZONE (IST).
 * 
 * Pricing configuration:
 * - Suite Room: SUITE_PRICE_MIN to SUITE_PRICE_MAX
 * - Normal Room: NORMAL_PRICE_MIN to NORMAL_PRICE_MAX
 * - In the same hotel the Suite Room is always more expensive than the Normal Room.
 * - The hotel's "starting from" price is its Normal Room price.
 * - GST rate confirmed with finance team: 0.18 (18%)
 */
const CONFIG = {
  APP_NAME: 'FRCC STAYS',

  /** Cancellation window in hours before the check-in moment. */
  CANCELLATION_WINDOW_HOURS: 48,

  /** Hotel check-in time (24h, IST). */
  CHECKIN_TIME: '14:00',

  /** Hotel check-out time (24h, IST). */
  CHECKOUT_TIME: '11:00',

  /** All cancellation maths is anchored to IST. */
  TIMEZONE: 'Asia/Kolkata',

  /** GST applied to room rates. */
  GST_RATE: 0.18,

  /** Price ranges for room types. */
  SUITE_PRICE_MIN: 4500,
  SUITE_PRICE_MAX: 10000,
  NORMAL_PRICE_MIN: 2500,
  NORMAL_PRICE_MAX: 4500,

  /** Refund ETA text shown to guests (simulated). */
  REFUND_ETA: '5 to 7 working days'
};
