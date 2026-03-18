const http = require('http');
const fs = require('fs');
const path = require('path');

const rootArg = process.argv[2] || 'k-photo-studio/dist';
const port = Number(process.argv[3] || '8085');
const host = process.argv[4] || '127.0.0.1';
const lifetimeMs = Number(process.argv[5] || '0');
const rootDir = path.resolve(process.cwd(), rootArg);

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
};

function send(res, statusCode, body, type) {
  res.writeHead(statusCode, { 'Content-Type': type });
  res.end(body);
}

function resolveRequestPath(urlPath) {
  const decodedPath = decodeURIComponent(urlPath.split('?')[0]);
  const normalizedPath = path.normalize(decodedPath).replace(/^(\.\.[/\\])+/, '');
  let filePath = path.join(rootDir, normalizedPath);

  if (decodedPath === '/' || decodedPath === '') {
    filePath = path.join(rootDir, 'index.html');
  }

  return filePath;
}

const server = http.createServer((req, res) => {
  const filePath = resolveRequestPath(req.url || '/');

  if (!filePath.startsWith(rootDir)) {
    send(res, 403, 'Forbidden', 'text/plain; charset=utf-8');
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (!statError && stats.isDirectory()) {
      const indexPath = path.join(filePath, 'index.html');
      fs.readFile(indexPath, (indexError, data) => {
        if (indexError) {
          send(res, 404, 'Not Found', 'text/plain; charset=utf-8');
          return;
        }

        send(res, 200, data, contentTypes['.html']);
      });
      return;
    }

    fs.readFile(filePath, (readError, data) => {
      if (readError) {
        const fallbackPath = path.join(rootDir, 'index.html');
        fs.readFile(fallbackPath, (fallbackError, fallbackData) => {
          if (fallbackError) {
            send(res, 404, 'Not Found', 'text/plain; charset=utf-8');
            return;
          }

          send(res, 200, fallbackData, contentTypes['.html']);
        });
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      send(res, 200, data, contentTypes[ext] || 'application/octet-stream');
    });
  });
});

server.listen(port, host, () => {
  console.log(`Static server ready at http://${host}:${port}/`);
  console.log(`Serving ${rootDir}`);
});

if (lifetimeMs > 0) {
  setTimeout(() => {
    console.log(`Stopping server after ${lifetimeMs}ms`);
    server.close(() => process.exit(0));
  }, lifetimeMs);
}

server.on('error', (error) => {
  console.error(error);
  process.exit(1);
});
