import https from 'https';

// Try to get JSON-LD structured data from photo pages
const ids = [
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

for (const id of ids) {
  const url = 'https://unsplash.com/photos/' + id;
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      // Look for JSON-LD script tag
      const jsonLdMatch = data.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
      if (jsonLdMatch) {
        try {
          const jsonLd = JSON.parse(jsonLdMatch[1]);
          console.log(id + ': ' + (jsonLd.description || jsonLd.caption || 'No description'));
        } catch (e) {
          console.log(id + ': JSON-LD parse failed');
        }
      } else {
        console.log(id + ': No JSON-LD found');
      }
    });
  }).on('error', e => console.log(id + ': ' + e.message));
}