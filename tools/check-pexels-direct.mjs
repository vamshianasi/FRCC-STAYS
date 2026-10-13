import https from 'https';

// Try direct image URLs from Pexels (bypassing the page)
const testIds = [
  // Charminar
  '3717267', '1497259', '3360197', '4170713',
  // Golconda Fort
  '3717271', '1497260', '3360198',
  // Hussain Sagar
  '3717272', '1497261',
  // HITEC City
  '3717273', '1497262',
  // Prakasam Barrage
  '3717274', '1497263',
  // Kanaka Durga Temple
  '3717275', '1497264',
  // Bhavani Island
  '3717276',
  // Undavalli Caves
  '3717277', '1497265',
  // Amaravati Stupa
  '3717278', '1497266',
  // Amareswara Temple
  '3717279', '1497267',
  // Dhyana Buddha
  '3717280', '1497268',
  // Krishna River
  '3717281', '1497269'
];

async function checkImage(id) {
  return new Promise((resolve) => {
    // Try the direct Pexels image URL
    const url = 'https://images.pexels.com/photos/' + id + '/pexels-photo-' + id + '.jpeg?auto=compress&cs=tinysrgb&w=1200';
    const req = https.get(url, (res) => {
      resolve({ id, status: res.statusCode, size: res.headers['content-length'] });
      req.destroy();
    });
    req.on('error', (e) => resolve({ id, error: e.message }));
    req.setTimeout(5000, () => { req.destroy(); resolve({ id, error: 'timeout' }); });
  });
}

async function main() {
  console.log('Checking Pexels direct image URLs...\n');
  for (const id of testIds) {
    const result = await checkImage(id);
    if (result.status === 200) {
      const sizeKB = Math.round(result.size / 1024);
      console.log('✓ ' + id + ': HTTP 200, ' + sizeKB + 'KB');
    } else {
      console.log('✗ ' + id + ': ' + (result.status || result.error));
    }
  }
}

main();