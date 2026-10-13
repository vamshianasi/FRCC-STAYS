import fs from 'fs';
import path from 'path';

const ROOT = 'C:\\Users\\DELL\\OneDrive\\Desktop\\FRCC RESORTS &STAYS';

console.log('ROOT:', ROOT);
console.log('CREDITS path:', path.join(ROOT, 'images', 'CREDITS.md'));
console.log('Exists:', fs.existsSync(path.join(ROOT, 'images', 'CREDITS.md')));

const CITY_POOL_PHOTOS = [
  { id: '19810875', alt: 'Serene rooftop pool with Bangkok skyline and river' },
  { id: '27206543', alt: 'Modern rooftop pool at Dubai hotel with stunning city' },
  { id: '33819401', alt: 'Aerial view of rooftop pool area with swimmers and vibrant city' },
  { id: '261102', alt: 'Elegant rooftop pool with cityscape backdrop at sunset' },
  { id: '2291619', alt: 'Vibrant rooftop pool and dining experience at sunset' },
  { id: '11984085', alt: 'Rooftop pool in Phnom Penh with city views' },
  { id: '33647166', alt: 'Elegant rooftop pool in Dubai with city skyline views' },
  { id: '30560236', alt: 'Infinity pool with panoramic city skyline' },
  { id: '32697381', alt: 'City skyline reflected in tranquil infinity pool' },
  { id: '40034043', alt: 'Infinity pool with panoramic urban view' },
];

const { default: HOTELS } = await import('file:///C:/Users/DELL/OneDrive/Desktop/FRCC%20RESORTS%20&STAYS/src/modules/hotel-booking/data/hotels.js');

const credits = [];
for (let i = 0; i < HOTELS.length; i++) {
  const hotel = HOTELS[i];
  const photoIdx = i % CITY_POOL_PHOTOS.length;
  const photo = CITY_POOL_PHOTOS[photoIdx];
  credits.push({
    hotelId: hotel.id,
    hotelName: hotel.name,
    category: 'Pool',
    photoId: photo.id,
    source: 'Pexels',
    alt: photo.alt,
    license: 'Pexels License'
  });
}

const creditsPath = path.join(ROOT, 'images', 'CREDITS.md');
let creditsMd = '';

if (fs.existsSync(creditsPath)) {
  creditsMd = fs.readFileSync(creditsPath, 'utf8');
} else {
  creditsMd = '# Image Credits\n\nAll photos are from Unsplash or Pexels, used under their respective licenses.\n\n---\n\n';
}

// Remove existing Pool section if exists
creditsMd = creditsMd.replace(/## Pool\n[\s\S]*?(?=\n## |\n---|$)/, '');

// Add new Pool section
let poolSection = '\n## Pool (City-Style Rooftop Pools - Replaced)\n\n';
poolSection += '| Hotel | Photo ID | Alt Text | Source | License |\n';
poolSection += '|-------|----------|----------|--------|---------|\n';

credits.forEach(c => {
  poolSection += `| ${c.hotelName} (${c.hotelId}) | ${c.photoId} | ${c.alt} | ${c.source} | ${c.license} |\n`;
});

// Insert before the last --- or at end
const insertPos = creditsMd.lastIndexOf('---');
if (insertPos !== -1) {
  creditsMd = creditsMd.slice(0, insertPos) + poolSection + '\n' + creditsMd.slice(insertPos);
} else {
  creditsMd += poolSection;
}

fs.writeFileSync(creditsPath, creditsMd);
console.log('✓ Updated images/CREDITS.md with pool photo credits');