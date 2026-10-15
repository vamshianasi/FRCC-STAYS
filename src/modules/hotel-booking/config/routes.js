// Central route definitions. Teammates' pages (/, /facilities, etc.) are placeholders.
export const routes = {
  home: '/',
  stay: '/book/hotel',
  facilities: '/facilities',
  activities: '/book/activities',
  membership: '/membership',
  hall: '/book/hall',
  parking: '/book/parking',
  hotelBooking: '/book/hotel',
  // Location-based stay page (replaces old hotel-specific routes)
  stayLocation: '/book/hotel/stay/:locationId',
  // Old routes redirected to root (no hotel IDs or results)
  results: '/',
  hotelDetails: '/book/hotel',
  guestDetails: '/book/hotel/details',
  payment: '/book/hotel/payment',
  confirmation: '/book/hotel/confirmation/:bookingId',
  myBookings: '/book/hotel/my-bookings'
};