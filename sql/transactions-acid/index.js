// Run:  node sql/transactions-acid/index.js
// Simulates atomicity (rollback) + optimistic locking conflict. No DB needed.
// Real Postgres pattern shown in comments.

const table = { rows: [{ id: 1, name: 'Ada', version: 1 }] };

// ---- Atomicity: BEGIN / COMMIT / ROLLBACK ----
function runTx(label, work) {
  const snapshot = JSON.parse(JSON.stringify(table));   // BEGIN
  try {
    work();
    console.log(`COMMIT   [${label}] ->`, JSON.stringify(table.rows));
  } catch (e) {
    table.rows = snapshot.rows;                          // ROLLBACK
    console.log(`ROLLBACK [${label}] (${e.message}) ->`, JSON.stringify(table.rows));
  }
}

console.log('=== Atomicity ===');
runTx('insert two, second fails', () => {
  table.rows.push({ id: 2, name: 'Linus', version: 1 });
  throw new Error('constraint violation on row 2');   // both inserts undone
});
runTx('valid insert', () => {
  table.rows.push({ id: 2, name: 'Linus', version: 1 });
});

// ---- Optimistic locking: version check prevents lost updates ----
console.log('\n=== Optimistic locking (two users edit row 1) ===');
//   UPDATE t SET name=$1, version=version+1 WHERE id=$2 AND version=$3
function update(id, newName, expectedVersion) {
  const row = table.rows.find((r) => r.id === id);
  if (row.version !== expectedVersion)
    throw new Error(`version conflict (expected ${expectedVersion}, found ${row.version})`);
  row.name = newName;
  row.version += 1;
  return row.version;
}

const userARead = 1;   // both users read version 1
const userBRead = 1;
console.log('User A updates with version', userARead, '->', 'v' + update(1, 'Ada-A', userARead));
try {
  console.log('User B updates with stale version', userBRead);
  update(1, 'Ada-B', userBRead);
} catch (e) {
  console.log('  rejected:', e.message, '-> User B must re-read and retry');
}

console.log('\nFinal row:', JSON.stringify(table.rows.find((r) => r.id === 1)));
console.log('\nPessimistic alternative:  SELECT ... FOR UPDATE  (locks the row up front).');
