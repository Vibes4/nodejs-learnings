// Run:  node system-design/caching/index.js
// Cache-aside pattern with a TTL, over a fake "slow" database. No dependencies.

// --- Fake slow DB: 200ms per lookup ---
const DB = { 1: 'Alice', 2: 'Bob', 3: 'Carol' };
function slowDbRead(id) {
  return new Promise((resolve) =>
    setTimeout(() => resolve(DB[id] ?? null), 200)
  );
}

// --- Tiny TTL cache ---
const cache = new Map(); // id -> { value, expiresAt }
const TTL_MS = 1000;
let hits = 0, misses = 0;

async function getUser(id) {
  const entry = cache.get(id);
  if (entry && entry.expiresAt > Date.now()) {
    hits++;
    console.log(`HIT   user:${id} -> ${entry.value}`);
    return entry.value;
  }
  // Miss: read from DB (slow), then populate cache.
  misses++;
  const value = await slowDbRead(id);
  cache.set(id, { value, expiresAt: Date.now() + TTL_MS });
  console.log(`MISS  user:${id} -> ${value}  (fetched from DB, cached ${TTL_MS}ms)`);
  return value;
}

(async () => {
  console.log('--- First reads: all miss (cold cache) ---');
  await getUser(1);
  await getUser(2);

  console.log('\n--- Repeat reads: served from cache ---');
  await getUser(1);
  await getUser(1);
  await getUser(2);

  console.log('\n--- Wait for TTL to expire (1s)... ---');
  await new Promise((r) => setTimeout(r, 1100));
  await getUser(1); // miss again — entry expired

  const total = hits + misses;
  console.log(`\nStats: ${hits} hits, ${misses} misses, hit-rate ${(hits / total * 100).toFixed(0)}%`);
})();
