import https from 'https';

// Try Unsplash embed API with different format
const ids = [
  '1571896349842-33c89424de2d',
  '1540541338287-41700207dee6',
  '1551918120-9739cb430c6d',
];

for (const id of ids) {
  const url = 'https://unsplash.com/photos/' + id + '?format=json';
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(id + ' status: ' + res.statusCode);
      try {
        const result = JSON.parse(data);
        console.log(id + ': ' + JSON.stringify(result).substring(0, 200));
      } catch (e) {
        console.log(id + ': Not JSON, length: ' + data.length);
      }
    });
  }).on('error', e => console.log(id + ': ' + e.message));
}