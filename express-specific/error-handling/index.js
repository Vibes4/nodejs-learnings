// Run:  node express-specific/error-handling/index.js   -> http://localhost:3008
// Demonstrates EVERY error-handler level: route, async, router-level, 404, app-level.
const express = require('express');
const app = express();

// Custom operational error carrying an HTTP status
class AppError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.isOperational = true;   // expected error (vs a bug)
  }
}

// Wrapper so async route rejections reach the error handler (Express 4 pattern)
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// 1) ROUTE-LEVEL: synchronous throw -> caught by Express, bubbles to app handler
app.get('/sync-error', (req, res) => {
  throw new AppError('synchronous failure', 400);
});

// 2) ROUTE-LEVEL: async error via wrapper -> next(err)
app.get('/async-error', asyncHandler(async (req, res) => {
  await new Promise((_, reject) => setTimeout(() => reject(new AppError('db timeout', 503)), 50));
}));

// 3) ROUTER-LEVEL error handler: scoped to this router only
const usersRouter = express.Router();
usersRouter.get('/:id', (req, res) => {
  if (req.params.id === '0') throw new AppError('user id cannot be 0', 422);
  res.json({ id: req.params.id, name: 'Ada' });
});
// 4-arg handler attached to THIS router — handles its errors first
usersRouter.use((err, req, res, next) => {
  console.error(`[users-router] ${err.message}`);
  if (err.code === 422) {
    return res.status(422).json({ scope: 'users-router', error: err.message });
  }
  next(err);   // anything else bubbles up to the app-level handler
});
app.use('/users', usersRouter);

app.get('/', (req, res) => res.send('Try /sync-error  /async-error  /users/5  /users/0  /missing'));

// 4) 404 catch-all (after all routes, before the error handler)
app.use((req, res) => res.status(404).json({ error: `Not found: ${req.path}` }));

// 5) APPLICATION-LEVEL global error handler — LAST, 4 args
app.use((err, req, res, next) => {
  const status = err.code || 500;
  console.error(`[app-handler] ${status} ${err.message}`);   // full detail server-side
  res.status(status).json({
    scope: 'app-handler',
    error: err.isOperational ? err.message : 'Internal server error',  // sanitize unknowns
  });
});

app.listen(3008, () => {
  console.log('Express error handling on http://localhost:3008');
  console.log('  /sync-error  -> 400 (app-handler)');
  console.log('  /async-error -> 503 (app-handler, via async wrapper)');
  console.log('  /users/0     -> 422 (users-router handler)');
  console.log('  /users/5     -> 200 ok');
  console.log('  /missing     -> 404 catch-all');
});
