// Run:  node mongodb/transactions/index.js
// Simulates a money transfer with commit/abort semantics (no DB needed).
// The real Mongoose session code is shown in comments + the module page.

const accounts = { A: { balance: 100 }, B: { balance: 0 } };

function transfer(from, to, amount) {
  // startTransaction() — snapshot for rollback
  const snapshot = JSON.parse(JSON.stringify(accounts));
  try {
    if (accounts[from].balance < amount) throw new Error('insufficient funds');
    accounts[from].balance -= amount;   // updateOne({_id:from}, {$inc:{balance:-amount}}, {session})
    accounts[to].balance += amount;      // updateOne({_id:to},   {$inc:{balance:+amount}}, {session})
    // commitTransaction() — both writes durable together
    console.log(`COMMIT  transfer ${amount}: A=${accounts.A.balance} B=${accounts.B.balance}`);
  } catch (e) {
    // abortTransaction() — restore snapshot, neither write persists
    Object.assign(accounts, snapshot);
    console.log(`ABORT   (${e.message}): A=${accounts.A.balance} B=${accounts.B.balance}`);
  }
}

console.log('start          : A=100 B=0\n');
transfer('A', 'B', 40);    // succeeds -> A=60 B=40
transfer('A', 'B', 1000);  // fails    -> rolled back, balances unchanged
transfer('A', 'B', 60);    // succeeds -> A=0  B=100

console.log('\nKey idea: either BOTH updates apply or NEITHER does — never a partial debit.');
console.log('Single-doc writes are atomic for free; this cross-doc invariant needs a transaction.');
