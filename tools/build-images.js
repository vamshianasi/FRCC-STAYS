#!/usr/bin/env node
/**
 * tools/build-images.js
 * Regenerates js/data/images.js from the curated Pexels photo pool
 * (tools/pexels-pool.json — harvested from live Pexels searches with alt text).
 *
 * Guarantees:
 *  - Category match: every gallery slot gets a photo of the right kind
 *    (exterior/lobby/pool/spa/restaurant/ballroom for hotels;
 *     bedroom/bath/desk/balcony for rooms; living/villa for suites).
 *  - Suites look more luxurious than deluxe rooms (villa/living pools).
 *  - GLOBALLY UNIQUE: no photo id is used twice anywhere in the library.
 *  - People-heavy alts are filtered out (no posed people).
 *  - Every chosen URL is HEAD-verified (HTTP 200) before writing; failures
 *    are swapped for the next candidate and re-checked.
 *  - All images served at 1200x800 landscape (server-side crop by Pexels).
 *
 * Run: node tools/build-images.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const POOL_FILE = path.join(__dirname, 'pexels-pool.json');
const OUT_FILE = path.join(ROOT, 'js/data/images.js');
const CONC = 12;

const url = id => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop`;

/* Photos whose alt mentions people are skipped (rule: no posed people). */
const PEOPLE_RE = /\b(woman|women|man|men|person|people|girl|boy|child|kid|baby|couple|lady|gentleman|portrait|smiling|face|model|waiter|waitress|chef|guest|someone|himself|herself)\b/i;

/* Per-slot photo descriptions (become alt text; app.js adds hotel/room context). */
const HOTEL_SLOT_DESC = {
  exterior: 'Luxury hotel exterior facade',
  lobby: 'Grand lobby and reception',
  room: 'Guest room interior',
  pool: 'Swimming pool and deck',
  restaurant: 'Fine dining restaurant',
  spa: 'Spa and wellness area',
  ballroom: 'Banquet hall and ballroom'
};
const ROOM_SLOTS = {
  room: [
    'Bedroom with king bed and warm lighting',
    'Close-up of the bed and headboard',
    'Marble bathroom with soaking tub',
    'Work desk and in-room amenities',
    'Balcony with city or garden view'
  ],
  suite: [
    'Spacious suite bedroom with lounge seating',
    'Separate living area with sofa seating',
    'Marble bathroom with rain shower and tub',
    'Dining nook and work desk in the suite',
    'Private terrace with panoramic view'
  ]
};
/* Pool sequence per room kind, per slot index. */
const ROOM_SLOT_POOLS = {
  room: ['bedroom', 'bedroom2', 'bathroom', 'desk', 'balcony'],
  suite: ['villa', 'living', 'bathroomb', 'desk', 'balcony']
};

async function headOk(u) {
  try {
    const r = await fetch(u, { method: 'HEAD', redirect: 'follow' });
    return r.status === 200;
  } catch (e) { return false; }
}

(async () => {
  if (!fs.existsSync(POOL_FILE)) {
    console.error('MISSING tools/pexels-pool.json — harvest pool first. Aborting.');
    process.exit(1);
  }
  const poolRaw = JSON.parse(fs.readFileSync(POOL_FILE, 'utf8'));

  // Filter each pool once: drop alts mentioning people.
  const pool = {};
  for (const [cat, arr] of Object.entries(poolRaw)) {
    pool[cat] = arr.filter(x => !(x.alt && PEOPLE_RE.test(x.alt)));
  }
  const stats = Object.entries(pool).map(([k, v]) => `${k}:${v.length}`).join(' ');
  console.log('Filtered pool sizes:', stats);

  // Cursor per pool + global used-id set (uniqueness across the whole library).
  const ptr = {}; Object.keys(pool).forEach(k => ptr[k] = 0);
  const usedIds = new Set();
  function take(cat) {
    const arr = pool[cat] || [];
    while (ptr[cat] < arr.length) {
      const cand = arr[ptr[cat]++];
      if (!usedIds.has(cand.id)) { usedIds.add(cand.id); return cand; }
    }
    throw new Error(`Pool exhausted: ${cat}`);
  }

  const hotelsSrc = fs.readFileSync(path.join(ROOT, 'js/data/hotels.js'), 'utf8');
  const HOTELS = new Function(hotelsSrc + '\nreturn HOTELS;')();

  /* ---------- assign ---------- */
  const hotelLines = [], hotelAltLines = [], roomLines = [], roomAltLines = [];
  const allUrls = [];
  const hotelCatPool = { exterior: 'exterior', lobby: 'lobby', room: 'bedroom', pool: 'pool', restaurant: 'restaurant', spa: 'spa', ballroom: 'ballroom' };

  for (const h of HOTELS) {
    const urls = [], alts = [];
    h.images.forEach((label, i) => {
      const cat = hotelCatPool[label] || 'bedroom';
      const cand = take(cat);
      const u = url(cand.id);
      urls.push(u); allUrls.push(u);
      alts.push(`${HOTEL_SLOT_DESC[label] || 'Hotel view'} at ${h.name}, ${h.locality}`);
    });
    hotelLines.push(`  ${JSON.stringify(h.id)}: ${JSON.stringify(urls)}`);
    hotelAltLines.push(`  ${JSON.stringify(h.id)}: ${JSON.stringify(alts)}`);

    for (const r of h.rooms) {
      const kind = r.images.includes('suite') ? 'suite' : 'room';
      const ru = [], ra = [];
      r.images.forEach((label, i) => {
        const cat = ROOM_SLOT_POOLS[kind][i];
        const cand = take(cat);
        const u = url(cand.id);
        ru.push(u); allUrls.push(u);
        const desc = ROOM_SLOTS[kind][i];
        ra.push(`${desc} in the ${r.name} at ${h.name}`);
      });
      roomLines.push(`  ${JSON.stringify(r.id)}: ${JSON.stringify(ru)}`);
      roomAltLines.push(`  ${JSON.stringify(r.id)}: ${JSON.stringify(ra)}`);
    }
  }
  console.log('Assigned slots:', allUrls.length, '| distinct ids:', usedIds.size);

  /* ---------- verify every URL (HEAD, swap failures from remaining pool) ---------- */
  const status = new Array(allUrls.length).fill(null);
  let idx = 0;
  async function worker() {
    while (idx < allUrls.length) {
      const i = idx++;
      status[i] = await headOk(allUrls[i]);
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  let failed = status.map((ok, i) => ok ? -1 : i).filter(i => i >= 0);
  console.log(`HEAD verify: ${allUrls.length - failed.length} OK, ${failed.length} failed`);

  if (failed.length) {
    // Map url -> slots, replace failed slots with fresh pool candidates.
    const urlToSlots = new Map(); // url -> [{kind:'hotel'|'room', id, slot}]
    HOTELS.forEach((h, hi) => {
      h.images.forEach((label, i) => {
        const u = hotelLines[hi].match(/"([^"]+)"/g); // not reliable; rebuild below instead
      });
    });
    // Simpler: rebuild structured slot list fresh for replacement.
    console.log('Attempting replacement of failed URLs...');
    // Rebuild structured slot records in the same order as allUrls.
    const slots = [];
    HOTELS.forEach(h => { h.images.forEach((label, i) => slots.push({ kind: 'hotel', hid: h.id, label, hname: h.name, loc: h.locality }));
      h.rooms.forEach(r => { const kind2 = r.images.includes('suite') ? 'suite' : 'room';
        r.images.forEach((label, i) => slots.push({ kind: 'room', rid: r.id, kind2, i, rname: r.name, hname: h.name })); });
    });
    let fixed = 0;
    for (const i of failed) {
      const s = slots[i];
      const cat = s.kind === 'hotel' ? (hotelCatPool[s.label] || 'bedroom') : ROOM_SLOT_POOLS[s.kind2][s.i];
      // Find next unused candidate that HEADs OK.
      let replaced = false;
      while (ptr[cat] < pool[cat].length) {
        const cand = pool[cat][ptr[cat]++];
        if (usedIds.has(cand.id)) continue;
        const u = url(cand.id);
        // eslint-disable-next-line no-await-in-loop
        if (await headOk(u)) {
          usedIds.add(cand.id);
          allUrls[i] = u;
          replaced = true; fixed++;
          break;
        }
      }
      if (!replaced) console.error('  COULD NOT REPLACE slot', i, JSON.stringify(s));
    }
    console.log(`Replaced ${fixed}/${failed.length} failed URLs (re-verify below).`);
    // Re-verify everything once more.
    idx = 0; status.fill(null);
    await Promise.all(Array.from({ length: CONC }, worker));
    failed = status.map((ok, i) => ok ? -1 : i).filter(i => i >= 0);
    console.log(`Final HEAD verify: ${allUrls.length - failed.length} OK, ${failed.length} failed`);
    if (failed.length) { console.error('STILL FAILED:', failed.slice(0, 20).map(i => allUrls[i])); process.exit(1); }
    // Rebuild lines with the corrected URLs (same order).
    let p = 0;
    const hl = [], hal = [], rl = [], ral = [];
    for (const h of HOTELS) {
      const urls = allUrls.slice(p, p + h.images.length); p += h.images.length;
      const alts = h.images.map(label => `${HOTEL_SLOT_DESC[label] || 'Hotel view'} at ${h.name}, ${h.locality}`);
      hl.push(`  ${JSON.stringify(h.id)}: ${JSON.stringify(urls)}`);
      hal.push(`  ${JSON.stringify(h.id)}: ${JSON.stringify(alts)}`);
      for (const r of h.rooms) {
        const kind = r.images.includes('suite') ? 'suite' : 'room';
        const ru = allUrls.slice(p, p + r.images.length); p += r.images.length;
        const ra = r.images.map((label, i) => `${ROOM_SLOTS[kind][i]} in the ${r.name} at ${h.name}`);
        rl.push(`  ${JSON.stringify(r.id)}: ${JSON.stringify(ru)}`);
        ral.push(`  ${JSON.stringify(r.id)}: ${JSON.stringify(ra)}`);
      }
    }
    hotelLines.splice(0, hotelLines.length, ...hl);
    hotelAltLines.splice(0, hotelAltLines.length, ...hal);
    roomLines.splice(0, roomLines.length, ...rl);
    roomAltLines.splice(0, roomAltLines.length, ...ral);
  }

  /* ---------- landing images (hero + 3 area cards) — verified Unsplash photos ---------- */
  const landing = {
    hero: { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80', alt: 'Luxury resort exterior with pool at dusk' },
    hyderabad: { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80', alt: 'Luxury resort pool and pavilion illuminated at dusk' },
    vijayawada: { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80', alt: 'Tropical resort infinity pool with villas and palm trees' },
    amaravathi: { url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80', alt: 'Resort infinity pool overlooking the sea with sun loungers' }
  };
  for (const k of Object.keys(landing)) {
    if (!(await headOk(landing[k].url))) { console.error('LANDING IMAGE FAILED:', k, landing[k].url); process.exit(1); }
  }

  /* ---------- write images.js ---------- */
  const total = allUrls.length;
  const out = `/**
 * FRCC STAYS - UNIQUE IMAGE LIBRARY  (AUTO-GENERATED by tools/build-images.js)
 * -------------------------------------------------------------------------------
 * Every hotel gallery and every room gallery has its own DISTINCT photos.
 * NO photo is shared between two hotels, two rooms, a room and its hotel,
 * or repeated inside a single gallery. Total slots = ${total}.
 *
 * All photos are royalty-free, sourced from Pexels (https://www.pexels.com) via
 * tools/pexels-pool.json and served at 1200x800 (landscape, server-side crop).
 * Category rules enforced by the builder:
 *  - Hotel galleries: exterior facade, lobby, guest room, pool, restaurant,
 *    spa / ballroom (per the label order in hotels.js).
 *  - Room galleries (rooms): bedroom wide view, bed close-up, marble bathroom,
 *    work desk, balcony/view — interiors only.
 *  - Room galleries (suites): suite bedroom, separate living area, marble
 *    bathroom, dining/desk, private terrace — visibly more luxurious.
 *  - No photo with people-focused alt text is used.
 * Every URL is HEAD-verified (HTTP 200) at build time; the UI keeps the
 * gradient onerror fallback as a safety net ONLY.
 *
 * >>> TO USE YOUR TEAM'S OWN PHOTOS <<<
 * Replace any URL below with your own. Keep every URL distinct across the whole
 * file, keep 5-6 images per gallery, then run: node tools/check-images.js
 */
const _IMG_W = 1200, _IMG_H = 800;

/* Landing page images (hero + area cards), editable here so HTML stays URL-free. */
const LANDING_IMAGES = {
  hero: ${JSON.stringify(landing.hero)},
  hyderabad: ${JSON.stringify(landing.hyderabad)},
  vijayawada: ${JSON.stringify(landing.vijayawada)},
  amaravathi: ${JSON.stringify(landing.amaravathi)}
};

/* Hotel galleries, in the category order declared in hotels.js (exterior, lobby,
   room, pool, restaurant, spa|ballroom). Use getHotelGallery(hotelId). */
const HOTEL_IMAGES = {
${hotelLines.join(',\n')}
};

/* Alt text per hotel gallery slot (parallel to HOTEL_IMAGES). */
const HOTEL_ALTS = {
${hotelAltLines.join(',\n')}
};

/* Room galleries, in the category order declared in hotels.js. Use getRoomGallery(roomId). */
const ROOM_IMAGES = {
${roomLines.join(',\n')}
};

/* Alt text per room gallery slot (parallel to ROOM_IMAGES). */
const ROOM_ALTS = {
${roomAltLines.join(',\n')}
};

/** Get a hotel's distinct gallery (array of URLs). */
function getHotelGallery(hotelId) {
  return HOTEL_IMAGES[hotelId] || [];
}

/** Get alt texts for a hotel's gallery (parallel array). */
function getHotelGalleryAlts(hotelId) {
  return HOTEL_ALTS[hotelId] || [];
}

/** Get a room's distinct gallery (array of URLs). */
function getRoomGallery(roomId) {
  return ROOM_IMAGES[roomId] || [];
}

/** Get alt texts for a room's gallery (parallel array). */
function getRoomGalleryAlts(roomId) {
  return ROOM_ALTS[roomId] || [];
}
`;
  fs.writeFileSync(OUT_FILE, out);
  console.log('Wrote js/data/images.js (' + out.length + ' bytes)');

  // Self-check: uniqueness.
  const seen = new Set(); const dups = [];
  allUrls.forEach(u => { if (seen.has(u)) dups.push(u); seen.add(u); });
  console.log('Self-check unique URLs:', seen.size, '| duplicates:', dups.length);
  if (dups.length) process.exit(1);
})().catch(e => { console.error('BUILD FAILED:', e.message); process.exit(1); });
