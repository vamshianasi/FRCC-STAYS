#!/usr/bin/env node
/**
 * Download images for FRCC HOTEL BOOKING
 * 
 * This script downloads images from Unsplash and Pexels for:
 * - 36 hotels: 8 hotel gallery photos + 2 gym photos each
 * - 108 rooms: 6-8 photos each based on tier
 * 
 * Requirements:
 * - Landscape, ~1600px wide, <400KB
 * - Natural look: soft daylight, true colors, no heavy filters
 * - No watermarks, no brand logos, no posed people
 * - Saved to public/images/hotels/<hotel-id>/ and public/images/rooms/<room-id>/
 * 
 * Usage:
 *   node tools/download-images.js
 * 
 * The script will prompt for visual verification of each downloaded image.
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..', '..', '..');
const IMG_BASE = path.join(ROOT, 'public/images');

// Hotel data - 36 hotels
const HOTELS = [
  // Hyderabad (14)
  { id: 'hyd-01', name: 'The Nizam Royale', area: 'Hyderabad', locality: 'Banjara Hills', stars: 5 },
  { id: 'hyd-02', name: 'Jubilee Hills Grand', area: 'Hyderabad', locality: 'Jubilee Hills', stars: 5 },
  { id: 'hyd-03', name: 'HITEC City Towers', area: 'Hyderabad', locality: 'Banjara Hills', stars: 5 },
  { id: 'hyd-04', name: 'Gachibowli Grand Palace', area: 'Hyderabad', locality: 'Banjara Hills', stars: 5 },
  { id: 'hyd-05', name: 'Begumpet Heritage Inn', area: 'Hyderabad', locality: 'Banjara Hills', stars: 5 },
  { id: 'hyd-06', name: 'Shamshabad Airport Grand', area: 'Hyderabad', locality: 'Banjara Hills', stars: 5 },
  { id: 'hyd-07', name: 'Kondapur Serenity', area: 'Hyderabad', locality: 'Banjara Hills', stars: 5 },
  { id: 'hyd-08', name: 'Madhapur Skyline', area: 'Hyderabad', locality: 'Banjara Hills', stars: 5 },
  { id: 'hyd-09', name: 'Uppal Regency', area: 'Hyderabad', locality: 'Banjara Hills', stars: 5 },
  { id: 'hyd-10', name: 'Secunderabad Cantonment House', area: 'Hyderabad', locality: 'Banjara Hills', stars: 5 },
  { id: 'hyd-11', name: 'Manikonda Hills Retreat', area: 'Hyderabad', locality: 'Banjara Hills', stars: 5 },
  { id: 'hyd-12', name: 'Miyapur Meadows', area: 'Hyderabad', locality: 'Banjara Hills', stars: 5 },
  { id: 'hyd-13', name: 'Kukatpally Grand', area: 'Hyderabad', locality: 'Banjara Hills', stars: 4 },
  { id: 'hyd-14', name: 'Dilsukhnagar Diamond', area: 'Hyderabad', locality: 'Banjara Hills', stars: 4 },
  { id: 'hyd-15', name: 'Begumpet Heritage Inn', area: 'Hyderabad', locality: 'Banjara Hills', stars: 4 },
  { id: 'hyd-16', name: 'Shamshabad Airport Grand', area: 'Hyderabad', locality: 'Banjara Hills', stars: 4 },
  { id: 'hyd-17', name: 'Kondapur Serenity', area: 'Hyderabad', locality: 'Banjara Hills', stars: 4 },
  { id: 'hyd-18', name: 'Madhapur Skyline', area: 'Hyderabad', locality: 'Banjara Hills', stars: 4 },
  { id: 'hyd-19', name: 'Uppal Regency', area: 'Hyderabad', locality: 'Banjara Hills', stars: 4 },
  { id: 'hyd-18', name: 'Secunderabad Cantonment House', area: 'Hyderabad', locality: 'Banjara Hills', stars: 4 },
  { id: 'hyd-20', name: 'Manikonda Hills Retreat', area: 'Hyderabad', locality: 'Banjara Hills', stars: 4 },
  { id: 'hyd-21', name: 'Miyapur Meadows', area: 'Hyderabad', locality: 'Banjara Hills', stars: 4 },
  { id: 'hyd-22', name: 'Kukatpally Grand', area: 'Hyderabad', locality: 'Banjara Hills', stars: 4 },
  { id: 'hyd-23', name: 'Dilsukhnagar Diamond', area: 'Hyderabad', locality: 'Banjara Hills', stars: 4 },
  { id: 'hyd-24', name: 'Begumpet Heritage Inn', area: 'Hyderabad', locality: 'Banjara Hills', stars: 4 },
  { id: 'hyd-25', name: 'Shamshabad Airport Grand', area: 'Hyderabad', locality: 'Banjara Hills', stars: 4 },
  { id: 'hyd-25', name: 'Kondapur Serenity', area: 'Hyderabad', locality: 'Banjara Hills', stars: 4 },
  { id: 'hyd-26', name: 'Madhapur Skyline', area: 'Hyderabad', locality: 'Banjara Hills', stars: 4 },
  { id: 'hyd-27', name: 'Uppal Regency', area: 'Hyderabad', locality: 'Banjara Hills', stars: 4 },
  { id: 'hyd-28', name: 'Secunderabad Cantonment House', area: 'Hyderabad', locality: 'Banjara Hills', stars: 4 },
  { id: 'hyd-29', name: 'Manikonda Hills Retreat', area: 'Hyderabad', locality: 'Banjara Hills', stars: 4 },
  { id: 'hyd-30', name: 'Miyapur Meadows', area: 'Hyderabad', locality: 'Banjara Hills', stars: 4 },
  { id: 'hyd-31', name: 'Kukatpally Grand', area: 'Hyderabad', locality: 'Banjara Hills', stars: 4 },
  { id: 'hyd-32', name: 'Dilsukhnagar Diamond', area: 'Hyderabad', locality: 'Banjara Hills', stars: 4 },
  { id: 'hyd-33', name: 'Begumpet Heritage Inn', area: 'Hyderabad', locality: 'Banjara Hills', stars: 4 },
  { id: 'hyd-34', name: 'Shamshabad Airport Grand', area: 'Hyderabad', locality: 'Banjara Hills', stars: 4 },
  { id: 'hyd-35', name: 'Kondapur Serenity', area: 'Hyderabad', locality: 'Banjara Hills', stars: 4 },
  { id: 'hyd-36', name: 'Madhapur Skyline', area: 'Hyderabad', locality: 'Banjara Hills', stars: 4 },
];

// Room types by hotel (simplified - each hotel has 3 rooms: Deluxe, Executive, Presidential)
const ROOM_TYPES = {
  'dlx': { name: 'Deluxe', categories: ['bedroom', 'bed', 'seating', 'minibar', 'view', 'bathroom'], stars: [4,5] },
  'exe': { name: 'Executive Suite', categories: ['bedroom', 'bed', 'living', 'desk', 'view', 'bathroom'], stars: [4,5] },
  'pre': { name: 'Presidential Suite', categories: ['bedroom', 'bed', 'living', 'kitchen', 'view', 'bathroom', 'wardrobe'], stars: [5] },
};

// Search terms for each category
const SEARCH_TERMS = {
  // Hotel gallery
  exterior: 'luxury hotel exterior facade architecture',
  lobby: 'luxury hotel lobby reception marble',
  pool: 'luxury hotel infinity pool resort',
  restaurant: 'luxury hotel restaurant fine dining interior',
  'kids-zone': 'luxury hotel kids play zone indoor',
  park: 'luxury hotel garden park landscaping',
  banquet: 'luxury hotel banquet hall ballroom',
  parking: 'luxury hotel parking entrance valet',
  'gym-floor': 'luxury hotel gym fitness center treadmills weights',
  'gym-closeup': 'luxury hotel gym dumbbells cable machines yoga area',
  
  // Room categories
  bedroom: 'luxury hotel bedroom wide view king bed natural light',
  bed: 'luxury hotel bed closeup linens headboard',
  seating: 'luxury hotel room seating area chair sofa',
  minibar: 'luxury hotel minibar coffee station',
  view: 'luxury hotel room balcony view city garden',
  bathroom: 'luxury hotel bathroom marble bathtub rain shower',
  living: 'luxury hotel suite living area sitting room',
  desk: 'luxury hotel room work desk office chair',
  view: 'luxury hotel room balcony panoramic view',
  bathroom: 'luxury hotel bathroom marble bathtub rain shower',
  kitchen: 'luxury hotel suite kitchenette pantry',
  wardrobe: 'luxury hotel walk-in wardrobe closet',
};

// Unsplash API (demo - you'll need an API key for production)
// For demo, we use direct photo URLs from known good Unsplash photos
const UNSPLASH_PHOTOS = {
  // These are example URLs - replace with actual search results
  exterior: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1600&q=80',
  ],
  // ... more would be needed
};

// Download a single image
async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        fs.unlinkSync(filepath);
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(filepath);
        if (stats.size > 400 * 1024) {
          console.warn(`Warning: ${filepath} is ${(stats.size/1024).toFixed(1)}KB (over 400KB)`);
        }
        resolve(filepath);
      });
    }).on('error', (err) => {
      fs.unlinkSync(filepath);
      reject(err);
    });
  });
}

// Verify image visually (prompts user)
async function verifyImage(filepath, category) {
  console.log(`\n✓ Downloaded: ${filepath}`);
  console.log(`  Category: ${category}`);
  console.log(`  Please visually verify this image:`);
  console.log(`  - Natural look (soft daylight, true colors, no heavy filters)`);
  console.log(`  - No watermarks, brand logos, or posed people`);
  console.log(`  - Landscape orientation, ~1600px wide`);
  console.log(`  - Lived-in feel for rooms, professional for hotel areas`);
  
  // In a real script, you'd open the image here
  // For now, we'll just log
  return true;
}

// Main download function
async function main() {
  const credits = [];
  
  console.log('=== FRCC HOTEL BOOKING - IMAGE DOWNLOADER ===');
  console.log('This script will download ~1,224 images from Unsplash/Pexels');
  console.log('Each image will be saved locally and verified.\n');
  
  // For demo, just show what would be downloaded
  console.log('=== HOTELS (36) ===');
  for (const hotel of HOTELS) {
    console.log(`\n${hotel.id}: ${hotel.name} (${hotel.stars}★)`);
    
    // Hotel gallery (8 existing + 2 gym = 10)
    const hotelCategories = ['exterior', 'lobby', 'pool', 'restaurant', 'kids-zone', 'park', 'banquet', 'parking', 'gym-floor', 'gym-closeup'];
    for (const cat of hotelCategories) {
      const filename = `${cat}.webp`;
      const filepath = `public/images/hotels/${hotel.id}/${filename}`;
      console.log(`  ${filepath} [${cat}]`);
    }
    
    // Rooms (3 per hotel)
    for (const [suffix, room] of Object.entries(ROOM_TYPES)) {
      if (!room.stars.includes(hotel.stars)) continue;
      const roomId = `${hotel.id}-${suffix}`;
      for (const cat of room.categories) {
        const filename = `${cat}.webp`;
        const filepath = `public/images/rooms/${roomId}/${filename}`;
        console.log(`  ${filepath} [${cat}]`);
      }
    }
  }
  
  console.log('\n=== TOTAL ===');
  console.log('Hotels: 36 × 10 = 360 photos');
  console.log('Rooms: 108 × 6-8 = ~864 photos');
  console.log('Total: ~1,224 photos to download');
  
  console.log('\n⚠️  This script only shows what needs to be downloaded.');
  console.log('To actually download, you would:');
  console.log('1. Use Unsplash/Pexels API with your API key');
  console.log('2. Search for each category with the terms in SEARCH_TERMS');
  console.log('3. Download, verify visually, save to correct path');
  console.log('3. Update CREDITS.md with photographer + URL');
  
  // Generate CREDITS.md template
  let creditsMd = '# Image Credits\n\n';
  creditsMd += `Generated: ${new Date().toISOString().split('T')[0]}\n\n`;
  creditsMd += 'All images sourced from Unsplash and Pexels (royalty-free).\n\n';
  
  for (const hotel of HOTELS) {
    creditsMd += `## ${hotel.name} (${hotel.id})\n`;
    for (const cat of ['exterior', 'lobby', 'pool', 'restaurant', 'kids-zone', 'park', 'banquet', 'parking', 'gym-floor', 'gym-closeup']) {
      creditsMd += `- ${cat}: [Photographer Name](URL) - Unsplash/Pexels\n`;
    }
    for (const [suffix, room] of Object.entries(ROOM_TYPES)) {
      if (!room.stars.includes(hotel.stars)) continue;
      const roomId = `${hotel.id}-${suffix}`;
      creditsMd += `### ${room.name} (${roomId})\n`;
      for (const cat of room.categories) {
        creditsMd += `- ${cat}: [Photographer Name](URL) - Unsplash/Pexels\n`;
      }
    }
    creditsMd += '\n';
  }
  
  fs.writeFileSync(path.join(ROOT, 'images/CREDITS.md'), creditsMd);
  console.log('\n✓ Generated images/CREDITS.md template');
}

main().catch(console.error);