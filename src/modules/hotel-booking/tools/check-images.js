#!/usr/bin/env node
// tools/check-images.js
// Validates local image files referenced in hotels.js and rooms data.
// Checks: duplicates, missing files, required category coverage.

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..', '..', '..', '..');
const HOTELS_SRC = path.join(ROOT, 'src/modules/hotel-booking/data/hotels.js');
const IMG_BASE = path.join(ROOT, 'public/images');

async function loadHotels() {
  const mod = await import(pathToFileURL(HOTELS_SRC).href);
  return mod.default;
}

function checkExists(url) {
  const full = path.join(ROOT, 'public', url);
  return fs.existsSync(full);
}

async function main() {
  const hotels = await loadHotels();
  const allUrls = [];
  const byGallery = [];
  const requiredHotelCats = ['Exterior', 'Lobby', 'Pool', 'Restaurant', 'Kids Zone', 'Park', 'Banquet Hall', 'Parking'];
  const requiredRoomCats = ['Bedroom', 'Bed', 'Living Area', 'Kitchen', 'Balcony', 'Washroom'];

  let total = 0, missing = 0, dupCount = 0, incomplete = 0;
  const seen = new Map();

  for (const h of hotels) {
    // Hotel gallery
    const hUrls = (h.gallery || []).map(g => g.file);
    byGallery.push({ id: h.id, kind: 'hotel', urls: hUrls });
    allUrls.push(...hUrls);
    hUrls.forEach(u => {
      if (seen.has(u)) { console.log('DUP:', u, 'used by', seen.get(u), 'and', `hotel ${h.id}`); dupCount++; }
      else seen.set(u, `hotel ${h.id}`);
      if (!checkExists(u)) { console.log('MISSING:', u); missing++; }
    });
    const hCats = new Set((h.gallery || []).map(g => g.category));
    const missH = ['Exterior', 'Lobby', 'Pool', 'Restaurant', 'Kids Zone', 'Park', 'Banquet Hall', 'Parking'].filter(c => !hCats.has(c));
    if (missH.length) { console.log('HOTEL INCOMPLETE:', h.id, 'missing', missH.join(', ')); incomplete++; }

    for (const r of h.rooms) {
      const rUrls = (r.gallery || []).map(g => g.file);
      byGallery.push({ id: r.id, kind: 'room', urls: rUrls });
      allUrls.push(...rUrls);
      rUrls.forEach(u => {
        if (seen.has(u)) { console.log('DUP:', u, 'used by', seen.get(u), 'and', `room ${r.id}`); dupCount++; }
        else seen.set(u, `room ${r.id}`);
        if (!checkExists(u)) { console.log('MISSING:', u); missing++; }
      });
      const rCats = new Set((r.gallery || []).map(g => g.category));
      const missR = ['Bedroom', 'Bed', 'Living Area', 'Kitchen', 'Balcony', 'Washroom'].filter(c => !rCats.has(c));
      if (missR.length) { console.log('ROOM INCOMPLETE:', r.id, 'missing', missR.join(', ')); incomplete++; }
    }
  }

  console.log('================================================');
  console.log('FRCC HOTEL BOOKING — IMAGE CHECK');
  console.log('================================================');
  console.log('Hotels:', hotels.length);
  console.log('Room galleries:', hotels.reduce((s, h) => s + h.rooms.length, 0));
  console.log('Total image slots:', allUrls.length);
  console.log('Unique image URLs:', new Set(allUrls).size);
  console.log('Duplicates:', dupCount);
  console.log('Missing files:', missing);
  console.log('Incomplete galleries:', incomplete);
  console.log('================================================');
  if (dupCount === 0 && missing === 0 && incomplete === 0) {
    console.log('RESULT: PASS — 0 duplicates, 0 missing files, 0 incomplete galleries');
    process.exit(0);
  } else {
    console.log('RESULT: FAIL');
    process.exit(1);
  }
}

main();