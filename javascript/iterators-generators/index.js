// Run:  node javascript/iterators-generators/index.js

// --- making an object iterable via Symbol.iterator ---
const range = {
  from: 1,
  to: 4,
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    return {
      next: () => current <= last
        ? { value: current++, done: false }
        : { value: undefined, done: true },
    };
  },
};
console.log([...range]);            // [ 1, 2, 3, 4 ]  (spread uses the iterator)
for (const n of range) process.stdout.write(n + ' '); // 1 2 3 4
console.log();

// --- generator: same range in 3 lines ---
function* genRange(from, to) {
  for (let i = from; i <= to; i++) yield i;
}
console.log([...genRange(1, 4)]);  // [ 1, 2, 3, 4 ]

// --- step through manually with next() ---
const g = genRange(10, 12);
console.log(g.next());             // { value: 10, done: false }
console.log(g.next());             // { value: 11, done: false }
console.log(g.next().value, g.next().done); // 12 true

// --- yield* delegates to another iterable ---
function* combined() {
  yield* [1, 2];
  yield* genRange(3, 4);
}
console.log([...combined()]);      // [ 1, 2, 3, 4 ]

// --- infinite, lazy sequence: only computes what you take ---
function* naturals() {
  let n = 1;
  while (true) yield n++;          // never hangs: advances one per next()
}
function take(iter, count) {
  const out = [];
  for (const v of iter) {
    out.push(v);
    if (out.length === count) break;
  }
  return out;
}
console.log(take(naturals(), 5));  // [ 1, 2, 3, 4, 5 ]
