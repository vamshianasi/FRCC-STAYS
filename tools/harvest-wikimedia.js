import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const UA = 'FRCC-HotelBooking/1.0 (educational demo; contact: admin@frcc.club) Node/https';

function api(params) {
  return new Promise((resolve, reject) => {
    const qs = new URLSearchParams(params).toString();
    https.get('https://commons.wikimedia.org/w/api.php?' + qs, {
      headers: { 'User-Agent': UA, 'Accept': 'application/json' }
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch (e) { reject(new Error('bad json')); } });
    }).on('error', reject);
  });
}

function download(url, filepath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const file = fs.createWriteStream(filepath);
    const req = https.get(url, { headers: { 'User-Agent': UA } }, (res) => {
      if (res.statusCode !== 200) { file.close(); try { fs.unlinkSync(filepath); } catch {} reject(new Error('HTTP ' + res.statusCode)); return; }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(filepath); });
    });
    req.on('error', e => { file.close(); try { fs.unlinkSync(filepath); } catch {} reject(e); });
    req.setTimeout(60000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

// Titles that indicate: brands, people, diagrams, logos, non-photos
const BAD_WORDS = [
  'logo', 'sign', 'signage', 'plan', 'map', 'diagram', 'drawing', 'sketch', 'poster', 'advert',
  'marriott', 'hilton', 'hyatt', 'sheraton', 'radisson', 'novotel', 'westin', 'holiday inn',
  'taj', 'oberoi', 'itc', 'leela', 'ramada', 'ibis', 'mercure', 'sofitel', 'jw ', 'peninsula',
  'four seasons', 'intercontinental', 'crown plaza', 'doubletree', 'embassy suites', 'wyndham',
  'best western', 'holiday inn express', 'crowne plaza', 'ritz', 'carlton', 'fairmont',
  'portrait', 'selfie', 'person', 'people', 'man ', 'woman ', 'girl', 'boy ', 'child', 'children',
  'staff', 'guest', 'waiter', 'chef', 'team', 'player', 'crowd', 'family',
  'svg', 'gif', 'png', 'icon', 'stamp', 'coin', 'banknote', 'flag'
];
const MIN_W = 1400;

const QUERIES = {
  exterior: ['luxury hotel exterior facade', 'hotel building exterior evening', 'five star hotel facade'],
  lobby: ['hotel lobby interior', 'hotel reception interior', 'grand lobby hotel'],
  pool: ['hotel swimming pool resort', 'infinity pool hotel', 'resort pool luxury'],
  restaurant: ['hotel restaurant interior', 'fine dining restaurant interior', 'restaurant table elegant'],
  'kids-zone': ['indoor playground children', 'kids play area indoor', 'children playroom'],
  park: ['hotel garden landscaping', 'resort garden lawn', 'formal garden park'],
  banquet: ['banquet hall interior', 'ballroom interior hotel', 'wedding hall decoration'],
  parking: ['hotel parking garage', 'car park building', 'parking entrance building'],
  'gym-floor': ['gym interior fitness center', 'fitness room treadmills', 'hotel gym equipment'],
  'gym-closeup': ['dumbbells rack', 'weight training equipment', 'yoga mat stretching area'],
  bedroom: ['hotel bedroom interior', 'hotel room bed interior', 'luxury bedroom hotel'],
  bed: ['hotel bed pillows', 'made bed hotel room', 'bedding linens hotel'],
  living: ['living room interior sofa', 'suite living room interior', 'sitting room interior'],
  balcony: ['hotel room balcony view', 'balcony terrace view room', 'window view hotel room'],
  bathroom: ['hotel bathroom interior', 'marble bathroom bathtub', 'bathroom shower interior'],
  kitchen: ['modern kitchenette interior', 'kitchenette apartment interior', 'pantry mini bar'],
  desk: ['hotel room desk work', 'office desk interior room', 'writing desk interior'],
  wardrobe: ['walk-in wardrobe closet', 'closet interior hotel', 'dressing room wardrobe']
};

function titleOk(title) {
  const t = title.toLowerCase().replace(/^file:/, '');
  if (!/\.(jpe?g)$/.test(t)) return false;
  for (const w of BAD_WORDS) if (t.includes(w)) return false;
  return true;
}

(async () => {
  const results = {};
  for (const [cat, queries] of Object.entries(QUERIES)) {
    const seen = new Set();
    const found = [];
    for (const q of queries) {
      try {
        const r = await api({
          action: 'query', format: 'json', list: 'search',
          srsearch: 'filetype:bitmap ' + q, srnamespace: '6', srlimit: '30'
        });
        const files = (r.query?.search || []).map(s => s.title).filter(titleOk);
        if (!files.length) continue;
        // Get imageinfo for dimensions
        const info = await api({
          action: 'query', format: 'json', titles: files.slice(0, 20).join('|'),
          prop: 'imageinfo', iiprop: 'url|size|mime|extmetadata', iiurlwidth: '1600'
        });
        for (const p of Object.values(info.query?.pages || {})) {
          const ii = p.imageinfo?.[0];
          if (!ii) continue;
          if (ii.mime !== 'image/jpeg') continue;
          if (ii.width < MIN_W || ii.width <= ii.height) continue;
          if (seen.has(p.title)) continue;
          const lic = ii.extmetadata?.LicenseShortName?.value || '';
          if (!/CC|Public domain|CC0/i.test(lic)) continue;
          const artist = (ii.extmetadata?.Artist?.value || '').replace(/<[^>]*>/g, '').trim().slice(0, 60);
          seen.add(p.title);
          found.push({
            title: p.title.replace(/^File:/, ''),
            url: ii.thumburl || ii.url,
            w: ii.width, h: ii.height,
            size: ii.size,
            license: lic,
            artist: artist || 'Unknown',
            page: ii.descriptionurl
          });
        }
      } catch (e) { console.log('  search fail', cat, q, e.message); }
      if (found.length >= 45) break;
    }
    results[cat] = found;
    console.log(cat + ': ' + found.length + ' candidates');
  }

  const outFile = path.join(__dirname, 'wikimedia-pool.json');
  fs.writeFileSync(outFile, JSON.stringify(results, null, 1));
  const total = Object.values(results).reduce((s, a) => s + a.length, 0);
  console.log('TOTAL Wikimedia candidates:', total);
  console.log('Saved to', outFile);
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
