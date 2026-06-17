// Run:  node express-specific/validation/index.js   -> http://localhost:3011
// Dependency-free demo of validation + a manual rate limiter + safe headers.
// Real apps: npm install express-validator zod helmet cors express-rate-limit
const express = require('express');
const app = express();
app.use(express.json());

// --- 1) Manual security headers (what `helmet` automates) ---
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('X-Frame-Options', 'DENY');
  res.set('Content-Security-Policy', "default-src 'self'");
  next();
});

// --- 2) Manual rate limiter (what `express-rate-limit` automates) ---
const hits = new Map();
app.use((req, res, next) => {
  const key = req.ip;
  const now = Date.now();
  const entry = hits.get(key) || { count: 0, reset: now + 10_000 };
  if (now > entry.reset) { entry.count = 0; entry.reset = now + 10_000; }
  entry.count++;
  hits.set(key, entry);
  if (entry.count > 20) return res.status(429).json({ error: 'Too many requests' });
  next();
});

// --- 3) Schema validation middleware (what Joi/Zod/express-validator give you) ---
const schema = {
  name:  (v) => typeof v === 'string' && v.trim().length >= 2 || 'name must be 2+ chars',
  email: (v) => /^[^@]+@[^@]+\.[^@]+$/.test(v) || 'invalid email',
  age:   (v) => v === undefined || (Number.isInteger(v) && v >= 0 && v < 150) || 'age out of range',
};
function validate(schema) {
  return (req, res, next) => {
    const errors = {};
    for (const [field, rule] of Object.entries(schema)) {
      const result = rule(req.body[field]);
      if (result !== true) errors[field] = result;
    }
    if (Object.keys(errors).length) return res.status(422).json({ errors });
    next();
  };
}

app.post('/signup', validate(schema), (req, res) => {
  res.status(201).json({ ok: true, user: { name: req.body.name, email: req.body.email } });
});

app.listen(3011, () => {
  console.log('Validation/security on http://localhost:3011');
  console.log('Valid:   curl -XPOST localhost:3011/signup -H "Content-Type: application/json" -d \'{"name":"Ada","email":"a@b.com"}\'');
  console.log('Invalid: curl -XPOST localhost:3011/signup -H "Content-Type: application/json" -d \'{"name":"x","email":"nope"}\'');
});
