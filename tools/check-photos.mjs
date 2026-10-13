import https from 'https';

const poolIds = [
  '1571896349842-33c89424de2d',
  '1540541338287-41700207dee6',
  '1551918120-9739cb430c6d',
  '1584132967334-10e028bd69f7',
  '1517248135467-4c7edcad34c4',
  '1552566626-52f8b828add9',
  '1466978913421-dad2ebd01d17',
  '1414235077428-338989a2e8c0',
  '1555396273-367ea4eb4db5',
  '1424847651672-bf20a4b0982b'
];

for (const id of poolIds) {
  const url = 'https://unsplash.com/photos/' + id;
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const titleMatch = data.match(/<title[^>]*>([^<]+)<\/title>/i);
      const descMatch = data.match(/property="og:description" content="([^"]+)"/i) || data.match(/name="description" content="([^"]+)"/i);
      const title = titleMatch ? titleMatch[1].substring(0, 100) : 'No title';
      const desc = descMatch ? descMatch[1].substring(0, 150) : 'No description';
      console.log(id + ': ' + title + ' | ' + desc);
    });
  }).on('error', (e) => console.log(id + ': ' + e.message));
}