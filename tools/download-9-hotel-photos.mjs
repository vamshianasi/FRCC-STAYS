import fs from 'fs';
import path from 'path';
import https from 'https';

const ROOT = 'C:\\Users\\DELL\\OneDrive\\Desktop\\FRCC RESORTS &STAYS';
const IMG_BASE = path.join(ROOT, 'public/images');

// 9 luxury hotel/resort photos - one per slot
const PHOTOS = {
  'Hyderabad': [
    { file: 'hotel-exterior', category: 'exterior', pexelsId: '18649226', alt: 'Modern glass-and-stone luxury hotel tower exterior at dusk with city lights' },
    { file: 'lobby', category: 'lobby', pexelsId: '14841129', alt: 'Grand marble hotel lobby with chandelier and reception desk' },
    { file: 'rooftop-pool', category: 'pool', pexelsId: '19810875', alt: 'Rooftop infinity pool with panoramic city skyline view at dusk' },
  ],
  'Vijayawada': [
    { file: 'hotel-facade', category: 'exterior', pexelsId: '18435555', alt: 'Elegant luxury hotel facade with landscaped driveway and manicured gardens' },
    { file: 'suite-bedroom', category: 'bedroom', pexelsId: '34496715', alt: 'Luxury suite bedroom with king bed, large windows and city view' },
    { file: 'fine-dining', category: 'restaurant', pexelsId: '29000046', alt: 'Fine-dining restaurant interior with elegant decor and seating' },
  ],
  'Amaravathi': [
    { file: 'garden-resort', category: 'exterior', pexelsId: '33561756', alt: 'Spacious garden resort with manicured lawns and hotel building' },
    { file: 'courtyard-pool', category: 'pool', pexelsId: '11984085', alt: 'Courtyard pool surrounded by lush greenery and hotel building' },
    { file: 'spa-lounge', category: 'spa', pexelsId: '37729825', alt: 'Luxury spa lounge interior with modern decor and relaxation area' },
  ]
};

function pexelsUrl(id, w) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
}

function downloadImage(url, destPath) {
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
        resolve({ size: stats.size });
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

async function downloadAll() {
  console.log('=== DOWNLOADING 9 LUXURY HOTEL/RESORT PHOTOS ===\n');
  const credits = [];
  
  for (const [city, photos] of Object.entries(PHOTOS)) {
    console.log(`\n--- ${city} ---`);
    const cityDir = path.join(IMG_BASE, 'areas', city.toLowerCase());
    
    for (const ph of photos) {
      const fullPath = path.join(cityDir, `${ph.file}.webp`);
      const thumbPath = path.join(cityDir, `${ph.file}-600.webp`);
      
      if (fs.existsSync(fullPath)) {
        console.log(`  [SKIP] ${ph.file} already exists`);
        credits.push({ city, category: ph.category, file: ph.file, pexelsId: ph.pexelsId, alt: ph.alt });
        continue;
      }
      
      console.log(`  Downloading ${ph.file} (${ph.category})...`);
      
      try {
        const fullUrl = pexelsUrl(ph.pexelsId, 1200);
        const result = await downloadImage(fullUrl, fullPath);
        console.log(`    Full: ${(result.size/1024).toFixed(1)}KB`);
        
        const thumbUrl = pexelsUrl(ph.pexelsId, 600);
        const thumbResult = await downloadImage(thumbUrl, thumbPath);
        console.log(`    Thumb: ${(thumbResult.size/1024).toFixed(1)}KB`);
        
        credits.push({ city, category: ph.category, file: ph.file, pexelsId: ph.pexelsId, alt: ph.alt });
        
      } catch (e) {
        console.log(`    FAILED: ${e.message}`);
      }
    }
  }
  
  // Generate credits markdown
  let creditsMd = '\n## Area Hotel/Resort Collages (3 per city)\n\n';
  creditsMd += '| City | Category | File | Pexels ID | Alt Text | Source | License |\n';
  creditsMd += '|------|----------|------|-----------|----------|--------|---------|\n';
  
  credits.forEach(c => {
    creditsMd += `| ${c.city} | ${c.category} | ${c.file}.webp | ${c.pexelsId} | ${c.alt} | Pexels | Pexels License |\n`;
  });
  
  // Append to existing CREDITS.md
  const creditsPath = path.join(ROOT, 'images', 'CREDITS.md');
  let existingCredits = '';
  if (fs.existsSync(creditsPath)) {
    existingCredits = fs.readFileSync(creditsPath, 'utf8');
  }
  
  // Remove any existing Area Hotel/Resort Collages section
  existingCredits = existingCredits.replace(/## Area Hotel\/Resort Collages.*?(?=\n## |\n---|$)/s, '');
  existingCredits = existingCredits.replace(/## Area Landmark Collages.*?(?=\n## |\n---|$)/s, '');
  
  // Insert before last --- or at end
  const insertPos = existingCredits.lastIndexOf('---');
  if (insertPos !== -1) {
    existingCredits = existingCredits.slice(0, insertPos) + creditsMd + '\n' + existingCredits.slice(insertPos);
  } else {
    existingCredits += creditsMd;
  }
  
  fs.writeFileSync(creditsPath, existingCredits);
  console.log('\n✓ Updated images/CREDITS.md with hotel/resort credits');
  
  // Update manifest
  const manifest = {};
  for (const [city, photos] of Object.entries(PHOTOS)) {
    manifest[city.toLowerCase()] = photos.map(ph => ({
      file: `/images/areas/${city.toLowerCase()}/${ph.file}.webp`,
      thumb: `/images/areas/${city.toLowerCase()}/${ph.file}-600.webp`,
      category: ph.category,
      alt: ph.alt
    }));
  }
  
  const manifestPath = path.join(ROOT, 'tools', 'area-images.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('✓ Created tools/area-images.json manifest');
  
  console.log('\n' + '='.repeat(60));
  console.log('DOWNLOAD COMPLETE - 9 luxury hotel/resort photos');
  console.log('='.repeat(60));
}

downloadAll().catch(e => { console.error(e); process.exit(1); });