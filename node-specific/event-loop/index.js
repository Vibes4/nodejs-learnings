// Run:  node node-specific/event-loop/index.js
// Predict the output order BEFORE running — this is the classic interview test.

console.log('1: sync start');

setTimeout(() => console.log('5: setTimeout 0 (timers phase)'), 0);

setImmediate(() => console.log('6: setImmediate (check phase)'));

Promise.resolve().then(() => console.log('4: promise microtask'));

process.nextTick(() => console.log('3: process.nextTick (highest priority)'));

console.log('2: sync end');

/* Expected order:
   1: sync start
   2: sync end
   3: process.nextTick      <- microtasks drain after sync code
   4: promise microtask
   5/6: setTimeout vs setImmediate order is non-deterministic at top level
*/

// Inside an I/O callback the order IS deterministic: immediate before timeout.
const fs = require('fs');
fs.readFile(__filename, () => {
  console.log('--- inside fs I/O callback ---');
  setTimeout(() => console.log('B: setTimeout 0'), 0);
  setImmediate(() => console.log('A: setImmediate (always first here)'));
});

// Demonstrate blocking the loop (uncomment to see timers delayed):
// const end = Date.now() + 500;
// while (Date.now() < end) {}   // <- 500ms of CPU blocks EVERYTHING
