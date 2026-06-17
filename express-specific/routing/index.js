// Run:  node express-specific/routing/index.js   -> http://localhost:3002
const express = require('express');
const app = express();

// Static route
app.get('/about', (req, res) => res.send('About page'));

// IMPORTANT: specific route BEFORE the dynamic one
app.get('/users/me', (req, res) => res.json({ user: 'current logged-in user' }));

// Route params
app.get('/users/:id', (req, res) => {
  res.json({ id: req.params.id, type: typeof req.params.id }); // always a string
});

// Multiple params
app.get('/users/:userId/posts/:postId', (req, res) => {
  res.json({ user: req.params.userId, post: req.params.postId });
});

// Query params (?page=2&sort=asc)
app.get('/search', (req, res) => {
  res.json({ page: req.query.page ?? 1, sort: req.query.sort ?? 'asc', q: req.query.q });
});

// Chaining methods on one path with app.route()
app.route('/book')
  .get((req, res) => res.send('get a book'))
  .post((req, res) => res.send('add a book'))
  .put((req, res) => res.send('update a book'));

// Multiple handlers (mini middleware chain)
const log = (req, res, next) => { console.log('hit /chain'); next(); };
app.get('/chain', log, (req, res) => res.send('after the log middleware'));

app.listen(3002, () => {
  console.log('Routing demo on http://localhost:3002');
  console.log('Try: /users/me  /users/42  /users/7/posts/9  /search?page=2&sort=desc&q=node');
});
