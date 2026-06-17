// Run:  node node-specific/crypto/index.js
const crypto = require('crypto');

// 1) Hashing (integrity / checksums)
const hash = crypto.createHash('sha256').update('hello world').digest('hex');
console.log('--- sha256 ---');
console.log('hash:', hash);

// 2) Secure random values (tokens, IDs, salts)
console.log('\n--- secure random ---');
console.log('randomBytes(16) hex:', crypto.randomBytes(16).toString('hex'));
console.log('randomUUID()       :', crypto.randomUUID());

// 3) Password hashing the RIGHT way: scrypt + per-user salt
console.log('\n--- password hashing (scrypt) ---');
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}
function verifyPassword(password, stored) {
  const [salt, key] = stored.split(':');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  // constant-time compare
  return crypto.timingSafeEqual(Buffer.from(key, 'hex'), Buffer.from(derived, 'hex'));
}
const stored = hashPassword('S3cret!');
console.log('stored          :', stored.slice(0, 40) + '...');
console.log('verify correct  :', verifyPassword('S3cret!', stored));
console.log('verify wrong    :', verifyPassword('wrong', stored));

// 4) HMAC (signing — e.g. webhook verification, JWT HS256)
console.log('\n--- HMAC ---');
const sig = crypto.createHmac('sha256', 'shared-secret').update('payload').digest('hex');
console.log('signature:', sig);

// 5) Symmetric encryption (AES-256-GCM)
console.log('\n--- AES-256-GCM encrypt/decrypt ---');
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(12);
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
let enc = cipher.update('top secret', 'utf8', 'hex') + cipher.final('hex');
const tag = cipher.getAuthTag();
const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
decipher.setAuthTag(tag);
let dec = decipher.update(enc, 'hex', 'utf8') + decipher.final('utf8');
console.log('encrypted:', enc);
console.log('decrypted:', dec);
