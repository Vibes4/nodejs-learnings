// Run:  node express-specific/middleware/index.js   -> http://localhost:3003
const express = require('express');
const app = express();

// 1) Application-level middleware: a request logger (runs for EVERY request)
app.use((req, res, next) => {
  req.startTime = Date.now();
  console.log(`-> ${req.method} ${req.url}`);
  res.on('finish', () => console.log(`<- ${res.statusCode} in ${Date.now() - req.startTime}ms`));
  next();   // MUST call next() or the request hangs
});

// 2) Built-in middleware: parse JSON bodies
app.use(express.json());

// 3) Path-specific middleware: only runs for /admin/*
app.use('/admin', (req, res, next) => {
  if (req.query.token !== 'secret') return res.status(403).json({ error: 'forbidden' });
  next();
});

// 4) Route-level middleware chain
const requireName = (req, res, next) => {
  if (!req.body.name) return res.status(400).json({ error: 'name required' });
  next();
};
app.post('/users', requireName, (req, res) => {
  res.status(201).json({ created: req.body.name });
});

app.get('/admin/dashboard', (req, res) => res.json({ secret: 'admin data' }));
app.get('/', (req, res) => res.send('check your console for the logger output'));

// 5) Error-handling middleware (4 args) — always LAST
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'something broke' });
});

app.listen(3003, () => {
  console.log('Middleware demo on http://localhost:3003');
  console.log('Try: curl -XPOST localhost:3003/users -d \'{"name":"Vaibhav"}\' -H "Content-Type: application/json"');
  console.log('     curl localhost:3003/admin/dashboard?token=secret');
});
