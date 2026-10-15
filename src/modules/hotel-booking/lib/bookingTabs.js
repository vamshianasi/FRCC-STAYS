/**
 * My Bookings tabs: Upcoming, Completed, Cancelled.
 *
 * TABS is the single source of truth for the tab names, order and the
 * matching filter. There is no "Booked" tab.
 *
 *  Upcoming  = status confirmed or pay_at_venue, and check-out has not passed
 *  Completed = not cancelled and check-out has passed
 *  Cancelled = status cancelled
 */

export const TABS = ['Upcoming', 'Completed', 'Cancelled'];

export const DEFAULT_TAB = 'Upcoming';

export function isCancelled(booking) {
  return !!booking && (booking.status === 'Cancelled' || !!booking.cancelledAt);
}

/** Check-out has passed (end of the check-out day). */
export function hasCheckedOut(booking) {
  if (!booking?.checkOut) return false;
  const out = new Date(booking.checkOut);
  if (Number.isNaN(out.getTime())) return false;
  // Treat the check-out day as over at 11:00 AM (hotel check-out time).
  out.setHours(11, 0, 0, 0);
  return new Date() >= out;
}

/** Returns the tab a booking belongs to. */
export function tabForBooking(booking) {
  if (isCancelled(booking)) return 'Cancelled';
  const upcoming = booking?.status === 'confirmed' || booking?.status === 'pay_at_venue';
  if (upcoming && !hasCheckedOut(booking)) return 'Upcoming';
  if (!isCancelled(booking) && hasCheckedOut(booking)) return 'Completed';
  // Anything else that is neither cancelled nor past its stay stays upcoming.
  return 'Upcoming';
}

/** Filters a list into one tab. */
export function filterByTab(bookings, tab) {
  return (bookings || []).filter(b => tabForBooking(b) === tab);
}

/** Counts for every tab, in tab order. */
export function tabCounts(bookings) {
  const counts = {};
  for (const tab of TABS) counts[tab] = 0;
  for (const b of bookings || []) {
    const t = tabForBooking(b);
    counts[t] = (counts[t] || 0) + 1;
  }
  return counts;
}

/**
 * Orders a tab's bookings: newest first, so a new booking is at the top of
 * Upcoming straight away.
 */
export function sortBookings(bookings) {
  return [...(bookings || [])].sort((a, b) => {
    const ta = new Date(a.createdAt || 0).getTime();
    const tb = new Date(b.createdAt || 0).getTime();
    return tb - ta;
  });
}