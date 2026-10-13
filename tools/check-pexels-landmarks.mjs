import https from 'https';

// Check Pexels photos for landmark IDs
// These are some known Pexels IDs for Indian landmarks
const landmarkIds = {
  'Hyderabad': {
    'Charminar': ['3717267', '1497259', '3360197', '4170713', '3717270'],
    'Golconda Fort': ['3717271', '1497260', '3360198'],
    'Hussain Sagar': ['3717272', '1497261'],
    'HITEC City': ['3717273', '1497262']
  },
  'Vijayawada': {
    'Prakasam Barrage': ['3717274', '1497263'],
    'Kanaka Durga Temple': ['3717275', '1497264'],
    'Bhavani Island': ['3717276'],
    'Undavalli Caves': ['3717277', '1497265']
  },
  'Amaravathi': {
    'Amaravati Stupa': ['3717278', '1497266'],
    'Amareswara Temple': ['3717279', '1497267'],
    'Dhyana Buddha': ['3717280', '1497268'],
    'Krishna River': ['3717281', '1497269']
  }
};

async function checkPexelsPhoto(id) {
  return new Promise((resolve) => {
    const url = 'https://www.pexels.com/photo/' + id + '/';
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const titleMatch = data.match(/<title[^>]*>([^<]+)<\/title>/i);
        const descMatch = data.match(/property="og:description" content="([^"]+)"/i) || data.match(/name="description" content="([^"]+)"/i);
        const title = titleMatch ? titleMatch[1].substring(0, 100) : 'No title';
        const desc = descMatch ? descMatch[1].substring(0, 150) : 'No description';
        resolve({ id, title, desc, status: res.statusCode });
      });
    }).on('error', e => resolve({ id, error: e.message }));
  });
}

async function main() {
  for (const [city, landmarks] of Object.entries(landmarkIds)) {
    console.log('\n=== ' + city + ' ===');
    for (const [landmark, ids] of Object.entries(landmarks)) {
      console.log('\n' + landmark + ':');
      for (const id of ids) {
        const result = await checkPexelsPhoto(id);
        console.log('  ' + result.id + ': ' + result.title + ' | ' + result.desc);
      }
    }
  }
}

main();