import https from 'https';

// Let's try to find actual working Pexels IDs for Indian landmarks by searching the web
// We'll use the Pexels search page to find photos

async function searchPexels(query) {
  return new Promise((resolve) => {
    const url = 'https://www.pexels.com/search/' + encodeURIComponent(query) + '/';
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Extract photo IDs from the search results
        const photoIds = [...new Set(data.match(/\/photo\/(\d+)\//g))];
        const ids = photoIds.map(m => m.match(/\d+/)[0]).slice(0, 5);
        resolve({ query, ids });
      });
    }).on('error', e => resolve({ query, ids: [], error: e.message }));
  });
}

const searches = [
  'Charminar Hyderabad',
  'Golconda Fort',
  'Hussain Sagar Buddha',
  'HITEC City Hyderabad',
  'Prakasam Barrage Vijayawada',
  'Kanaka Durga Temple',
  'Bhavani Island',
  'Undavalli Caves',
  'Amaravati Stupa',
  'Amareswara Temple',
  'Dhyana Buddha',
  'Krishna river Amaravathi'
];

async function main() {
  for (const query of searches) {
    const result = await searchPexels(query);
    console.log(query + ': ' + (result.ids.join(', ') || 'NONE'));
  }
}

main();