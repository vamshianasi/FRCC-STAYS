import https from 'https';

// Search Pexels for luxury hotel/resort photos
async function searchPexels(query) {
  return new Promise((resolve) => {
    const url = 'https://www.pexels.com/search/' + encodeURIComponent(query) + '/';
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Extract photo IDs from the search results
        const photoIds = [...new Set(data.match(/\/photo\/(\d+)\//g))];
        const ids = photoIds.map(m => m.match(/\d+/)[0]).slice(0, 10);
        resolve({ query, ids });
      });
    }).on('error', e => resolve({ query, ids: [], error: e.message }));
  });
}

const searches = [
  // Hyderabad: hotel exterior, lobby, rooftop pool
  'luxury hotel exterior glass tower city dusk',
  'luxury hotel lobby marble chandelier',
  'luxury hotel rooftop pool city skyline',
  // Vijayawada: hotel facade with garden, luxury suite bedroom, fine dining restaurant
  'luxury hotel facade garden driveway',
  'luxury hotel suite bedroom city view',
  'luxury hotel restaurant fine dining interior',
  // Amaravathi: garden resort, villa pool, spa lounge
  'luxury garden resort hotel lawn',
  'luxury villa private pool garden',
  'luxury hotel spa lounge interior'
];

async function main() {
  for (const query of searches) {
    const result = await searchPexels(query);
    console.log(query + ': ' + (result.ids.join(', ') || 'NONE'));
  }
}

main();