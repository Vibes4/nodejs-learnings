// Run:  node sql/normalization/index.js
// Shows an update anomaly in a denormalized table vs the normalized fix. No DB needed.

// ---- DENORMALIZED: customer name duplicated on every order ----
let denorm = [
  { orderId: 1, customer: 'Ada Lovelace', customerCity: 'London', total: 100 },
  { orderId: 2, customer: 'Ada Lovelace', customerCity: 'London', total: 50 },
  { orderId: 3, customer: 'Ada Lovelace', customerCity: 'London', total: 75 },
];

console.log('=== DENORMALIZED (name repeated) ===');
console.log(denorm.map((r) => `#${r.orderId} ${r.customer} (${r.customerCity})`).join('\n'));

// Update anomaly: Ada moves to Paris — must update EVERY row, miss one => inconsistent
denorm[0].customerCity = 'Paris';
denorm[1].customerCity = 'Paris';
// (forgot row 3!)
console.log('\nAfter "move to Paris" but missing one row:');
console.log(denorm.map((r) => `#${r.orderId} -> ${r.customerCity}`).join('\n'));
console.log('🚨 inconsistent: row 3 still says London (update anomaly)');

// ---- NORMALIZED: 3NF — customer stored once, orders reference it ----
console.log('\n=== NORMALIZED (3NF) ===');
const customers = [{ id: 1, name: 'Ada Lovelace', city: 'London' }];   // single source of truth
const orders = [
  { orderId: 1, customerId: 1, total: 100 },
  { orderId: 2, customerId: 1, total: 50 },
  { orderId: 3, customerId: 1, total: 75 },
];

// Move to Paris: ONE update, everywhere consistent
customers[0].city = 'Paris';

const view = orders.map((o) => {
  const c = customers.find((x) => x.id === o.customerId);
  return `#${o.orderId} ${c.name} (${c.city})`;
});
console.log('One update to customers -> all orders see it:');
console.log(view.join('\n'));
console.log('\n✅ no anomaly: the fact "Ada lives in Paris" is stored in exactly one place.');
