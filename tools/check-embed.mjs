import https from 'https';

const ids = ['1571896349842-33c89424de2d', '1540541338287-41700207dee6', '1551918120-9739cb430c6d'];

for (const id of ids) {
  const url = 'https://unsplash.com/photos/' + id + '/embed';
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const titleMatch = data.match(/<title[^>]*>([^<]+)<\/title>/i);
      console.log(id + ': ' + (titleMatch ? titleMatch[1] : 'No title'));
    });
  }).on('error', e => console.log(id + ': ' + e.message));
}