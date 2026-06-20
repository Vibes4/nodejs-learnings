// Run:  node system-design/url-shortener/index.js
// Base62 encode/decode of an auto-increment id — the collision-free way to mint
// short keys. encode(id) -> short key; decode(key) -> id (round-trip). No deps.

const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const BASE = ALPHABET.length; // 62

// Encode a non-negative integer id into a base62 string.
function encode(id) {
  if (id === 0) return ALPHABET[0];
  let s = '';
  while (id > 0) {
    s = ALPHABET[id % BASE] + s; // prepend least-significant digit
    id = Math.floor(id / BASE);
  }
  return s;
}

// Decode a base62 string back into the original integer id.
function decode(key) {
  let id = 0;
  for (const ch of key) {
    id = id * BASE + ALPHABET.indexOf(ch);
  }
  return id;
}

// --- Simulate a shortener backed by an auto-increment id ---
let counter = 100000; // pretend the DB sequence is already here
const store = new Map(); // shortKey -> longUrl

function shorten(longUrl) {
  const id = counter++;
  const key = encode(id);
  store.set(key, longUrl);
  return { id, key, short: `https://sho.rt/${key}` };
}

const urls = [
  'https://example.com/some/very/long/path?with=params',
  'https://anthropic.com/research',
  'https://github.com/nodejs/node',
];

console.log('--- Shortening URLs ---');
for (const u of urls) {
  const { id, key, short } = shorten(u);
  console.log(`id=${id}  key=${key}  ${short}`);
}

console.log('\n--- Round-trip check (encode/decode are inverses) ---');
for (const id of [0, 61, 62, 100000, 3521614606207]) {
  const key = encode(id);
  console.log(`${id} -> "${key}" -> ${decode(key)}  ${decode(key) === id ? 'OK' : 'MISMATCH'}`);
}

console.log('\n--- Redirect lookup ---');
const someKey = encode(100000);
console.log(`GET /${someKey} -> 302 -> ${store.get(someKey)}`);
