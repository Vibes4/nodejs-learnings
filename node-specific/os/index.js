// Run:  node node-specific/os/index.js
const os = require('os');

const gb = (bytes) => (bytes / 1024 ** 3).toFixed(2) + ' GB';

console.log('--- platform ---');
console.log('platform :', os.platform(), '| arch:', os.arch(), '| release:', os.release());
console.log('hostname :', os.hostname());
console.log('uptime   :', (os.uptime() / 3600).toFixed(1), 'hours');
console.log('EOL      :', JSON.stringify(os.EOL));

console.log('\n--- CPU ---');
console.log('logical cores:', os.cpus().length);
console.log('model        :', os.cpus()[0].model);
console.log('loadavg(1/5/15):', os.loadavg().map(n => n.toFixed(2)).join(' '));

console.log('\n--- memory ---');
console.log('total:', gb(os.totalmem()), '| free:', gb(os.freemem()));

console.log('\n--- this Node process memory ---');
const m = process.memoryUsage();
console.log('rss     :', (m.rss / 1024 / 1024).toFixed(1), 'MB');
console.log('heapUsed:', (m.heapUsed / 1024 / 1024).toFixed(1), 'MB');

console.log('\n--- paths ---');
console.log('homedir:', os.homedir(), '| tmpdir:', os.tmpdir());

console.log('\nRecommended cluster workers (1 per core):', os.cpus().length);
