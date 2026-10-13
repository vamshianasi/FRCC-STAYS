import https from 'https';

// Check specific Pexels IDs for their descriptions
const testIds = [
  // Hotel exterior - glass tower at dusk
  '33803734', '19219055', '19517376', '8082328', '32334284',
  '31474676', '29000046', '18269733', '30479386',
  // Hotel lobby - marble chandelier
  '14841129', '37729825', '34496715', '18269733', '30479386',
  '39205259', '39205253', '16104977', '34607320',
  // Rooftop pool city skyline
  '3011575', '18649226', '36644768', '19026489', '16094034',
  '19810875', '27206543', '33819401', '261102', '2291619',
  '11984085', '33647166', '27274134', '30560236',
  // Hotel facade with garden
  '19219055', '19517376', '8082328', '32334284', '33803734',
  '37729825', '34496715', '18269733', '30479386',
  // Luxury suite bedroom
  '18435555', '33561756', '2771935', '37526152', '29038821',
  '9119782', '35769254', '37182539', '668300', '30479386',
  // Fine dining restaurant
  '29000046', '31474676', '28238364', '34496701', '40156183',
  // Garden resort
  '18435555', '33561756', '2771935', '37526152', '29038821',
  '9119782', '35769254', '37182539', '668300', '30479386',
  // Villa private pool
  '19219055', '19517376', '8082328', '32334284', '33803734',
  '37729825', '34496715', '18269733', '30479386',
  // Spa lounge
  '29000046', '31474676', '28238364', '34496701', '40156183',
  '18435555', '33561756', '2771935', '37526152', '29038821',
];

async function checkDescription(id) {
  return new Promise((resolve) => {
    const url = 'https://www.pexels.com/photo/' + id + '/';
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const titleMatch = data.match(/<title[^>]*>([^<]+)<\/title>/i);
        const descMatch = data.match(/property="og:description" content="([^"]+)"/i) || data.match(/name="description" content="([^"]+)"/i);
        const title = titleMatch ? titleMatch[1].substring(0, 120) : 'No title';
        const desc = descMatch ? descMatch[1].substring(0, 200) : 'No description';
        resolve({ id, title, desc });
      });
    }).on('error', e => resolve({ id, title: 'Error', desc: e.message }));
  });
}

async function main() {
  console.log('Checking descriptions for ' + testIds.length + ' IDs...\n');
  for (const id of testIds) {
    const result = await checkDescription(id);
    console.log('\n' + result.id + ':');
    console.log('  Title: ' + result.title);
    console.log('  Desc: ' + result.desc);
  }
}

main();