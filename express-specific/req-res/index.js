// Run:  node express-specific/req-res/index.js   -> http://localhost:3004
const express = require('express');
const app = express();
app.use(express.json());

// Inspect the request
app.get('/inspect/:id', (req, res) => {
  res.json({
    params: req.params,
    query: req.query,
    method: req.method,
    path: req.path,
    protocol: req.protocol,
    hostname: req.hostname,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
});

// Response helpers
app.get('/html', (req, res) => res.send('<b>html string</b>'));            // text/html
app.get('/json', (req, res) => res.send({ auto: 'detected as json' }));    // application/json
app.get('/created', (req, res) => res.status(201).json({ ok: true }));     // chained status
app.get('/teapot', (req, res) => res.sendStatus(418));                     // status + text
app.get('/go', (req, res) => res.redirect('/json'));                       // 302 redirect

// Set headers + cookie
app.get('/with-headers', (req, res) => {
  res.set('X-Custom', 'hello');
  res.cookie('session', 'abc123', { httpOnly: true, maxAge: 3600_000 });
  res.json({ note: 'check response headers + Set-Cookie' });
});

app.listen(3004, () => {
  console.log('req/res demo on http://localhost:3004');
  console.log('Try: /inspect/42?sort=asc   /html   /json   /created   /go   /with-headers');
});
