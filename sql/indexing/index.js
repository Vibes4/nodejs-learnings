// Run:  node sql/indexing/index.js
// Shows index impact (seq scan vs index lookup) and the leftmost-prefix rule. No DB needed.

const N = 200_000;
const rows = Array.from({ length: N }, (_, i) => ({ id: i, sku: `SKU-${i}`, active: i % 5 === 0 }));
const target = `SKU-${N - 1}`;

// Seq Scan
let seqWork = 0;
console.time('Seq Scan');
rows.find((r) => { seqWork++; return r.sku === target; });
console.timeEnd('Seq Scan');
console.log(`  rows examined: ${seqWork}\n`);

// B-tree-like index on sku
const idx = new Map(rows.map((r) => [r.sku, r]));
console.time('Index Scan');
idx.get(target);
console.timeEnd('Index Scan');
console.log('  rows examined: 1');

// Functional index gotcha
console.log('\n--- why lower(sku) bypasses the index ---');
console.log("WHERE sku = 'SKU-1'        -> uses index on sku");
console.log("WHERE lower(sku) = 'sku-1' -> CANNOT use it (need a functional index on lower(sku))");

// Composite leftmost-prefix
console.log('\n--- composite index (active, sku) leftmost-prefix ---');
const composite = new Map();
for (const r of rows) {
  const key = `${r.active}`;
  (composite.get(key) || composite.set(key, []).get(key)).push(r);
}
console.log('serves WHERE active=true            -> yes (leftmost)');
console.log('serves WHERE active=true AND sku=.. -> yes');
console.log('serves WHERE sku=.. alone           -> no  (skips leftmost column)');

console.log('\nIn Postgres:  EXPLAIN ANALYZE SELECT * FROM products WHERE sku = $1;');
console.log('Look for "Index Scan" (good) vs "Seq Scan" on a large table (bad).');
