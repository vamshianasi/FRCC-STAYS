import https from 'https';

// Check various Pexels IDs for luxury hotel/resort photos
// These are candidate IDs I'll test
const candidateIds = [
  // Luxury hotel exterior / glass tower
  '33803734', '19219055', '19517376', '8082328', '32334284',
  '31474676', '29000046', '18269733', '30479386', '668300',
  '28238364', '34496701', '3011575', '18649226', '36644768',
  '19026489', '16094034', '40156183', '18435555', '33561756',
  // Hotel lobby
  '14841129', '37729825', '34496715', '18269733', '30479386',
  '39205259', '39205253', '16104977', '34607320',
  // Rooftop pool / pool
  '3011575', '18649226', '36644768', '19026489', '16094034',
  '19810875', '27206543', '33819401', '261102', '2291619',
  '11984085', '33647166', '27274134', '30560236',
  // Hotel facade / garden
  '19219055', '19517376', '8082328', '32334284', '33803734',
  '37729825', '34496715', '18269733',
  // Suite bedroom
  '18435555', '33561756', '2771935', '37526152', '29038821',
  '9119782', '35769254', '37182539', '668300', '30479386',
  // Restaurant
  '29000046', '31474676', '28238364', '34496701', '40156183',
  // Garden resort
  '18435555', '33561756', '2771935', '37526152', '29038821',
  '9119782', '35769254', '37182539', '668300', '30479386',
  // Villa pool
  '19219055', '19517376', '8082328', '32334284', '33803734',
  '37729825', '34496715', '18269733', '30479386',
  // Spa lounge
  '29000046', '31474676', '28238364', '34496701', '40156183',
  '18435555', '33561756', '2771935', '37526152', '29038821',
];

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
  console.log('Checking ' + candidateIds.length + ' candidate Pexels IDs...\n');
  const working = [];
  
  for (const id of candidateIds) {
    const result = await checkImage(id);
    if (result.status === 200) {
      const sizeKB = Math.round(result.size / 1024);
      if (sizeKB >= 50 && sizeKB <= 500) { // Reasonable size
        working.push({ id, sizeKB });
        console.log('✓ ' + id + ': HTTP 200, ' + sizeKB + 'KB');
      } else {
        console.log('⚠ ' + id + ': HTTP 200, ' + sizeKB + 'KB (size issue)');
      }
    } else {
      console.log('✗ ' + id + ': ' + (result.status || result.error));
    }
  }
  
  console.log('\n=== WORKING IDs (' + working.length + ') ===');
  working.forEach(w => console.log(w.id + ' (' + w.sizeKB + 'KB)'));
}

main();