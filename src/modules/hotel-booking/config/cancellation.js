// Single source of truth for the cancellation window.
export const CANCELLATION_HOURS = 48;
export const CHECK_IN_HOUR = 14; // 2:00 PM IST

export function getCancellationStatus(booking) {
  if (!booking || booking.status === 'Cancelled') {
    return { allowed: false, deadline: null, hoursLeft: 0, reason: 'Booking is already cancelled.' };
  }
  const checkIn = new Date(booking.checkIn);
  checkIn.setHours(CHECK_IN_HOUR, 0, 0, 0);
  const deadline = new Date(checkIn.getTime() - CANCELLATION_HOURS * 3600000);
  const now = new Date();
  const hoursLeft = Math.floor((deadline - now) / 3600000);

  if (now >= deadline) {
    return {
      allowed: false,
      deadline,
      hoursLeft: 0,
      reason: 'Cancellation is allowed only up to 48 hours before check-in'
    };
  }
  return { allowed: true, deadline, hoursLeft, reason: null };
}
