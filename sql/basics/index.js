// Run:  node express-specific/sql/index.js
// If `pg` is installed AND DATABASE_URL points at Postgres, runs a real demo.
// Otherwise falls back to a zero-dependency in-memory simulation of the key ideas.

async function realPostgres() {
  const { Pool } = require('pg');
  // Connection POOL (not one connection per query)
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 10 });

  await pool.query('CREATE TEMP TABLE users(id serial PRIMARY KEY, email text UNIQUE, name text)');

  // Parameterized query — $1 binding prevents SQL injection
  await pool.query('INSERT INTO users(email, name) VALUES ($1, $2)', ['ada@x.com', 'Ada']);

  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', ['ada@x.com']);
  console.log('row:', rows[0]);

  // Transaction: one client from the pool, BEGIN/COMMIT/ROLLBACK
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('INSERT INTO users(email,name) VALUES ($1,$2)', ['b@x.com', 'B']);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
  } finally {
    client.release();   // ALWAYS return the connection to the pool
  }

  console.log('count:', (await pool.query('SELECT count(*) FROM users')).rows[0].count);
  await pool.end();
}

function simulation() {
  console.log('[simulation mode — install `pg` + set DATABASE_URL for the real thing]\n');

  // 1) Why parameterized queries matter (injection demo)
  const evil = "x'; DROP TABLE users; --";
  console.log('Unsafe interpolation builds:');
  console.log(`  SELECT * FROM users WHERE name = '${evil}'   <-- injection!`);
  console.log('Parameterized keeps value as DATA, never SQL:');
  console.log("  SELECT * FROM users WHERE name = $1   params: [", JSON.stringify(evil), ']\n');

  // 2) A tiny "pool" + "transaction" with rollback semantics
  const table = [];
  function tx(work) {
    const snapshot = JSON.parse(JSON.stringify(table));   // BEGIN
    try { work(); console.log('  COMMIT'); }
    catch (e) { table.length = 0; table.push(...snapshot); console.log('  ROLLBACK:', e.message); }
  }

  console.log('Transaction that succeeds:');
  tx(() => { table.push({ id: 1, name: 'Ada' }); });
  console.log('Transaction that fails (rolls back):');
  tx(() => { table.push({ id: 2, name: 'Bad' }); throw new Error('constraint violation'); });
  console.log('final rows:', table, '(row 2 was rolled back)\n');

  // 3) N+1 vs single IN query
  console.log('N+1 (bad): SELECT * FROM orders WHERE user_id = ?  (run once PER user)');
  console.log('Batched (good): SELECT * FROM orders WHERE user_id IN ($1,$2,$3)');
}

(async () => {
  try {
    require.resolve('pg');
    if (!process.env.DATABASE_URL) throw new Error('no DATABASE_URL');
    await realPostgres();
  } catch {
    simulation();
  }
})();
