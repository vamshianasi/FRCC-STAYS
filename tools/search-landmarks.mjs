import https from 'https';

// Search for landmark photos on Unsplash (using demo client_id)
async function searchUnsplash(query) {
  return new Promise((resolve) => {
    const url = 'https://api.unsplash.com/search/photos?query=' + encodeURIComponent(query) + '&per_page=10&client_id=demo';
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (e) {
          resolve({results: []});
        }
      });
    }).on('error', () => resolve({results: []}));
  });
}

const landmarks = {
  'Hyderabad': [
    { name: 'Charminar', query: 'Charminar Hyderabad monument' },
    { name: 'Golconda Fort', query: 'Golconda Fort Hyderabad' },
    { name: 'Hussain Sagar Lake Buddha', query: 'Hussain Sagar Lake Buddha statue Hyderabad' },
    { name: 'HITEC City skyline', query: 'HITEC City Hyderabad skyline' }
  ],
  'Vijayawada': [
    { name: 'Prakasam Barrage', query: 'Prakasam Barrage Krishna river Vijayawada' },
    { name: 'Kanaka Durga Temple', query: 'Kanaka Durga Temple Vijayawada' },
    { name: 'Bhavani Island', query: 'Bhavani Island Krishna river Vijayawada' },
    { name: 'Undavalli Caves', query: 'Undavalli Caves Vijayawada' }
  ],
  'Amaravathi': [
    { name: 'Amaravati Stupa', query: 'Amaravati Stupa Mahachaitya' },
    { name: 'Amareswara Temple', query: 'Amareswara Swamy Temple Amaravathi' },
    { name: 'Dhyana Buddha', query: 'Dhyana Buddha statue Amaravathi' },
    { name: 'Krishna river Amaravathi', query: 'Krishna river Amaravathi Andhra Pradesh' }
  ]
};

async function main() {
  for (const [city, landmarksList] of Object.entries(landmarks)) {
    console.log('\n=== ' + city + ' ===');
    for (const landmark of landmarksList) {
      const result = await searchUnsplash(landmark.query);
      if (result.results && result.results.length > 0) {
        console.log('\n' + landmark.name + ':');
        result.results.slice(0, 3).forEach((photo, i) => {
          console.log('  ' + (i+1) + '. ' + photo.id + ' - ' + (photo.alt_description || 'No desc') + ' | ' + photo.urls.regular);
        });
      } else {
        console.log('\n' + landmark.name + ': NO RESULTS');
      }
    }
  }
}

main();