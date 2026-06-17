// Run:  node express-specific/auth-jwt/index.js   -> http://localhost:3012
// Dependency-free: a real HS256 JWT built with the crypto module + scrypt password hashing.
// Real apps:  npm install jsonwebtoken bcrypt
const express = require('express');
const crypto = require('crypto');
const app = express();
app.use(express.json());

const SECRET = 'demo-secret-change-me';
const b64url = (buf) => Buffer.from(buf).toString('base64url');

// --- Minimal JWT (HS256) ---
function signJwt(payload, expiresInSec = 900) {
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(process.hrtime.bigint() ? Date.now() / 1000 : 0); // Date.now ok in node runtime
  const body = b64url(JSON.stringify({ ...payload, iat: now, exp: now + expiresInSec }));
  const sig = b64url(crypto.createHmac('sha256', SECRET).update(`${header}.${body}`).digest());
  return `${header}.${body}.${sig}`;
}
function verifyJwt(token) {
  const [h, b, sig] = token.split('.');
  if (!h || !b || !sig) throw new Error('malformed token');
  const expected = b64url(crypto.createHmac('sha256', SECRET).update(`${h}.${b}`).digest());
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) throw new Error('bad signature');
  const payload = JSON.parse(Buffer.from(b, 'base64url').toString());
  if (payload.exp < Math.floor(Date.now() / 1000)) throw new Error('token expired');
  return payload;
}

// --- Password hashing (scrypt; bcrypt/argon2 in real apps) ---
const hashPw = (pw) => { const s = crypto.randomBytes(16).toString('hex'); return s + ':' + crypto.scryptSync(pw, s, 64).toString('hex'); };
const checkPw = (pw, stored) => { const [s, k] = stored.split(':'); return crypto.timingSafeEqual(Buffer.from(k, 'hex'), crypto.scryptSync(pw, s, 64)); };

const users = [{ id: 1, email: 'admin@x.com', pw: hashPw('password123'), role: 'admin' }];

// --- Auth middleware ---
function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'missing token' });
  try { req.user = verifyJwt(token); next(); }
  catch (e) { return res.status(401).json({ error: e.message }); }
}
const authorize = (role) => (req, res, next) =>
  req.user.role === role ? next() : res.status(403).json({ error: 'forbidden' });

// --- Routes ---
app.post('/login', (req, res) => {
  const u = users.find((x) => x.email === req.body.email);
  if (!u || !checkPw(req.body.password || '', u.pw)) return res.status(401).json({ error: 'bad credentials' });
  res.json({ token: signJwt({ sub: u.id, role: u.role }) });
});

app.get('/me', authenticate, (req, res) => res.json({ you: req.user }));
app.get('/admin', authenticate, authorize('admin'), (req, res) => res.json({ secret: 'admin only' }));

app.listen(3012, () => {
  console.log('JWT auth on http://localhost:3012');
  console.log('1) TOKEN=$(curl -s -XPOST localhost:3012/login -H "Content-Type: application/json" -d \'{"email":"admin@x.com","password":"password123"}\' | jq -r .token)');
  console.log('2) curl localhost:3012/me -H "Authorization: Bearer $TOKEN"');
});
