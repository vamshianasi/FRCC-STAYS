const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 3000;
const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json'
};
http.createServer((req, res) => {
  let filePath = path.join(__dirname, 'dist', req.url === '/' ? '/index.html' : req.url);
  if (!fs.existsSync(filePath)) filePath = path.join(__dirname, 'dist', 'index.html');
  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
}).listen(PORT, '0.0.0.0', () => console.log('Server running on http://localhost:' + PORT));