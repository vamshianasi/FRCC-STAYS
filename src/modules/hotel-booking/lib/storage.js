const BOOKINGS_KEY = 'frcc-bookings';

export function loadBookings() {
  try {
    return JSON.parse(localStorage.getItem(BOOKINGS_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveBookings(bookings) {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

export function addBooking(id, booking) {
  const all = loadBookings();
  all.push({ ...booking, id });
  saveBookings(all);
  return booking;
}

export function cancelBooking(bookingId, reason) {
  const all = loadBookings();
  const idx = all.findIndex(b => b.id === bookingId);
  if (idx === -1) return null;
  all[idx] = {
    ...all[idx],
    status: 'Cancelled',
    cancelledAt: new Date().toISOString(),
    cancellationReason: reason,
    cancellationId: 'CAN-' + new Date().getFullYear() + String(new Date().getMonth() + 1).padStart(2, '0') + String(new Date().getDate()).padStart(2, '0') + '-' + Math.random().toString(36).slice(2, 6).toUpperCase()
  };
  saveBookings(all);
  return all[idx];
}
