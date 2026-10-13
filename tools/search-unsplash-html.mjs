import https from 'https';

// Search Unsplash HTML for city hotel pool photos
const searchUrl = 'https://unsplash.com/s/photos/luxury-city-hotel-rooftop-pool';
https.get(searchUrl, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Extract photo IDs from the page
    const photoIds = [...new Set(data.match(/photo-[a-z0-9-]{30,}/g))];
    console.log('Found ' + photoIds.length + ' photo IDs:');
    photoIds.slice(0, 20).forEach(id => console.log(id));
  });
}).on('error', e => console.log('Error: ' + e.message));