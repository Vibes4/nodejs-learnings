// Run:  npm install   (once, from the project root)
// Then: node express-specific/basics/index.js   -> http://localhost:3001
const express = require('express');
const app = express();

// Settings
app.set('x-powered-by', false);

// A simple route
app.get('/', (req, res) => {
  res.send('<h1>Hello from Express</h1>');   // sets Content-Type: text/html automatically
});

// JSON response helper (vs raw http where you stringify + set headers by hand)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Different status + send
app.get('/teapot', (req, res) => {
  res.status(418).json({ error: "I'm a teapot" });
});

const server = app.listen(3001, () => {
  console.log('Express basics on http://localhost:3001');
  console.log('Routes: /  /api/health  /teapot');
  console.log('(app.listen returns:', server.constructor.name + ')');
});
