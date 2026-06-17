// Run:  node node-specific/util/index.js
const util = require('util');

// 1) promisify: turn an error-first callback into a Promise
function legacyAdd(a, b, callback) {
  setTimeout(() => {
    if (typeof a !== 'number') return callback(new Error('a must be a number'));
    callback(null, a + b);   // error-first convention
  }, 50);
}
const addAsync = util.promisify(legacyAdd);

// 2) util.inspect for deep objects
const deep = { a: { b: { c: { d: { e: 'hidden by default depth' } } } } };

// 3) util.format (printf-style)
console.log(util.format('user %s has %d points (%j)', 'vaibhav', 42, { ok: true }));

// 4) util.types
console.log('\n--- util.types ---');
console.log('isAsyncFunction:', util.types.isAsyncFunction(async () => {}));
console.log('isDate         :', util.types.isDate(new Date(0)));
console.log('isPromise      :', util.types.isPromise(Promise.resolve()));

(async () => {
  console.log('\n--- promisified call ---');
  console.log('addAsync(2,3) =', await addAsync(2, 3));
  try {
    await addAsync('x', 3);
  } catch (e) {
    console.log('caught error:', e.message);
  }

  console.log('\n--- inspect depth ---');
  console.log('default depth:', util.inspect(deep));                 // shows [Object]
  console.log('full depth   :', util.inspect(deep, { depth: null })); // shows everything
})();
