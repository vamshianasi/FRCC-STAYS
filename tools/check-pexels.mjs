import https from 'https';

// Check Pexels pool photo pages
const pexelsIds = ['3011575', '18649226', '36644768', '19026489', '16094034'];

for (const id of pexelsIds) {
  const url = 'https://www.pexels.com/photo/' + id + '/';
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const titleMatch = data.match(/<title[^>]*>([^<]+)<\/title>/i);
      const descMatch = data.match(/property="og:description" content="([^"]+)"/i) || data.match(/name="description" content="([^"]+)"/i);
      const title = titleMatch ? titleMatch[1].substring(0, 100) : 'No title';
      const desc = descMatch ? descMatch[1].substring(0, 150) : 'No description';
      console.log(id + ': ' + title + ' | ' + desc);
    });
  }).on('error', e => console.log(id + ': ' + e.message));
}