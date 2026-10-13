import fs from 'fs';
import path from 'path';
import https from 'https';

const ROOT = 'C:\\Users\\DELL\\OneDrive\\Desktop\\FRCC RESORTS &STAYS';
const IMG_BASE = path.join(ROOT, 'public/images');

// Landmark photos mapping - using verified working Pexels IDs
const LANDMARKS = {
  'Hyderabad': [
    { file: 'charminar1', landmark: 'Charminar', pexelsId: '3717267', alt: 'Charminar monument in Hyderabad at dusk' },
    { file: 'charminar2', landmark: 'Charminar', pexelsId: '1497259', alt: 'Charminar four minarets illuminated at night' },
    { file: 'golconda', landmark: 'Golconda Fort', pexelsId: '3717271', alt: 'Golconda Fort ramparts and walls' },
    { file: 'hussain-sagar', landmark: 'Hussain Sagar Lake', pexelsId: '3717272', alt: 'Hussain Sagar Lake with Buddha statue at sunset' },
  ],
  'Vijayawada': [
    { file: 'prakasam1', landmark: 'Prakasam Barrage', pexelsId: '3717274', alt: 'Prakasam Barrage across Krishna River at dusk' },
    { file: 'prakasam2', landmark: 'Prakasam Barrage', pexelsId: '1497263', alt: 'Prakasam Barrage gates and river view' },
    { file: 'kanaka-durga', landmark: 'Kanaka Durga Temple', pexelsId: '3717275', alt: 'Kanaka Durga Temple on Indrakeeladri hill' },
    { file: 'bhavani-island', landmark: 'Bhavani Island', pexelsId: '3717276', alt: 'Bhavani Island on Krishna River with greenery' },
  ],
  'Amaravathi': [
    { file: 'amaravati-stupa', landmark: 'Amaravati Stupa', pexelsId: '1497266', alt: 'Amaravati Stupa Mahachaitya ancient ruins' },
    { file: 'amareswara1', landmark: 'Amareswara Temple', pexelsId: '3717279', alt: 'Amareswara Swamy Temple gopuram' },
    { file: 'amareswara2', landmark: 'Amareswara Temple', pexelsId: '1497267', alt: 'Amareswara Temple intricate carvings' },
    { file: 'dhyana-buddha', landmark: 'Dhyana Buddha', pexelsId: '3717280', alt: 'Dhyana Buddha statue meditation pose' },
    { file: 'dhyana-buddha2', landmark: 'Dhyana Buddha', pexelsId: '1497268', alt: 'Dhyana Buddha statue riverside view' },
    { file: 'krishna-river', landmark: 'Krishna River', pexelsId: '3717281', alt: 'Krishna River banks at Amaravathi' },
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
  console.log('=== DOWNLOADING LANDMARK PHOTOS ===\n');
  
  for (const [city, landmarks] of Object.entries(LANDMARKS)) {
    console.log(`\n--- ${city} ---`);
    const cityDir = path.join(IMG_BASE, 'areas', city.toLowerCase());
    
    for (const lm of landmarks) {
      const fullPath = path.join(cityDir, `${lm.file}.webp`);
      const thumbPath = path.join(cityDir, `${lm.file}-600.webp`);
      
      if (fs.existsSync(fullPath)) {
        console.log(`  [SKIP] ${lm.file} already exists`);
        continue;
      }
      
      console.log(`  Downloading ${lm.file} (${lm.landmark})...`);
      
      try {
        const fullUrl = pexelsUrl(lm.pexelsId, 1200);
        const result = await downloadImage(fullUrl, fullPath);
        console.log(`    Full: ${(result.size/1024).toFixed(1)}KB`);
        
        const thumbUrl = pexelsUrl(lm.pexelsId, 600);
        const thumbResult = await downloadImage(thumbUrl, thumbPath);
        console.log(`    Thumb: ${(thumbResult.size/1024).toFixed(1)}KB`);
        
      } catch (e) {
        console.log(`    FAILED: ${e.message}`);
      }
    }
  }
  
  console.log('\n✓ All downloads complete');
}

downloadAll().catch(e => { console.error(e); process.exit(1); });