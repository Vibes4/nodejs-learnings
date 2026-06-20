// Run:  node javascript/es-features/index.js

// --- destructuring with defaults, rename, nested ---
const config = { port: 0, host: 'localhost', db: { name: 'app' } };
const { port = 3000, missing = 'fallback', db: { name } } = config;
console.log(port, missing, name);   // 0 fallback app  (default skipped: 0 is defined)

// --- optional chaining ?. ---
const user = { profile: { contact: null } };
console.log(user?.profile?.contact?.email); // undefined (no throw)
console.log(user?.profile?.name ?? 'anon');  // anon
console.log(user.save?.());                   // undefined (method doesn't exist)

// --- nullish ?? vs || ---
console.log(0 || 'def');   // 'def'  (0 is falsy)
console.log(0 ?? 'def');   // 0      (0 is not null/undefined)
console.log('' ?? 'def');  // ''
console.log(null ?? 'def');// 'def'

// --- template literals (interpolation + multi-line) ---
const n = 'Ada';
console.log(`Hello, ${n}!
Sum is ${1 + 2}`);          // Hello, Ada! \n Sum is 3

// --- default & rest params ---
function total(tax = 0, ...amounts) {
  return amounts.reduce((s, a) => s + a, 0) * (1 + tax);
}
console.log(total(0.1, 100, 200)); // 330  (300 * 1.1)

// --- Map: any key type, ordered, .size ---
const m = new Map();
const key = { id: 1 };
m.set(key, 'object-keyed').set('s', 'string-keyed');
console.log(m.get(key), m.size);   // object-keyed 2

// --- Set: uniqueness / dedupe ---
console.log([...new Set([1, 1, 2, 3, 3])]); // [ 1, 2, 3 ]

// --- spread to merge objects (shallow) ---
const merged = { ...config, port: 8080 };
console.log(merged.port, merged.host); // 8080 localhost
