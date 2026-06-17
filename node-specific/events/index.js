// Run:  node node-specific/events/index.js
const EventEmitter = require('events');

// 1) Build a custom emitter by extending EventEmitter
class OrderService extends EventEmitter {
  placeOrder(id) {
    console.log(`Placing order ${id}...`);
    this.emit('order:placed', { id, at: 'now' });   // synchronous broadcast
  }
}

const orders = new OrderService();

orders.on('order:placed', (o) => console.log('  [email]   confirmation for', o.id));
orders.on('order:placed', (o) => console.log('  [billing] charge card for', o.id));
orders.once('order:placed', () => console.log('  [once]    runs only the first time'));

orders.placeOrder('A-1');
orders.placeOrder('A-2');   // note: [once] does NOT fire again

// 2) emit is synchronous — proof
console.log('\n--- emit is synchronous ---');
const ee = new EventEmitter();
ee.on('ping', () => console.log('  listener ran'));
console.log('before emit');
ee.emit('ping');
console.log('after emit  (listener already ran above)');

// 3) The special 'error' event
console.log('\n--- error handling ---');
const safe = new EventEmitter();
safe.on('error', (err) => console.log('  caught:', err.message));
safe.emit('error', new Error('something failed'));   // handled -> no crash

// 4) Listener count + cleanup
console.log('\nlisteners for order:placed =', orders.listenerCount('order:placed'));
orders.removeAllListeners('order:placed');
console.log('after cleanup                =', orders.listenerCount('order:placed'));
