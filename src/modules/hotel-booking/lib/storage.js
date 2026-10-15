// Explicit .js extensions so this module also loads in plain Node (tools/).
import { checkInInstant } from '../config/cancellation.js';
import { maskWhatsApp, toInternational } from './whatsappNumber.js';

const BOOKINGS_KEY = 'frcc-bookings';
// Bump to run the one-time data migration below again.
const DATA_VERSION = '2026-10-15-b4';
const VERSION_KEY = 'frcc-data-version';

/** The only room types that exist today. Anything else is old test data. */
export const CURRENT_ROOM_TYPES = ['Suite Room', 'Standard Room'];

/** Demo booking ids all start with this, so a re-seed replaces them. */
const DEMO_ID_PREFIX = 'FRCC-DEMO-';

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

/* ------------------------------------------------------------------ */
/* Demo bookings                                                       */
/* ------------------------------------------------------------------ */

/** ISO string of local midnight, in `offsetDays` days — same shape the
 *  search form stores, so dates never drift by a day. */
function isoDay(offsetDays) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString();
}

function findHotel(hotelId) {
  const hotel = HOTELS.find(h => h.id === hotelId);
  if (!hotel) throw new Error(`Unknown demo hotel: ${hotelId}`);
  return hotel;
}

function makeBooking({
  id, hotelId, roomName, inDays, nights,
  guest, paymentMethod, status, createdOffsetHours = 0,
  cancellation,
}) {
  const hotel = findHotel(hotelId);
  const room = hotel.rooms.find(r => r.name === roomName);
  if (!room) throw new Error(`Unknown demo room: ${hotelId} / ${roomName}`);

  const checkIn = isoDay(inDays);
  const checkOut = isoDay(inDays + nights);
  const base = room.pricePerNight * nights;
  const gst = Math.round(base * 0.18);
  const createdAt = new Date(Date.now() - createdOffsetHours * 3600000).toISOString();
  const checkInMoment = checkInInstant({ checkIn });

  return {
    id,
    hotel,
    room,
    checkIn,
    checkOut,
    adults: guest.adults,
    children: guest.children || 0,
    guestName: guest.name,
    mobile: guest.mobile,
    email: guest.email,
    guestType: 'adult',
    specialRequests: '',
    whatsappCode: guest.whatsappCode,
    whatsappNumber: toInternational(guest.whatsappCode, guest.whatsapp),
    whatsappNumberMasked: maskWhatsApp(guest.whatsappCode, guest.whatsapp),
    whatsappConsent: true,
    idProof: 'aadhaar',
    idProofLabel: 'Aadhaar Card',
    idNumberMasked: 'XXXX XXXX 1232',
    paymentMethod,
    status,
    base,
    gst,
    total: base + gst,
    createdAt,
    cancellationDeadline: checkInMoment
      ? new Date(checkInMoment.getTime() - 48 * 3600000).toISOString()
      : null,
    ...(cancellation || {}),
  };
}

/**
 * The five demo bookings: three Upcoming (one of them inside the 48-hour
 * lock), one Completed and one Cancelled. Hyderabad and Vijayawada hotels,
 * current room types only, prices taken from the room data.
 */
export function buildDemoBookings() {
  return [
    makeBooking({
      id: 'FRCC-DEMO-4101',
      locationId: 'hyderabad', roomType: 'Suite Room',
      inDays: 10, nights: 2,
      guest: { name: 'Asha Rao', mobile: '+91 9876543210', email: 'asha.rao@example.com', adults: 2, whatsappCode: '+91', whatsapp: '9876543210' },
      paymentMethod: 'UPI', status: 'confirmed',
      createdOffsetHours: 26,
    }),
    makeBooking({
      id: 'FRCC-DEMO-4102',
      locationId: 'vijayawada', roomType: 'Standard Room',
      inDays: 3, nights: 1,
      guest: { name: 'Ravi Kumar', mobile: '+91 9812345678', email: 'ravi.kumar@example.com', adults: 1, whatsappCode: '+91', whatsapp: '9812345678' },
      paymentMethod: 'Debit Card', status: 'confirmed',
      createdOffsetHours: 20,
    }),
    makeBooking({
      id: 'FRCC-DEMO-4103',
      locationId: 'hyderabad', roomType: 'Standard Room',
      inDays: 1, nights: 2,
      guest: { name: 'Meera Nair', mobile: '+91 9701122334', email: 'meera.nair@example.com', adults: 2, children: 1, whatsappCode: '+91', whatsapp: '9701122334' },
      paymentMethod: 'Pay at Venue', status: 'pending',
      createdOffsetHours: 12,
    }),
    makeBooking({
      id: 'FRCC-DEMO-4104',
      locationId: 'vijayawada', roomType: 'Suite Room',
      inDays: -9, nights: 2,
      guest: { name: 'Suresh Menon', mobile: '+91 9654321098', email: 'suresh.menon@example.com', adults: 2, whatsappCode: '+91', whatsapp: '9654321098' },
      paymentMethod: 'UPI', status: 'confirmed',
      createdOffsetHours: 260,
    }),
    makeBooking({
      id: 'FRCC-DEMO-4105',
      locationId: 'hyderabad', roomType: 'Standard Room',
      inDays: 6, nights: 2,
      guest: { name: 'Lakshmi Prasad', mobile: '+91 9000011223', email: 'lakshmi.prasad@example.com', adults: 2, whatsappCode: '+91', whatsapp: '9000011223' },
      paymentMethod: 'Net Banking', status: 'Cancelled',
      createdOffsetHours: 60,
      cancellation: {
        cancelledAt: new Date(Date.now() - 30 * 3600000).toISOString(),
        cancellationReason: 'Plans changed',
        cancellationId: 'CAN-DEMO-4105',
      },
    }),
  ];
}

/* ------------------------------------------------------------------ */
/* One-time migration                                                  */
/* ------------------------------------------------------------------ */

/**
 * Drops saved bookings whose room type no longer exists (old test data such
 * as "Deluxe Room") plus any demo bookings seeded by an earlier run, keeps
 * every real booking untouched, then re-seeds the demo bookings.
 *
 * Returns a summary so the caller can report what was removed.
 */
export function migrateBookings() {
  const existing = loadBookings();
  // Keep bookings that use new locations and room types only
  const kept = existing.filter(b =>
    b?.locationId && (b.locationId === 'hyderabad' || b.locationId === 'vijayawada') &&
    b?.roomType && (b.roomType === 'Standard Room' || b.roomType === 'Suite Room')
  );
  const staleDemo = kept.filter(b => String(b.id || '').startsWith(DEMO_ID_PREFIX));
  const realBookings = kept.filter(b => !String(b.id || '').startsWith(DEMO_ID_PREFIX));
  // Build fresh demo bookings with new locations/room types
  const seeded = buildDemoBookings();
  saveBookings([...realBookings, ...seeded]);
  return {
    before: existing.length,
    removed: existing.length - kept.length - staleDemo.length, // old test bookings
    replacedDemo: staleDemo.length,
    kept: realBookings.length,
    seeded: seeded.length,
    after: realBookings.length + seeded.length,
  };
}

/** Runs the migration once per data version. */
export function ensureDataVersion() {
  try {
    if (localStorage.getItem(VERSION_KEY) === DATA_VERSION) return null;
    const result = migrateBookings();
    localStorage.setItem(VERSION_KEY, DATA_VERSION);
    if (result.removed > 0 || result.replacedDemo > 0) {
      console.info(
        `[FRCC] bookings migrated: ${result.removed} old test booking(s) removed ` +
        `(room types outside ${CURRENT_ROOM_TYPES.join(' / ')}), ` +
        `${result.replacedDemo} previous demo booking(s) replaced, ` +
        `${result.seeded} demo bookings seeded.`
      );
    }
    return result;
  } catch {
    /* storage unavailable */
    return null;
  }
}

export function addBooking(id, booking) {
  const all = loadBookings();
  const created = { ...booking, id };
  all.push(created);
  saveBookings(all);
  return created;
}

export function updateBooking(bookingId, patch) {
  const all = loadBookings();
  const idx = all.findIndex(b => b.id === bookingId);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...patch };
  saveBookings(all);
  return all[idx];
}

export function cancelBooking(bookingId, reason) {
  const now = new Date();
  const ymd = now.getFullYear() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return updateBooking(bookingId, {
    status: 'Cancelled',
    cancelledAt: now.toISOString(),
    cancellationReason: reason,
    cancellationId: 'CAN-' + ymd + '-' + rand
  });
}