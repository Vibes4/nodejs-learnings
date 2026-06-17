// Run:  node mongodb/indexing/index.js
// Demonstrates WHY an index matters by comparing a scan vs an index lookup in plain JS.

// Build 100k fake documents
const N = 100_000;
const docs = Array.from({ length: N }, (_, i) => ({
  _id: i,
  email: `user${i}@x.com`,
  status: i % 3 === 0 ? 'active' : 'inactive',
}));

const target = `user${N - 1}@x.com`;

// ---- COLLSCAN: linear search through every document ----
let scanWork = 0;
console.time('COLLSCAN (no index)');
const scanned = docs.find((d) => { scanWork++; return d.email === target; });
console.timeEnd('COLLSCAN (no index)');
console.log(`  examined ${scanWork} docs to return 1\n`);

// ---- IXSCAN: a Map is our B-tree-like index on email ----
console.time('build index { email: 1 }');
const emailIndex = new Map(docs.map((d) => [d.email, d]));
console.timeEnd('build index { email: 1 }');

let idxWork = 0;
console.time('IXSCAN (indexed)');
idxWork++;
const looked = emailIndex.get(target);
console.timeEnd('IXSCAN (indexed)');
console.log(`  examined ${idxWork} doc to return 1`);

console.log('\nfound same doc?', scanned._id === looked._id);
console.log('\nTakeaway: COLLSCAN examined', scanWork, 'docs; index examined', idxWork + '.');
console.log("In Mongo you'd run:  db.users.find({email}).explain('executionStats')");
console.log('and look for stage: IXSCAN with totalDocsExamined ≈ nReturned.');

// Compound-index prefix demo
console.log('\n--- compound index { status:1, _id:-1 } prefixes ---');
console.log('serves {status}            -> yes (prefix)');
console.log('serves {status,_id}        -> yes (prefix)');
console.log('serves {_id} alone         -> no  (not a prefix)');
