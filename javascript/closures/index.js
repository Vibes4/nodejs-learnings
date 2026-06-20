// Run:  node javascript/closures/index.js

// --- counter factory: each call gets its own private state ---
function makeCounter() {
  let count = 0;                  // private, only reachable via the returned fns
  return {
    inc: () => ++count,
    get: () => count,
  };
}
const a = makeCounter();
const b = makeCounter();
console.log(a.inc(), a.inc(), b.inc()); // 1 2 1  (independent environments)
console.log(a.get(), b.get());          // 2 1

// --- data privacy: `balance` is unreachable from outside ---
function account(start) {
  let balance = start;
  return {
    deposit: n => (balance += n),
    balance: () => balance,
  };
}
const acc = account(100);
acc.deposit(50);
console.log(acc.balance());     // 150
console.log(acc.balance === undefined ? '' : typeof acc.balance); // 'function' (no direct access to balance var)

// --- the classic var-in-loop bug ---
console.log('--- var (buggy) ---');
for (var i = 0; i < 3; i++) {
  setTimeout(() => process.stdout.write(i + ' '), 0); // 3 3 3
}

// --- fix 1: let (fresh binding per iteration) ---
setTimeout(() => {
  console.log('\n--- let (fixed) ---');
  for (let j = 0; j < 3; j++) {
    setTimeout(() => process.stdout.write(j + ' '), 0); // 0 1 2
  }
}, 10);

// --- fix 2: IIFE capturing the current value ---
setTimeout(() => {
  console.log('\n--- IIFE (fixed) ---');
  for (var k = 0; k < 3; k++) {
    (function (captured) {
      setTimeout(() => process.stdout.write(captured + ' '), 0); // 0 1 2
    })(k);
  }
  setTimeout(() => console.log(''), 10);
}, 20);
