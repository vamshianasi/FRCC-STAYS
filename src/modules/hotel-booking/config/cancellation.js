/**
 * Single source of truth for the cancellation window.
 *
 * The rule: free cancellation is allowed until 48 hours before check-in.
 * Check-in is always 2:00 PM IST on the check-in DATE.
 *
 * The check-in instant is built from the calendar date plus a fixed IST
 * offset (UTC+05:30) instead of `setHours()` on a local Date. Using the
 * browser's own time zone shifts the check-in instant by up to a full day
 * (the stored ISO string is local midnight, so a machine behind or ahead of
 * IST can land on the previous or next calendar day), which can wrongly
 * disable cancellation for a booking that is still inside the window.
 *
 * The confirmation page and My Bookings both call this one helper.
 */

// 2:00 PM IST, expressed in UTC minutes for Date.UTC().
const CHECK_IN_HOUR_IST = 14;
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000; // UTC+05:30, no daylight saving
export const CANCELLATION_HOURS = 48;
export const CHECK_IN_HOUR = CHECK_IN_HOUR_IST; // 2:00 PM IST

/** The check-in date (Y, M, D) exactly as the guest booked it. */
export function checkInDateParts(booking) {
  const raw = booking?.checkIn;
  if (!raw) return null;

  // A plain "YYYY-MM-DD" value is already the intended calendar date.
  if (typeof raw === 'string') {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim());
    if (m) return { year: +m[1], month: +m[2] - 1, day: +m[3] };
  }

  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;
  // Stored as an ISO string of local midnight, so the local calendar date is
  // the date the guest picked.
  return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate() };
}

/** The exact check-in moment (2:00 PM IST) as a Date, or null if unknown. */
export function checkInInstant(booking) {
  const parts = checkInDateParts(booking);
  if (!parts) return null;
  const { year, month, day } = parts;
  return new Date(Date.UTC(year, month, day, CHECK_IN_HOUR_IST, 0, 0) - IST_OFFSET_MS);
}

export function getCancellationStatus(booking) {
  if (!booking || booking.status === 'Cancelled') {
    return { allowed: false, deadline: null, hoursLeft: 0, reason: 'Booking is already cancelled.' };
  }

  const checkIn = checkInInstant(booking);
  if (!checkIn) {
    return {
      allowed: false,
      deadline: null,
      hoursLeft: 0,
      reason: 'Cancellation is allowed only up to 48 hours before check-in.'
    };
  }

  const deadline = new Date(checkIn.getTime() - CANCELLATION_HOURS * 3600000);
  const now = new Date();
  const hoursLeft = Math.floor((deadline - now) / 3600000);

  if (now >= deadline) {
    return {
      allowed: false,
      deadline,
      hoursLeft: 0,
      reason: 'Cancellation is allowed only up to 48 hours before check-in.'
    };
  }
  return { allowed: true, deadline, hoursLeft, reason: null };
}

/** The muted note shown under the buttons when cancellation is not allowed. */
export const CANCELLATION_NOTE = 'Cancellation is allowed only up to 48 hours before check-in.';