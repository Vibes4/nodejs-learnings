// Run:  node express-specific/router/index.js   -> http://localhost:3006
// Shows modular routers + router-level middleware, all in one file for the demo.
// (In a real app each router lives in its own file under routes/.)
const express = require('express');
const app = express();
app.use(express.json());

// ---- users router ----
const usersRouter = express.Router();
const users = [{ id: 1, name: 'Ada' }, { id: 2, name: 'Linus' }];
usersRouter.get('/', (req, res) => res.json(users));
usersRouter.get('/:id', (req, res) => {
  const u = users.find((x) => x.id === Number(req.params.id));
  u ? res.json(u) : res.status(404).json({ error: 'not found' });
});

// ---- admin router with router-level auth middleware ----
const adminRouter = express.Router();
adminRouter.use((req, res, next) => {
  if (req.headers['x-admin'] !== 'true') return res.status(403).json({ error: 'admins only' });
  next();   // protects EVERY route in this router
});
adminRouter.get('/stats', (req, res) => res.json({ users: users.length }));

// ---- nested router with mergeParams ----
const postsRouter = express.Router({ mergeParams: true });
postsRouter.get('/', (req, res) => res.json({ ownerId: req.params.userId, posts: [] }));

// Mount everything (this is the part that lives in app.js normally)
app.use('/api/users', usersRouter);
app.use('/api/users/:userId/posts', postsRouter);
app.use('/api/admin', adminRouter);

app.listen(3006, () => {
  console.log('Router demo on http://localhost:3006');
  console.log('Try: /api/users   /api/users/1   /api/users/1/posts');
  console.log('     curl -H "x-admin: true" localhost:3006/api/admin/stats');
});
