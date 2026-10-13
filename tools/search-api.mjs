import https from 'https';

// Try Unsplash API search with demo key
const searchUrl = 'https://api.unsplash.com/search/photos?query=luxury+city+hotel+rooftop+pool&per_page=10&client_id=demo';
https.get(searchUrl, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status: ' + res.statusCode);
    console.log('Headers: ' + JSON.stringify(res.headers));
    try {
      const result = JSON.parse(data);
      console.log('Result: ' + JSON.stringify(result, null, 2));
    } catch (e) {
      console.log('Raw: ' + data.substring(0, 500));
    }
  });
}).on('error', e => console.log('Error: ' + e.message));