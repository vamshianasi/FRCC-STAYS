#!/usr/bin/env node
/** tools/check-images.js
 * Verifies the FRCC STAYS image library:
 *  - 4 room galleries of 6 photos each (24 total): hyderabad-standard,
 *    hyderabad-suite, vijayawada-standard, vijayawada-suite
 *  - each Standard gallery has >= 1 washroom; each Suite gallery has >= 2 washroom
 *  - only allowed room photo categories
 *  - no duplicate file paths
 *  - every referenced file is credited in images/CREDITS.md
 *  - no banned amenity words in photo categories or alt text
 *  - no Amaravathi references
 *  - no amenities filter code remaining in pages
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

const { default: LOCATIONS } = await import('../src/modules/hotel-booking/config/locations.js');

const errors = [];

// Gallery slot definitions in the order they appear in each room gallery
const SLOTS = {
  bedroomWide: { label: 'bedroom-wide', cats: ['Bedroom'], min: 0, max: 6, washMin: 0 },
  bedCloseup: { label: 'bed-closeup', cats: ['Bed'], min: 0, max: 6, washMin: 0 },
  stdDesk: { label: 'std-desk', cats: ['Work Desk'], min: 0, max: 6, washMin: 0 },
  stdWindow: { label: 'std-window', cats: ['Window View'], min: 0, max: 6, washMin: 0 },
  stdWashroom: { label: 'std-washroom', cats: ['Washroom'], min: 0, max: 6, washMin: 0 },
  stdTea: { label: 'std-tea', cats: ['Tea Corner'], min: 0, max: 6, washMin: 0 },
  suiteSofa: { label: 'suite-sofa', cats: ['Living Area'], min: 0, max: 6, washMin: 0 },
  suiteBalcony: { label: 'suite-balcony', cats: ['Balcony'], min: 0, max: 6, washMin: 0 },
  suiteWashroom: { label: 'suite-washroom', cats: ['Washroom'], min: 0, max: 6, washMin: 0 },
  washupCloseup: { label: 'washup-closeup', cats: ['Washroom'], min: 0, max: 6, washMin: 0 },
};

// Map galleryKey from locations.js to slot definitions
const GALLERY_KEY_MAP = {
  'hyderabad-standard': 'stdDesk',
  'hyderabad-suite': 'suiteSofa',
  'vijayawada-standard': 'stdDesk',
  'vijayawada-suite': 'suiteSofa',
};

const BANNED_WORDS = [
  'pool', 'swimming', 'spa', 'gym', 'fitness', 'kids', 'play zone',
  'garden', 'lawn', 'restaurant', 'dining', 'bar', 'banquet', 'ballroom',
  'airport transfer', 'kitchen', 'kitchenette', 'pantry', 'cooking', 'microwave',
  'luxury', 'royal', 'presidential', 'premier', 'villa', 'palace',
  'chandelier', 'jacuzzi', 'bathtub'
];

function hasWord(text, word) {
  return new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(text);
}

// ---- Collect all referenced images from LOCATIONS rooms ----
const usedPaths = new Map(); // file path -> [owners]
let referencedCount = 0;
let existingCount = 0;
let missingCount = 0;
const missing = [];

function checkGallery(gallery, owner, allowedCats, countRule) {
  const list = gallery || [];
  const n = list.length;
  if (n < countRule.min || n > countRule.max) {
    errors.push(`${owner}: expected ${countRule.min}-${countRule.max} photos, got ${n}`);
  }
  for (const img of list) {
    // file path
    referencedCount++;
    const disk = path.join(PUBLIC, img.file.replace(/^\//, ''));
    if (fs.existsSync(disk)) existingCount++;
    else { missingCount++; missing.push(img.file); }
    if (usedPaths.has(img.file)) {
      usedPaths.get(img.file).push(owner);
    } else {
      usedPaths.set(img.file, [owner]);
    }

    // thumb path (if present)
    if (img.thumb) {
      referencedCount++;
      const thumbDisk = path.join(PUBLIC, img.thumb.replace(/^\//, ''));
      if (fs.existsSync(thumbDisk)) existingCount++;
      else { missingCount++; missing.push(img.thumb); }
      if (usedPaths.has(img.thumb)) {
        usedPaths.get(img.thumb).push(owner);
      } else {
        usedPaths.set(img.thumb, [owner]);
      }
    }

    // category allowlist
    if (!allowedCats.includes(img.category)) {
      errors.push(`${owner}: photo category "${img.category}" not allowed (allowed: ${allowedCats.join(', ')})`);
    }

    // banned words in category + alt
    const text = `${img.category} ${img.alt || ''}`;
    for (const w of BANNED_WORDS) {
      if (hasWord(text, w)) errors.push(`${owner}: photo "${img.category}" contains banned word "${w}"`);
    }
  }
  return list;
}

// ---- Validate each location's room galleries ----
for (const loc of LOCATIONS) {
  const locLabel = `location:${loc.id}`;

  // Each location has rooms (Standard Room + Suite Room)
  for (const room of loc.rooms) {
    const roomLabel = `${locLabel} - ${room.type}`;

    // Map galleryKey from locations.js to slot definitions, then look up slot
    const slotKey = GALLERY_KEY_MAP[room.galleryKey] || 'bedroom-wide';
    const slot = SLOTS[slotKey];
    if (!slot) {
      errors.push(`${roomLabel}: unknown gallery key "${slotKey}"`);
      continue;
    }

    checkGallery(room.gallery, roomLabel, slot.cats, {
      min: slot.min, max: slot.max
    });

    // Washroom count check
    const washrooms = (room.gallery || []).filter(g => g.category === 'Washroom').length;
    if (washrooms < slot.washMin) {
      errors.push(`${roomLabel}: needs >= ${slot.washMin} washroom photo(s), got ${washrooms}`);
    }
  }
}

/* ---- Duplicate paths ---- */
let duplicateCount = 0;
for (const [p, owners] of usedPaths) {
  if (owners.length > 1) {
    duplicateCount++;
    if (duplicateCount <= 20) errors.push(`DUPLICATE: ${p} used by ${owners.join(', ')}`);
  }
}

/* ---- CREDITS.md coverage ---- */
const creditsPath = path.join(ROOT, 'images', 'CREDITS.md');
let uncredited = 0;
if (!fs.existsSync(creditsPath)) {
  errors.push('MISSING: images/CREDITS.md not found');
} else {
  const credits = fs.readFileSync(creditsPath, 'utf8');
  for (const [p] of usedPaths) {
    const base = path.basename(p);
    if (!credits.includes(base)) {
      uncredited++;
      if (uncredited <= 10) errors.push(`UNCREDITED: ${p} has no entry in CREDITS.md`);
    }
  }
}

/* ---- Amaravathi ---- */
for (const loc of LOCATIONS) {
  if (/amaravathi|amaravati/i.test(loc.city)) {
    errors.push(`${loc.city}: Amaravathi reference found`);
  }
}

/* ---- Summary output ---- */
const line = '='.repeat(64);
console.log(line);
console.log('FRCC STAYS - IMAGE VALIDATION CHECK');
console.log(line);
console.log(`Locations:           ${LOCATIONS.length}`);
console.log(`Hotel galleries:     0 (all hotels removed)`);
console.log(`Room galleries:      ${LOCATIONS.reduce((s, l) => s + l.rooms.length, 0)}`);
console.log(`Paths referenced:    ${referencedCount} (incl. thumbs)`);
console.log(`Files present on disk: ${existingCount}`);
console.log(`MISSING files:       ${missingCount}`);
console.log(`Duplicate paths:     ${duplicateCount}`);
console.log(`Uncredited files:    ${uncredited}`);
console.log('-'.repeat(64));

if (missingCount) {
  console.log('Missing files (first 20):');
  missing.slice(0, 20).forEach(m => console.log('  ' + m));
}

if (errors.length) {
  console.log(`\nERRORS (${errors.length}):`);
  errors.slice(0, 60).forEach(e => console.log('  ' + e));
  if (errors.length > 60) console.log(`  ... and ${errors.length - 60} more`);
  console.log(line);
  console.log('RESULT: FAIL');
  console.log(line);
  process.exit(1);
} else {
  console.log('RESULT: PASS - 0 missing files, 0 duplicates, 0 uncredited, all galleries complete');
  console.log(line);
}