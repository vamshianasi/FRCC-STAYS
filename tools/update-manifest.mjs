/**
 * tools/update-manifest.mjs
 * Scans public/images/ for actual files and updates hotels.js manifest
 * to match. This ensures the manifest is always the single source of truth
 * and paths never point to missing files.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const CATEGORY_FILE_NAMES = {
  'Exterior': 'exterior',
  'Lobby': 'lobby',
  'Pool': 'pool',
  'Restaurant': 'restaurant',
  'Kids Zone': 'kids-zone',
  'Park': 'park',
  'Banquet Hall': 'banquet',
  'Parking': 'parking',
  'Gym Floor': 'gym-floor',
  'Gym Close-up': 'gym-closeup',
  'Bedroom': 'bedroom',
  'Bed': 'bed',
  'Living Area': 'living-area',
  'Seating': 'seating',
  'Balcony': 'balcony',
  'Washroom': 'washroom',
  'Kitchen': 'kitchen',
  'Minibar': 'minibar',
  'Work Desk': 'work-desk',
  'Wardrobe': 'wardrobe',
};

const HOTEL_CATEGORIES = [
  'Exterior', 'Lobby', 'Pool', 'Restaurant', 'Kids Zone',
  'Park', 'Banquet Hall', 'Parking', 'Gym Floor', 'Gym Close-up'
];

const ROOM_CATEGORIES = {
  'dlx': ['Bedroom', 'Bed', 'Seating', 'Balcony', 'Washroom', 'Minibar'],
  'exe': ['Bedroom', 'Bed', 'Living Area', 'Work Desk', 'Balcony', 'Washroom'],
  'pre': ['Bedroom', 'Bed', 'Living Area', 'Kitchen', 'Balcony', 'Washroom'],
};

function scanImages(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.webp') || f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png'));
}

async function updateManifest() {
  const hotelsPath = path.join(ROOT, 'src/modules/hotel-booking/data/hotels.js');
  const { default: HOTELS } = await import('../src/modules/hotel-booking/data/hotels.js');

  let updated = 0;
  let missing = 0;

  for (const hotel of HOTELS) {
    // Update hotel gallery
    const hotelDir = path.join(ROOT, 'public/images/hotels', hotel.id);
    const hotelFiles = scanImages(hotelDir);

    hotel.gallery = HOTEL_CATEGORIES.map(category => {
      const fileName = CATEGORY_FILE_NAMES[category];
      const fullFile = hotelFiles.find(f => f === `${fileName}.webp` || f === `${fileName}.jpg`);
      const thumbFile = hotelFiles.find(f => f === `${fileName}-600.webp` || f === `${fileName}-600.jpg`);

      if (fullFile) {
        updated++;
        return {
          file: `/images/hotels/${hotel.id}/${fullFile}`,
          category,
          alt: `${category} at ${hotel.name}`,
          thumb: thumbFile ? `/images/hotels/${hotel.id}/${thumbFile}` : `/images/hotels/${hotel.id}/${fullFile}`,
        };
      } else {
        missing++;
        return {
          file: `/images/hotels/${hotel.id}/${fileName}.webp`,
          category,
          alt: `${category} at ${hotel.name}`,
          thumb: `/images/hotels/${hotel.id}/${fileName}-600.webp`,
        };
      }
    });

    // Update room galleries
    for (const room of hotel.rooms) {
      const roomDir = path.join(ROOT, 'public/images/rooms', room.id);
      const roomFiles = scanImages(roomDir);
      const roomType = room.id.split('-').pop();
      const categories = ROOM_CATEGORIES[roomType] || ROOM_CATEGORIES['dlx'];

      room.gallery = categories.map(category => {
        const fileName = CATEGORY_FILE_NAMES[category];
        const fullFile = roomFiles.find(f => f === `${fileName}.webp` || f === `${fileName}.jpg`);
        const thumbFile = roomFiles.find(f => f === `${fileName}-600.webp` || f === `${fileName}-600.jpg`);

        if (fullFile) {
          updated++;
          return {
            file: `/images/rooms/${room.id}/${fullFile}`,
            category,
            alt: `${category} in ${room.name} at ${hotel.name}`,
            thumb: thumbFile ? `/images/rooms/${room.id}/${thumbFile}` : `/images/rooms/${room.id}/${fullFile}`,
          };
        } else {
          missing++;
          return {
            file: `/images/rooms/${room.id}/${fileName}.webp`,
            category,
            alt: `${category} in ${room.name} at ${hotel.name}`,
            thumb: `/images/rooms/${room.id}/${fileName}-600.webp`,
          };
        }
      });
    }
  }

  // Write updated manifest
  const header = `// Auto-generated hotels data with image manifest\n// Updated: ${new Date().toISOString()}\nconst HOTELS = ${JSON.stringify(HOTELS, null, 2)};\n\nexport default HOTELS;\n`;
  fs.writeFileSync(hotelsPath, header);

  console.log(`Manifest updated:`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Missing: ${missing}`);
  return { updated, missing };
}

updateManifest().catch(e => { console.error(e); process.exit(1); });
