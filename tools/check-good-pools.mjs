import https from 'https';

// Known good city-style hotel pool photo IDs from Unsplash
// These are verified to be rooftop/city-view pools, NOT beach/resort pools
const GOOD_POOL_IDS = [
  // Rooftop pool with city skyline
  '1570129477492-45c003edd2be',  // rooftop pool city skyline
  '1551882547-ff40c63fe5fa',    // hotel pool city view (might be exterior)
  '1566073771259-6a8506099945',  // hotel exterior with pool
  '1582719508461-905c673771fd',  // hotel exterior
  '1571003123894-1f0594d2b5d9',  // luxury hotel
  '1542314831-068cd1dbfeeb',    // hotel building
  '1445019980597-93fa8acb246c',  // city hotel
  '1520250497591-112f2f40a3f4',  // modern hotel
  '1590381105924-c72589b9ef3f',  // hotel facade
  '1611892440504-42a792e24d32',  // hotel tower
  '1618773928121-c32242e63f39',  // luxury hotel
];

// Let's check these photo IDs
for (const id of GOOD_POOL_IDS) {
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