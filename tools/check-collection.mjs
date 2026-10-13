import https from 'https';

// Try to access a curated Unsplash collection for city hotels
const collectionUrl = 'https://unsplash.com/collections/1098808/city-hotels';
https.get(collectionUrl, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Extract photo IDs from collection page
    const photoIds = [...new Set(data.match(/photo-[a-z0-9-]{30,}/g))];
    console.log('Found ' + photoIds.length + ' photo IDs:');
    photoIds.slice(0, 30).forEach(id => console.log(id));
  });
}).on('error', e => console.log('Error: ' + e.message));