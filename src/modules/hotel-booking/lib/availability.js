/**
 * Availability — rooms left per location, per room type, for chosen dates.
 *
 * Inventory is 20 Standard Rooms and 15 Suite Rooms per location. A booking
 * takes one room. Active bookings (confirmed / pay at venue) of the same room
 * type whose stay overlaps the chosen dates reduce the count. A cancelled
 * booking frees its room again. The other location is unaffected.
 */

import { STANDARD_INVENTORY, SUITE_INVENTORY } from '../config/locations.js';
import { loadBookings } from './storage.js';

/** Room types in the order the UI shows them. */
export const ROOM_TYPE_ORDER = ["Standard Room", "Suite Room"];

/**
 * Statuses that hold a room. "pending" is how a Pay at Venue booking is
 * stored, so it counts as active too. A cancelled booking frees its room.
 */
export const ACTIVE_STATUSES = ["confirmed", "pay_at_venue", "pending"];

export const INVENTORY_BY_TYPE = {
  "Standard Room": STANDARD_INVENTORY,
  "Suite Room": SUITE_INVENTORY,
};

/** True when two date ranges overlap (check-out day is not a stay night). */
export function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  const aS = new Date(aStart).getTime();
  const aE = new Date(aEnd).getTime();
  const bS = new Date(bStart).getTime();
  const bE = new Date(bEnd).getTime();
  if ([aS, aE, bS, bE].some(Number.isNaN)) return false;
  return aS < bE && bS < aE;
}

function bookingRoomType(booking) {
  return booking?.roomType || booking?.room?.name || null;
}

function bookingLocationId(booking) {
  if (booking?.locationId) return booking.locationId;
  // Legacy bookings stored the hotel; fall back so old data is never
  // mistaken for an active booking of the current locations.
  return null;
}

/** Bookings that actually hold a room. Exports are used by the check scripts. */
export function activeBookings(bookings) {
  return (bookings || []).filter(b => ACTIVE_STATUSES.includes(b?.status));
}

/**
 * How many rooms of this type are taken at this location for these dates.
 */
export function bookedRooms(locationId, roomType, checkIn, checkOut, bookings) {
  const list = bookings || loadBookings();
  return activeBookings(list).filter(b =>
    bookingLocationId(b) === locationId &&
    bookingRoomType(b) === roomType &&
    rangesOverlap(checkIn, checkOut, b.checkIn, b.checkOut)
  ).length;
}

/** Rooms still free for this type at this location on these dates. */
export function roomsLeft(locationId, roomType, checkIn, checkOut, bookings) {
  const inventory = INVENTORY_BY_TYPE[roomType] ?? 0;
  return Math.max(0, inventory - bookedRooms(locationId, roomType, checkIn, checkOut, bookings));
}

/**
 * Availability for every room type of a location.
 * Returns [{ type, inventory, roomsLeft, soldOut, lowStock }].
 */
export function availabilityForLocation(location, checkIn, checkOut, bookings) {
  const list = bookings || loadBookings();
  return (location?.rooms || []).map(room => {
    const roomsLeftN = roomsLeft(location.id, room.type, checkIn, checkOut, list);
    return {
      type: room.type,
      inventory: room.inventory,
      roomsLeft: roomsLeftN,
      soldOut: roomsLeftN === 0,
      lowStock: roomsLeftN > 0 && roomsLeftN <= 5,
    };
  });
}

/** Re-checks availability right before saving, so two bookings can never
 *  exceed the inventory. Returns { ok, roomsLeft }. */
export function checkAvailability(locationId, roomType, checkIn, checkOut, bookings) {
  const left = roomsLeft(locationId, roomType, checkIn, checkOut, bookings);
  return { ok: left > 0, roomsLeft: left };
}

/** "Only N rooms left!" / "Sold out" / null. */
export function stockMessage(state) {
  if (!state) return null;
  if (state.soldOut) return "Sold out";
  if (state.lowStock) return `Only ${state.roomsLeft} rooms left!`;
  return null;
}
