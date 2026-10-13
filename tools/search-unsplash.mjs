import https from 'https';

// Search for good city-style hotel photos on Unsplash
const searchTerms = [
  'luxury city hotel exterior glass tower',
  'luxury hotel rooftop pool city skyline',
  'luxury hotel balcony city view',
  'luxury hotel garden courtyard',
  'luxury hotel lobby marble chandelier',
  'luxury hotel restaurant fine dining',
  'luxury hotel banquet hall ballroom',
  'luxury hotel gym fitness center',
  'luxury hotel bedroom city view',
  'luxury hotel suite living area'
];

const clientId = 'demo'; // Using demo - limited

async function searchUnsplash(query) {
  return new Promise((resolve) => {
    const url = 'https://api.unsplash.com/search/photos?query=' + encodeURIComponent(query) + '&per_page=10&client_id=' + clientId;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.results && result.results.length > 0) {
            console.log('\n=== ' + query + ' ===');
            result.results.slice(0, 5).forEach((photo, idx) => {
              console.log((idx+1) + '. ID: ' + photo.id + ' | ' + (photo.alt_description || 'No desc') + ' | ' + photo.urls.regular);
            });
          }
        } catch (e) {
          console.log('Error parsing ' + query + ': ' + e.message);
        }
        resolve();
      });
    }).on('error', (e) => {
      console.log('Error searching ' + query + ': ' + e.message);
      resolve();
    });
  });
}

async function main() {
  for (const term of searchTerms) {
    await searchUnsplash(term);
  }
}

main();