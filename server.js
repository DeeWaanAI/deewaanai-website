const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

http
  .createServer((req, res) => {
    let urlPath;
    try {
      urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    } catch {
      res.writeHead(400);
      res.end();
      return;
    }
    let filePath = path.normalize(path.join(ROOT, urlPath));
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403);
      res.end();
      return;
    }
    if (urlPath.endsWith('/')) filePath = path.join(filePath, 'index.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          fs.readFile(path.join(ROOT, '404.html'), (e2, d2) => {
            if (e2) {
              res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
              res.end('404 Not Found');
            } else {
              res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
              res.end(d2);
            }
          });
        } else {
          res.writeHead(500);
          res.end();
        }
        return;
      }
      const type = MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': type });
      res.end(data);
    });
  })
  .listen(PORT, () => console.log(`DeeWaanAI site listening on :${PORT}`));
