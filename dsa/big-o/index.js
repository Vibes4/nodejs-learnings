// Run:  node dsa/big-o/index.js
// Illustrates how operation counts grow for different complexity classes.

function opsFor(n) {
  // O(1): always one operation
  const constant = 1;
  // O(log n): halving steps
  const logn = Math.ceil(Math.log2(n));
  // O(n): one pass
  const linear = n;
  // O(n log n): sort-like
  const nlogn = n * Math.ceil(Math.log2(n));
  // O(n^2): nested loops
  const quad = n * n;
  // O(2^n): exponential (capped so we don't print Infinity)
  const exp = n <= 20 ? 2 ** n : Infinity;
  return { constant, logn, linear, nlogn, quad, exp };
}

console.log('Growth of operation counts as n increases:\n');
console.log('n\tO(1)\tO(logn)\tO(n)\tO(nlogn)\tO(n^2)\t\tO(2^n)');
for (const n of [1, 8, 16, 32, 1024]) {
  const o = opsFor(n);
  console.log(`${n}\t${o.constant}\t${o.logn}\t${o.linear}\t${o.nlogn}\t\t${o.quad}\t\t${o.exp}`);
}

// --- Amortized push demo: a dynamic array that doubles capacity ---
console.log('\nAmortized O(1) push (doubling array):');
let capacity = 1, size = 0, copies = 0;
for (let i = 0; i < 16; i++) {
  if (size === capacity) {       // full -> grow: O(n) copy this step only
    copies += size;
    capacity *= 2;
  }
  size++;
}
console.log(`  16 pushes, total element copies during resizes: ${copies}`);
console.log(`  amortized copies per push: ${(copies / 16).toFixed(2)} -> stays constant`);
