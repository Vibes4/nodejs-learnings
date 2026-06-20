// Run:  node javascript/async/index.js

const delay = (ms, value) => new Promise(res => setTimeout(() => res(value), ms));
const fail  = (ms, msg)   => new Promise((_, rej) => setTimeout(() => rej(new Error(msg)), ms));

// --- microtask vs macrotask ordering ---
console.log('1: sync');
setTimeout(() => console.log('4: setTimeout (macrotask)'), 0);
Promise.resolve().then(() => console.log('3: promise (microtask)'));
console.log('2: sync end');
// Order: 1, 2, 3, 4 -> microtasks drain before the timer

async function main() {
  // --- try/catch with await ---
  try {
    await fail(10, 'boom');
  } catch (e) {
    console.log('caught:', e.message);          // caught: boom
  }

  // --- Promise.all: concurrent, fast-fail ---
  const all = await Promise.all([delay(20, 'a'), delay(10, 'b')]);
  console.log('all:', all);                      // all: [ 'a', 'b' ]

  // --- allSettled: never rejects, shows partial failures ---
  const settled = await Promise.allSettled([delay(5, 'ok'), fail(5, 'nope')]);
  console.log('settled:', settled.map(r => r.status)); // [ 'fulfilled', 'rejected' ]

  // --- race: first to settle wins ---
  console.log('race:', await Promise.race([delay(30, 'slow'), delay(5, 'fast')])); // fast

  // --- await-in-loop (sequential) vs Promise.all (concurrent) ---
  // NOTE: start the timer fresh each time and create the promises INSIDE the loop,
  // otherwise they'd all be running before the first await.
  let t = Date.now();
  for (let i = 0; i < 3; i++) await delay(30, i); // ~90ms: each waits for the last
  console.log('sequential ~', Math.round((Date.now() - t) / 30) * 30, 'ms');

  t = Date.now();
  await Promise.all([delay(30, 1), delay(30, 2), delay(30, 3)]); // ~30ms: all at once
  console.log('concurrent ~', Math.round((Date.now() - t) / 30) * 30, 'ms');
}
main();
