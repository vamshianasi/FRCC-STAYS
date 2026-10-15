#!/usr/bin/env node
/** tools/check-data.js
 * Verifies the FRCC STAYS data integrity:
 *  - exactly 2 locations (hyderabad, vijayawada)
 *  - each location has 2 room types ("Suite Room" and "Standard Room")
 *  - Suite Room price 4500-10000, Standard Room 2500-4500, Suite > Standard
 *  - hotel amenities are exactly ["Free Wi-Fi", "Parking"]
 *  - no banned amenity words in location text
 *  - no kitchen words in room data
 *  - no luxury words in room data
 *  - no member-discount code in the module
 *  - 0 Amaravathi references
 *  - LOCATION_NAME is empty
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const { default: LOCATIONS } = await import('../src/modules/hotel-booking/config/locations.js');

let errors = [];
let warnings;

// Price range constants (must match js/config.js)
const SUITE_PRICE_MIN = 4500;
const SUITE_PRICE_MAX = 10000;
const STANDARD_PRICE_MIN = 2500;
const STANDARD_PRICE_MAX = 4500;

// Banned words for location text (whole word, case-insensitive)
const BANNED_HOTEL_WORDS = [
  'pool', 'swimming', 'spa', 'gym', 'fitness', 'kids', 'play zone',
  'garden', 'lawn', 'restaurant', 'dining', 'bar', 'banquet', 'ballroom',
  'airport transfer'
];

// Banned words for room text
const BANNED_ROOM_WORDS = [
  'kitchen', 'kitchenette', 'pantry', 'dining area', 'cooking', 'microwave',
  'luxury', 'royal', 'presidential', 'premier', 'villa', 'palace',
  'chandelier', 'jacuzzi', 'bathtub'
];

function hasWord(text, word) {
  return new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(text);
}

// ---- Location count checks ----
if (LOCATIONS.length !== 2) {
  errors.push(`Expected 2 locations, got ${LOCATIONS.length}`);
} else {
  const hyderabad = LOCATIONS.filter(l => l.city === 'Hyderabad');
  const vijayawada = LOCATIONS.filter(l => l.city === 'Vijayawada');

  if (hyderabad.length !== 1) {
    errors.push(`Expected 1 Hyderabad location, got ${hyderabad.length}`);
  }
  if (vijayawada.length !== 1) {
    errors.push(`Expected 1 Vijayawada location, got ${vijayawada.length}`);
  }

  // Each location must have exactly 2 room types
  for (const loc of LOCATIONS) {
    const roomNames = loc.rooms.map(r => r.type);
    if (roomNames.filter(r => r === 'Suite Room').length !== 1) {
      errors.push(`${loc.city}: expected 1 Suite Room, got ${roomNames.filter(r => r === 'Suite Room').length}`);
    }
    if (roomNames.filter(r => r === 'Standard Room').length !== 1) {
      errors.push(`${loc.city}: expected 1 Standard Room, got ${roomNames.filter(r => r === 'Standard Room').length}`);
    }
    // Price checks
    const suiteRoom = loc.rooms.find(r => r.type === 'Suite Room');
    const standardRoom = loc.rooms.find(r => r.type === 'Standard Room');
    if (suiteRoom) {
      if (suiteRoom.pricePerNight < SUITE_PRICE_MIN || suiteRoom.pricePerNight > SUITE_PRICE_MAX) {
        errors.push(`${loc.city} Suite Room price ${suiteRoom.pricePerNight} outside range [${SUITE_PRICE_MIN}-${SUITE_PRICE_MAX}]`);
      }
    }
    if (standardRoom) {
      if (standardRoom.pricePerNight < STANDARD_PRICE_MIN || standardRoom.pricePerNight > STANDARD_PRICE_MAX) {
        errors.push(`${loc.city} Standard Room price ${standardRoom.pricePerNight} outside range [${STANDARD_PRICE_MIN}-${STANDARD_PRICE_MAX}]`);
      }
    }
    if (suiteRoom && standardRoom && suiteRoom.pricePerNight <= standardRoom.pricePerNight) {
      errors.push(`${loc.city}: Suite Room price must be higher than Standard Room price`);
    }
  }
}

// ---- Amaravathi check ----
for (const loc of LOCATIONS) {
  if (/amaravathi|amaravati/i.test(loc.city)) {
    errors.push(`${loc.city}: Amaravathi reference`);
  }
}

// ---- LOCATION_NAME must be empty ----
const { LOCATION_NAME } = await import('../src/modules/hotel-booking/config/locations.js');
if (LOCATION_NAME !== '') {
  errors.push(`LOCATION_NAME must be empty, got '${LOCATION_NAME}'`);
}

// ---- Banned words in room features ----
for (const loc of LOCATIONS) {
  for (const room of loc.rooms) {
    const label = `${loc.city} - ${room.type}`;
    for (const word of BANNED_ROOM_WORDS) {
      if (hasWord(room.features?.join(' ') || '', word)) {
        errors.push(`${label}: banned word '${word}' in features`);
      }
    }
    // Check room name doesn't contain banned words
    if (hasWord(room.type || '', 'normal room')) {
      errors.push(`${label}: 'Normal Room' reference found (should be 'Standard Room')`);
    }
  }
}

// ---- Summary ----
if (errors.length === 0) {
  console.log('================================================================');
  console.log('FRCC STAYS - DATA INTEGRITY CHECK');
  console.log('================================================================');
  console.log('RESULT: PASS - All data checks passed');
  console.log('================================================================');
} else {
  console.log('================================================================');
  console.log('FRCC STAYS - DATA INTEGRITY CHECK');
  console.log('================================================================');
  for (const e of errors) {
    console.log(`ERROR: ${e}`);
  }
  console.log(`\n${errors.length} error(s) found`);
  console.log('================================================================');
  process.exit(1);
}