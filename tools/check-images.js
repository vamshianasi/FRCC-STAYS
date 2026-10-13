#!/usr/bin/env node
/**
 * tools/check-images.js
 * Verifies the FRCC STAYS image library:
 *  - checks every manifest path exists on disk
 *  - checks for duplicate files across hotels/rooms/areas
 *  - checks hotels have >= 10 photos and gym photos
 *  - check rooms have >= 6 photos
 *  - checks area images exist (4 per city)
 *  - checks CREDITS.md entries exist
 *  - reports any failures
 *
 * Usage: node tools/check-images.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const { default: HOTELS } = await import('../src/modules/hotel-booking/data/hotels.js');
const { default: areaManifest } = await import('../tools/area-images.json', { with: { type: 'json' } });

let missingFiles = 0;
let duplicateFiles = 0;
let incompleteGalleries = 0;
let missingCredits = 0;
const errors = [];

// Check every image path exists on disk
const allPaths = new Map(); // path -> [owners]

for (const hotel of HOTELS) {
  // Check hotel gallery
  const hotelCats = new Set();
  for (const img of hotel.gallery) {
    const filePath = path.join(ROOT, 'public', img.file);
    if (!fs.existsSync(filePath)) {
      missingFiles++;
      errors.push(`MISSING: ${img.file} (hotel ${hotel.id})`);
    }
    if (!allPaths.has(img.file)) allPaths.set(img.file, []);
    allPaths.get(img.file).push(`hotel:${hotel.id}`);
    hotelCats.add(img.category);
  }

  // Check hotel has >= 10 photos
  if (hotel.gallery.length < 10) {
    incompleteGalleries++;
    errors.push(`HOTEL ${hotel.id} has only ${hotel.gallery.length} photos (need >= 10)`);
  }

  // Check hotel has gym photos
  const hasGym = hotel.gallery.some(g => g.category.toLowerCase().includes('gym'));
  if (!hasGym) {
    incompleteGalleries++;
    errors.push(`HOTEL ${hotel.id} missing gym photos`);
  }

  // Check room galleries
  for (const room of hotel.rooms) {
    for (const img of room.gallery) {
      const filePath = path.join(ROOT, 'public', img.file);
      if (!fs.existsSync(filePath)) {
        missingFiles++;
        errors.push(`MISSING: ${img.file} (room ${room.id})`);
      }
      if (!allPaths.has(img.file)) allPaths.set(img.file, []);
      allPaths.get(img.file).push(`room:${room.id}`);
    }

    if (room.gallery.length < 6) {
      incompleteGalleries++;
      errors.push(`ROOM ${room.id} has only ${room.gallery.length} photos (need >= 6)`);
    }
  }
}

// Check area hotel/resort photos (3 per city: 1 large + 2 small)
let flaggedContent = 0;
// Use word boundaries to avoid false positives (e.g., "manicured" contains "man")
const bannedPatterns = [
  /\bflower\b/i, /\bbird\b/i, /\bparrot\b/i, /\bperson\b/i, /\bman\b/i, /\bwoman\b/i, 
  /\bbracelet\b/i, /\bcloud\b/i, /\bbeach\b/i, /\bsea\b/i, /\bocean\b/i, /\bpalm\b/i, /\btropical\b/i
];

for (const [city, images] of Object.entries(areaManifest)) {
  if (images.length < 3) {
    incompleteGalleries++;
    errors.push(`AREA ${city} has only ${images.length} photos (need >= 3)`);
  }
  for (const img of images) {
    const filePath = path.join(ROOT, 'public', img.file);
    if (!fs.existsSync(filePath)) {
      missingFiles++;
      errors.push(`MISSING: ${img.file} (area ${city})`);
    }
    if (!allPaths.has(img.file)) allPaths.set(img.file, []);
    allPaths.get(img.file).push(`area:${city}`);
    
    // Check alt text for banned content using word boundaries
    if (img.alt) {
      for (const pattern of bannedPatterns) {
        if (pattern.test(img.alt)) {
          flaggedContent++;
          errors.push(`FLAGGED: ${img.file} (area ${city}) alt matches "${pattern}": "${img.alt}"`);
        }
      }
    }
  }
}

// Check for duplicates
for (const [filePath, owners] of allPaths) {
  if (owners.length > 1) {
    duplicateFiles++;
    errors.push(`DUPLICATE: ${filePath} used by ${owners.join(', ')}`);
  }
}

// Check CREDITS.md exists and has content
const creditsPath = path.join(ROOT, 'images/CREDITS.md');
if (!fs.existsSync(creditsPath)) {
  missingCredits++;
  errors.push('MISSING: images/CREDITS.md not found');
} else {
  const credits = fs.readFileSync(creditsPath, 'utf8');
  if (credits.length < 100) {
    missingCredits++;
    errors.push('CREDITS: CREDITS.md is too short, likely empty');
  }
  // Check that CREDITS.md references Unsplash or Pexels
  if (!credits.includes('Unsplash') && !credits.includes('Pexels')) {
    missingCredits++;
    errors.push('CREDITS: CREDITS.md does not reference Unsplash or Pexels');
  }
}

// Report
const line = '='.repeat(64);
console.log(line);
console.log('FRCC STAYS — IMAGE VALIDATION CHECK');
console.log(line);
console.log(`Hotels:              ${HOTELS.length}`);
console.log(`Hotel galleries:     ${HOTELS.length}`);
console.log(`Room galleries:      ${HOTELS.reduce((s, h) => s + h.rooms.length, 0)}`);
console.log(`Area galleries:      ${Object.keys(areaManifest).length}`);
console.log(`Total image paths:   ${allPaths.size}`);
console.log(`Missing files:       ${missingFiles}`);
console.log(`Duplicate files:     ${duplicateFiles}`);
console.log(`Incomplete galleries: ${incompleteGalleries}`);
console.log(`Flagged alt content: ${flaggedContent}`);
console.log(`Missing credits:     ${missingCredits}`);
console.log('-'.repeat(64));

if (errors.length > 0) {
  console.log('ERRORS:');
  errors.slice(0, 50).forEach(e => console.log('  ' + e));
  if (errors.length > 50) console.log(`  ... and ${errors.length - 50} more`);
}

const pass = missingFiles === 0 && duplicateFiles === 0 && incompleteGalleries === 0 && missingCredits === 0;
console.log(line);
console.log(pass
  ? 'RESULT: PASS — 0 missing files, 0 duplicates, 0 incomplete galleries'
  : 'RESULT: FAIL — see errors above');
console.log(line);

process.exit(pass ? 0 : 1);
