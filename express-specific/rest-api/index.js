// Run:  node express-specific/rest-api/index.js   -> http://localhost:3010
// A complete in-memory CRUD REST API with proper verbs, status codes, pagination.
const express = require('express');
const app = express();
app.use(express.json());

let nextId = 3;
let users = [{ id: 1, name: 'Ada' }, { id: 2, name: 'Linus' }];
const find = (id) => users.find((u) => u.id === Number(id));

// LIST with pagination  GET /api/v1/users?page=1&limit=10
app.get('/api/v1/users', (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 10);
  const start = (page - 1) * limit;
  res.json({
    data: users.slice(start, start + limit),
    meta: { page, limit, total: users.length },
  });
});

// READ  GET /api/v1/users/:id
app.get('/api/v1/users/:id', (req, res) => {
  const u = find(req.params.id);
  return u ? res.json(u) : res.status(404).json({ error: 'User not found' });
});

// CREATE  POST -> 201
app.post('/api/v1/users', (req, res) => {
  if (!req.body.name) return res.status(400).json({ error: 'name is required' });
  const user = { id: nextId++, name: req.body.name };
  users.push(user);
  res.status(201).location(`/api/v1/users/${user.id}`).json(user);
});

// FULL UPDATE  PUT (idempotent)
app.put('/api/v1/users/:id', (req, res) => {
  const u = find(req.params.id);
  if (!u) return res.status(404).json({ error: 'User not found' });
  if (!req.body.name) return res.status(400).json({ error: 'name is required' });
  u.name = req.body.name;
  res.json(u);
});

// PARTIAL UPDATE  PATCH
app.patch('/api/v1/users/:id', (req, res) => {
  const u = find(req.params.id);
  if (!u) return res.status(404).json({ error: 'User not found' });
  Object.assign(u, req.body);
  res.json(u);
});

// DELETE -> 204 No Content
app.delete('/api/v1/users/:id', (req, res) => {
  const before = users.length;
  users = users.filter((u) => u.id !== Number(req.params.id));
  return users.length < before ? res.sendStatus(204) : res.status(404).json({ error: 'not found' });
});

app.listen(3010, () => {
  console.log('REST API on http://localhost:3010');
  console.log('curl localhost:3010/api/v1/users');
  console.log('curl -XPOST localhost:3010/api/v1/users -H "Content-Type: application/json" -d \'{"name":"Grace"}\'');
});
