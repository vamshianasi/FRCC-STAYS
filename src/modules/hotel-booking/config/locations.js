/**
 * Stay locations config — the single source of truth for what FRCC STAYS books.
 *
 * There are exactly two locations (Hyderabad and Vijayawada). They are shown
 * by city name only: the building is still under construction, so no club or
 * hotel name exists yet. Do NOT add one without the owner's approval.
 */

import { FRCC_ADDRESSES } from './contact.js';

/**
 * Under construction: the name will be added when the building is finished.
 * While it is empty the UI shows the city only. Do not pre-fill it.
 */
export const LOCATION_NAME = "";

/** Room types. Exactly these two names, spelled exactly like this. */
export const ROOM_TYPES = {
  STANDARD: "Standard Room",
  SUITE: "Suite Room",
};

/**
 * Price ranges (per night, before GST). Every price in LOCATIONS must stay
 * inside the matching range.
 *
 * Confirm the GST rate for these room prices with the finance team.
 */
export const STANDARD_PRICE_MIN = 2500;
export const STANDARD_PRICE_MAX = 4500;
export const SUITE_PRICE_MIN = 4500;
export const SUITE_PRICE_MAX = 10000;

/** GST applied to the room total. 18% is the current setting.
 *  Confirm the GST rate for these room prices with the finance team. */
export const GST_RATE = 0.18;

/** Rooms of each type per location (identical rooms, no room numbers needed). */
export const STANDARD_INVENTORY = 20;
export const SUITE_INVENTORY = 15;

export const CHECK_IN_TIME = "2:00 PM";
export const CHECK_OUT_TIME = "11:00 AM";

/** Address lookup so locations never re-type the FRCC addresses. */
const addressFor = (city) => {
  const found = FRCC_ADDRESSES.find(a => a.city === city);
  if (!found) throw new Error(`No FRCC address configured for ${city}`);
  return found;
};

/** Room-type details, identical at both locations (only the price differs). */
const ROOM_DETAILS = {
  [ROOM_TYPES.STANDARD]: {
    type: ROOM_TYPES.STANDARD,
    /** size in sq ft (about 200 to 300) */
    size: { min: 260, max: 300 },
    sizeLabel: "260 – 300",
    bed: "Queen Bed or Twin Beds",
    beds: ["Queen Bed", "Twin Beds"],
    capacity: 3,
    capacityLabel: "Up to 3 guests (2 adults + 1 child)",
    maxAdults: 2,
    maxChildren: 1,
    maxOccupancy: 3,
    features: [
      "Work desk",
      "TV",
      "AC",
      "Tea/Coffee corner",
      "Attached washroom with shower",
    ],
  },
  [ROOM_TYPES.SUITE]: {
    type: ROOM_TYPES.SUITE,
    /** size in sq ft (about 350 to 550) */
    size: { min: 420, max: 520 },
    sizeLabel: "420 – 520",
    bed: "King Bed",
    beds: ["King Bed"],
    capacity: 4,
    capacityLabel: "Up to 4 guests",
    maxAdults: 4,
    maxChildren: 3,
    maxOccupancy: 4,
    features: [
      "Sitting area with sofa or armchairs",
      "Work desk",
      "TV",
      "AC",
      "Mini-bar",
      "Attached washroom with shower",
    ],
  },
};

function makeRooms(standardPrice, suitePrice, slug) {
  return [ROOM_TYPES.STANDARD, ROOM_TYPES.SUITE].map(type => {
    const detail = ROOM_DETAILS[type];
    const pricePerNight = type === ROOM_TYPES.STANDARD ? standardPrice : suitePrice;
    const inventory = type === ROOM_TYPES.STANDARD ? STANDARD_INVENTORY : SUITE_INVENTORY;
    return {
      ...detail,
      id: `${slug}-${type === ROOM_TYPES.STANDARD ? "standard" : "suite"}`,
      pricePerNight,
      inventory,
      galleryKey: `${slug}-${type === ROOM_TYPES.STANDARD ? "standard" : "suite"}`,
    };
  });
}

/**
 * The two stay locations. Order is the order used by the UI.
 * Addresses come from the footer contact config — never retyped.
 */
export const LOCATIONS = [
  {
    id: "hyderabad",
    city: "Hyderabad",
    name: LOCATION_NAME,
    amenities: ["Free Wi-Fi", "Parking"],
    checkIn: CHECK_IN_TIME,
    checkOut: CHECK_OUT_TIME,
    address: addressFor("Hyderabad").address,
    rooms: makeRooms(3499, 6999, "hyderabad"),
  },
  {
    id: "vijayawada",
    city: "Vijayawada",
    name: LOCATION_NAME,
    amenities: ["Free Wi-Fi", "Parking"],
    checkIn: CHECK_IN_TIME,
    checkOut: CHECK_OUT_TIME,
    address: addressFor("Vijayawada").address,
    rooms: makeRooms(2999, 5999, "vijayawada"),
  },
];

export const LOCATION_IDS = LOCATIONS.map(l => l.id);

export function getLocation(locationId) {
  return LOCATIONS.find(l => l.id === locationId) || null;
}

export function getLocationByCity(city) {
  return LOCATIONS.find(l => l.city === city) || null;
}

/** Room type details for a location. */
export function getRoom(locationId, roomType) {
  const loc = getLocation(locationId);
  return loc ? loc.rooms.find(r => r.type === roomType) || null : null;
}

/**
 * Display name for a location: the name only when it is set,
 * otherwise just the city.
 */
export function locationLabel(location) {
  if (!location) return "";
  return location.name ? `${location.city} — ${location.name}` : location.city;
}

/** "Stay in Hyderabad" style heading text (city only, no invented name). */
export function stayLabel(location) {
  if (!location) return "";
  return `Stay in ${location.city}`;
}

export default LOCATIONS;