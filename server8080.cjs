const http = require('http');
const fs = require('fs');
const path = require('path');
const server = http.createServer((req, res) => {
  let p = path.join(process.cwd(), 'dist', req.url === '/' ? '/index.html' : req.url);
  if (!fs.existsSync(p)) p = path.join(process.cwd(), 'dist', 'index.html');
  const ext = path.extname(p);
  const mime = {'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.ico':'image/x-icon'};
  res.writeHead(200, {'Content-Type': mime[ext] || 'application/octet-stream'});
  fs.createReadStream(p).pipe(res);
});
server.listen(8080, '0.0.0.0', () => console.log('Server running on http://localhost:8080'));