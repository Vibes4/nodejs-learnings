// Run:  node mongodb/aggregation/index.js
// Simulates an aggregation pipeline in plain JS so you can see each stage's effect.
// (Equivalent MongoDB pipeline is shown in comments.)

const orders = [
  { _id: 1, customer: 'Ada',   status: 'paid',    amount: 100, items: ['book', 'pen'] },
  { _id: 2, customer: 'Ada',   status: 'paid',    amount: 50,  items: ['mug'] },
  { _id: 3, customer: 'Linus', status: 'paid',    amount: 200, items: ['book'] },
  { _id: 4, customer: 'Linus', status: 'pending', amount: 30,  items: ['pen'] },
];

console.log('=== Pipeline: revenue per customer for PAID orders ===\n');

// db.orders.aggregate([
//   { $match: { status: 'paid' } },
let stage = orders.filter((o) => o.status === 'paid');
console.log('after $match {status:paid}:', stage.map((o) => o._id));

//   { $group: { _id:'$customer', revenue:{$sum:'$amount'}, count:{$sum:1} } },
const grouped = Object.values(
  stage.reduce((acc, o) => {
    (acc[o.customer] ??= { _id: o.customer, revenue: 0, count: 0 });
    acc[o.customer].revenue += o.amount;
    acc[o.customer].count += 1;
    return acc;
  }, {})
);
console.log('after $group by customer:', JSON.stringify(grouped));

//   { $sort: { revenue: -1 } },
grouped.sort((a, b) => b.revenue - a.revenue);
console.log('after $sort revenue desc:', grouped.map((g) => `${g._id}:${g.revenue}`));

//   { $project: { _id:0, customer:'$_id', revenue:1 } }
const projected = grouped.map((g) => ({ customer: g._id, revenue: g.revenue }));
console.log('after $project       :', JSON.stringify(projected));

// $unwind example: one row per item
console.log('\n=== $unwind items ===');
const unwound = orders.flatMap((o) => o.items.map((item) => ({ _id: o._id, item })));
console.log(JSON.stringify(unwound));

// $lookup example: join to customers collection
console.log('\n=== $lookup orders -> customers ===');
const customers = [{ name: 'Ada', tier: 'gold' }, { name: 'Linus', tier: 'silver' }];
const joined = orders.map((o) => ({ ...o, tier: customers.find((c) => c.name === o.customer).tier }));
console.log(joined.map((o) => `${o._id}:${o.customer}(${o.tier})`).join('  '));
