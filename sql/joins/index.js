// Run:  node sql/joins/index.js
// In-memory implementation of each JOIN type so you can SEE the result sets. No DB needed.

const users = [
  { id: 1, name: 'Ada' },
  { id: 2, name: 'Linus' },
  { id: 3, name: 'Grace' },   // has no orders
];
const orders = [
  { id: 10, user_id: 1, total: 100 },
  { id: 11, user_id: 1, total: 50 },
  { id: 12, user_id: 2, total: 200 },
  { id: 13, user_id: 99, total: 7 }, // orphan: no matching user
];

const fmt = (rows) => rows.map((r) => JSON.stringify(r)).join('\n  ');

// INNER JOIN: only matches in both
const inner = users.flatMap((u) =>
  orders.filter((o) => o.user_id === u.id).map((o) => ({ name: u.name, total: o.total })));
console.log('=== INNER JOIN (matches only) ===\n  ' + fmt(inner));

// LEFT JOIN: all users, NULL when no order
const left = users.flatMap((u) => {
  const matches = orders.filter((o) => o.user_id === u.id);
  return matches.length ? matches.map((o) => ({ name: u.name, total: o.total }))
                        : [{ name: u.name, total: null }];   // Grace -> null
});
console.log('\n=== LEFT JOIN (all users, NULL totals) ===\n  ' + fmt(left));

// RIGHT JOIN: all orders, NULL when no user (the orphan order 13)
const right = orders.map((o) => {
  const u = users.find((x) => x.id === o.user_id);
  return { name: u ? u.name : null, total: o.total };
});
console.log('\n=== RIGHT JOIN (all orders, NULL names) ===\n  ' + fmt(right));

// FULL OUTER JOIN: union of left + right unmatched
const matchedUserIds = new Set(orders.map((o) => o.user_id));
const full = [...left, ...right.filter((r) => r.name === null)];
console.log('\n=== FULL OUTER JOIN ===\n  ' + fmt(full));

// The classic gotcha
console.log('\n=== GOTCHA: LEFT JOIN + WHERE total > 60 ===');
console.log('  Filtering total>60 in WHERE drops Grace(null) -> acts like INNER JOIN.');
console.log('  Fix: put the condition in ON, not WHERE.');
