// Run:  node mongodb/data-modeling/index.js
// Zero-dependency illustration of embed vs reference trade-offs (no DB needed).

// ---- EMBEDDED model: everything in one document ----
const embeddedUser = {
  _id: 'u1',
  name: 'Ada',
  addresses: [{ city: 'London', zip: 'EC1' }],
  cart: [{ sku: 'BOOK-1', qty: 2 }, { sku: 'PEN-9', qty: 5 }],
};
console.log('--- EMBEDDED ---');
console.log('Single read returns everything:', JSON.stringify(embeddedUser));
console.log('Atomic cart update — one document write, no transaction needed.\n');

// ---- REFERENCED model: separate collections joined by id ----
const users = [{ _id: 'u1', name: 'Ada' }];
const orders = [
  { _id: 'o1', userId: 'u1', total: 99 },
  { _id: 'o2', userId: 'u1', total: 12 },
];
console.log('--- REFERENCED ---');
// Manual "$lookup": join orders -> user
const joined = orders.map((o) => ({
  ...o,
  user: users.find((u) => u._id === o.userId).name,
}));
console.log('Join (like $lookup/populate):', JSON.stringify(joined));

// ---- N+1 vs batched ($in) ----
console.log('\n--- avoiding N+1 ---');
const userIds = [...new Set(orders.map((o) => o.userId))];
console.log('Bad : query user once PER order  ->', orders.length, 'queries');
console.log('Good: one query  WHERE _id $in', JSON.stringify(userIds), '-> 1 query');

// ---- Extended reference pattern: cache a subset inline ----
const orderWithExtRef = { _id: 'o3', total: 50, user: { _id: 'u1', name: 'Ada' } };
console.log('\n--- extended reference (subset cached) ---');
console.log('Order carries user.name inline -> list view needs no join:', JSON.stringify(orderWithExtRef));

console.log('\nRule: embed what you read together & owns the parent; reference what is large/shared/unbounded.');
