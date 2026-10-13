import https from 'https';

function get(url, opts = {}) {
  return new Promise((resolve) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36', ...(opts.headers || {}) }, ...opts }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, data, url: res.responseUrl || url }));
    });
    req.on('error', e => resolve({ status: 'ERR', err: e.message }));
    req.setTimeout(20000, () => { req.destroy(); resolve({ status: 'TIMEOUT' }); });
  });
}

// 1) source.unsplash.com keyword redirect
const a = await get('https://source.unsplash.com/1600x900/?hotel-room', { headers: {} });
console.log('source.unsplash.com:', a.status, a.headers?.location || a.url, (a.headers?.['content-type'] || ''));

// 2) Pexels search page HTML (scrape photo IDs)
const b = await get('https://www.pexels.com/search/luxury%20hotel%20room/', { headers: { 'Accept': 'text/html' } });
const pexelsIds = [...new Set([...(b.data || '').matchAll(/images\.pexels\.com\/photos\/(\d+)/g)].map(m => m[1]))];
console.log('Pexels search:', b.status, '| ids found:', pexelsIds.length);
if (pexelsIds.length) console.log('sample:', pexelsIds.slice(0, 8).join(', '));

// 3) Unsplash search page
const c = await get('https://unsplash.com/s/photos/luxury-hotel-room', { headers: { 'Accept': 'text/html' } });
const uIds = [...new Set([...(c.data || '').matchAll(/photo-(\d{10,}-\w{10,})/g)].map(m => m[1]))];
console.log('Unsplash search:', c.status, '| ids found:', uIds.length);
if (uIds.length) console.log('sample:', uIds.slice(0, 5).join(', '));

// 4) Pexels API without key
const d = await get('https://api.pexels.com/v1/search?query=hotel&per_page=5');
console.log('Pexels API:', d.status, (d.data || '').slice(0, 120));

// 5) Pixabay API without key
const e = await get('https://pixabay.com/api/?key=&q=hotel');
console.log('Pixabay API:', e.status, (e.data || '').slice(0, 120));
