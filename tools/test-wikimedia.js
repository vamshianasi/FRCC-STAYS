import https from 'https';

const UA = 'FRCC-HotelBooking/1.0 (contact: admin@frcc.club) Node/https';

function api(params) {
  return new Promise((resolve, reject) => {
    const qs = new URLSearchParams(params).toString();
    const url = 'https://commons.wikimedia.org/w/api.php?' + qs;
    https.get(url, { headers: { 'User-Agent': UA, 'Accept': 'application/json' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, json: JSON.parse(data) }); }
        catch (e) { resolve({ status: res.statusCode, json: null, raw: data.slice(0, 300) }); }
      });
    }).on('error', reject);
  });
}

// Test 1: search for hotel images
const r1 = await api({
  action: 'query', format: 'json', list: 'search',
  srsearch: 'filetype:bitmap hotel room interior bedroom',
  srnamespace: '6', srlimit: '10'
});
console.log('Search status:', r1.status);
if (r1.json && r1.json.query) {
  const files = r1.json.query.search.map(s => s.title);
  console.log('Found files:', files.length);
  console.log(files.slice(0, 10).join('\n'));
} else {
  console.log('Raw:', r1.raw);
}
