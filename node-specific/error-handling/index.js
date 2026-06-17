// Run:  node node-specific/error-handling/index.js
const fs = require('fs');

// Custom error class — operational error carrying a code
class AppError extends Error {
  constructor(message, code) { super(message); this.name = 'AppError'; this.code = code; }
}

// 1) SYNCHRONOUS errors -> try/catch
console.log('--- 1. sync try/catch ---');
try {
  JSON.parse('{ not valid json');
} catch (err) {
  console.log('  caught sync:', err.message);
}

// Proof that try/catch does NOT catch async errors:
console.log('\n--- try/catch CANNOT catch async ---');
try {
  setTimeout(() => {
    try { throw new Error('async throw'); }        // must catch INSIDE the callback
    catch (e) { console.log('  caught inside callback:', e.message); }
  }, 10);
} catch (e) {
  console.log('  (this line never runs — the outer catch misses it)');
}

// 2) ERROR-FIRST callbacks
console.log('\n--- 2. error-first callback ---');
fs.readFile('/no/such/file.txt', (err, data) => {
  if (err) return console.log('  callback err:', err.code);  // ENOENT
  console.log(data);
});

// 3) PROMISES / async-await
console.log('\n--- 3. promises & async/await ---');
const mightFail = (ok) => new Promise((res, rej) =>
  setTimeout(() => (ok ? res('value') : rej(new AppError('service down', 503))), 20));

mightFail(false)
  .then((v) => console.log(v))
  .catch((err) => console.log('  .catch:', err.name, err.code));

(async () => {
  try {
    await mightFail(false);
  } catch (err) {
    console.log('  await try/catch:', err.message);
  }
})();

// 4) EventEmitter 'error' event
console.log('\n--- 4. EventEmitter error event ---');
const EventEmitter = require('events');
const em = new EventEmitter();
em.on('error', (err) => console.log('  emitter error handled:', err.message));
em.emit('error', new Error('boom'));   // with a listener -> safe, no crash

// 5) Process-level safety nets (log + exit; never resume normal work)
process.on('unhandledRejection', (reason) => {
  console.log('\n[unhandledRejection]', reason.message, '-> would log & exit in prod');
});
process.on('uncaughtException', (err) => {
  console.log('[uncaughtException]', err.message, '-> log, flush, process.exit(1)');
});

// Trigger an unhandled rejection on purpose (no .catch) to show the net firing
Promise.reject(new AppError('forgot to catch me', 500));
