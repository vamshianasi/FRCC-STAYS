import https from 'https';

// Try additional Pexels IDs for the missing landmarks
const additionalIds = {
  'HITEC City': ['1914506', '1914507', '1914508', '1914509', '1914510', '1914511', '1914512', '1914513', '1914514', '1914515'],
  'Undavalli Caves': ['1914516', '1914517', '1914518', '1914519', '1914520', '1914521', '1914522', '1914523', '1914524', '1914525'],
  'Amaravati Stupa': ['1914526', '1914527', '1914528', '1914529', '1914530', '1914531', '1914532', '1914533', '1914534', '1914535'],
};

async function checkImage(id) {
  return new Promise((resolve) => {
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
  for (const [landmark, ids] of Object.entries(additionalIds)) {
    console.log('\n=== ' + landmark + ' ===');
    for (const id of ids) {
      const result = await checkImage(id);
      if (result.status === 200) {
        const sizeKB = Math.round(result.size / 1024);
        console.log('✓ ' + id + ': HTTP 200, ' + sizeKB + 'KB');
      } else {
        console.log('✗ ' + id + ': ' + (result.status || result.error));
      }
    }
  }
}

main();