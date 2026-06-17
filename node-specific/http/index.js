// Run:  node node-specific/http/index.js   then visit http://localhost:4000
// A pure-Node HTTP server. Notice how much you do by hand vs Express.
const http = require('http');
const { URL } = require('url');

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const route = `${req.method} ${url.pathname}`;

  // ---- Manual routing ----
  if (route === 'GET /') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Hello from raw Node http!' }));
  }

  if (route === 'GET /greet') {
    // ---- Manual query parsing ----
    const name = url.searchParams.get('name') || 'stranger';
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end(`Hi, ${name}!`);
  }

  if (route === 'POST /echo') {
    // ---- Manual body parsing (what express.json() does for you) ----
    const chunks = [];
    let size = 0;
    req.on('data', (c) => {
      size += c.length;
      if (size > 1e6) { res.writeHead(413).end('Payload too large'); req.destroy(); }
      chunks.push(c);
    });
    req.on('end', () => {
      try {
        const body = JSON.parse(Buffer.concat(chunks).toString() || '{}');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ youSent: body }));
      } catch {
        res.writeHead(400).end('Invalid JSON');
      }
    });
    return;
  }

  // ---- Manual 404 ----
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(4000, () => {
  console.log('Raw Node server on http://localhost:4000');
  console.log('Try:  curl http://localhost:4000/greet?name=Vaibhav');
  console.log('      curl -XPOST http://localhost:4000/echo -d \'{"a":1}\' -H "Content-Type: application/json"');
});
