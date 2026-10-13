/**
 * tools/replace-pool-photos.mjs
 * Replaces all hotel pool photos with city-style rooftop pool photos from Pexels
 * 
 * Usage: node tools/replace-pool-photos.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..', '..');
const IMG_BASE = path.join(ROOT, 'public/images');

// 10 verified city-style rooftop pool photos from Pexels
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

// Load hotels data
const { default: HOTELS } = await import('../src/modules/hotel-booking/data/hotels.js');

function pexelsUrl(id, w) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
}

async function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(destPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const file = fs.createWriteStream(destPath);
    const req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    }, (response) => {
      if (response.statusCode !== 200) {
        fs.unlinkSync(destPath);
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(destPath);
        if (stats.size > 500 * 1024) {
          console.warn(`  Warning: ${destPath} is ${(stats.size/1024).toFixed(1)}KB (over 500KB)`);
        }
        resolve(stats.size);
      });
    }).on('error', (err) => {
      fs.unlinkSync(destPath);
      reject(err);
    });
    
    req.setTimeout(30000, () => {
      req.destroy();
      fs.unlinkSync(destPath);
      reject(new Error('Timeout'));
    });
  });
}

async function replacePoolPhotos() {
  console.log('=== REPLACING HOTEL POOL PHOTOS WITH CITY-STYLE ROOFTOP POOLS ===\n');
  console.log(`Using ${CITY_POOL_PHOTOS.length} city-style rooftop pool photos for ${HOTELS.length} hotels\n`);
  
  let totalDownloaded = 0;
  let totalFailed = 0;
  const credits = [];
  
  for (let i = 0; i < HOTELS.length; i++) {
    const hotel = HOTELS[i];
    const photoIdx = i % CITY_POOL_PHOTOS.length;
    const photo = CITY_POOL_PHOTOS[photoIdx];
    
    const dir = path.join(IMG_BASE, 'hotels', hotel.id);
    const fullPath = path.join(dir, 'pool.webp');
    const thumbPath = path.join(dir, 'pool-600.webp');
    
    console.log(`[Hotel ${i + 1}/${HOTELS.length}] ${hotel.id} - ${hotel.name}`);
    console.log(`  Using Pexels photo ${photo.id} (${photoIdx + 1}/${CITY_POOL_PHOTOS.length})`);
    
    // Backup original if exists
    if (fs.existsSync(fullPath)) {
      const backupPath = fullPath + '.backup';
      const thumbBackupPath = thumbPath + '.backup';
      if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(fullPath, backupPath);
        fs.copyFileSync(thumbPath, thumbBackupPath);
        console.log(`  Backed up original to .backup`);
      }
    }
    
    // Download full-size (1600px)
    try {
      const fullUrl = pexelsUrl(photo.id, 1600);
      const size = await downloadImage(fullUrl, fullPath);
      console.log(`  Downloaded full-size: ${(size/1024).toFixed(1)}KB`);
      
      // Download thumbnail (600px)
      const thumbUrl = pexelsUrl(photo.id, 600);
      const thumbSize = await downloadImage(thumbUrl, thumbPath);
      console.log(`  Downloaded thumbnail: ${(thumbSize/1024).toFixed(1)}KB`);
      
      totalDownloaded++;
      
      // Record credit
      credits.push({
        hotelId: hotel.id,
        hotelName: hotel.name,
        category: 'Pool',
        photoId: photo.id,
        source: 'Pexels',
        alt: photo.alt,
        license: 'Pexels License'
      });
      
    } catch (e) {
      console.log(`  FAILED: ${e.message}`);
      totalFailed++;
      
      // Restore backup if download failed
      const backupPath = fullPath + '.backup';
      const thumbBackupPath = thumbPath + '.backup';
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, fullPath);
        fs.copyFileSync(thumbBackupPath, thumbPath);
        console.log(`  Restored backup`);
      }
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('POOL PHOTO REPLACEMENT COMPLETE');
  console.log(`  Downloaded: ${totalDownloaded}`);
  console.log(`  Failed: ${totalFailed}`);
  console.log('='.repeat(60));
  
  // Update CREDITS.md with pool photo replacements
  updateCredits(credits);
}

function updateCredits(credits) {
  const creditsPath = path.join(ROOT, 'images/CREDITS.md');
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
  console.log('\n✓ Updated images/CREDITS.md with pool photo credits');
}

replacePoolPhotos().catch(e => { console.error(e); process.exit(1); });