// Run:  node express-specific/why-express/index.js
// Boots the SAME API two ways — raw Node http vs Express — so you can compare the code.
const http = require('http');
const express = require('express');

const users = [{ id: 1, name: 'Ada' }];

// ---------- RAW NODE: everything by hand ----------
const rawServer = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/users') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(users));
  }
  if (req.method === 'POST' && req.url === '/users') {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      try {
        const data = JSON.parse(body);                 // manual parse
        const user = { id: users.length + 1, name: data.name };
        users.push(user);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
      } catch {
        res.writeHead(400); res.end('Bad JSON');
      }
    });
    return;
  }
  res.writeHead(404); res.end('Not found');            // manual 404
});

// ---------- EXPRESS: the same thing, far less code ----------
const app = express();
app.use(express.json());                                // body parsing in one line
app.get('/users', (req, res) => res.json(users));       // routing + json helper
app.post('/users', (req, res) => {
  const user = { id: users.length + 1, name: req.body.name };
  users.push(user);
  res.status(201).json(user);                           // status + json
});
// 404 + errors handled by Express defaults

rawServer.listen(7001, () => console.log('RAW node http  -> http://localhost:7001/users'));
app.listen(7002, () => {
  console.log('EXPRESS        -> http://localhost:7002/users');
  console.log('\nSame behavior. Compare this file: raw http needs manual routing, body');
  console.log('parsing, status/headers, and 404. Express collapses all of it.');
  console.log('\nTry: curl localhost:7001/users   vs   curl localhost:7002/users');
});
