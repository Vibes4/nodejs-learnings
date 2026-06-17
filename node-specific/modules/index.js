// Run:  node node-specific/modules/index.js
// Demonstrates CommonJS export/require + the module cache.

// ---- An inline "module" defined as a function we cache-test below ----
const path = require('path');

// 1) module.exports vs exports
function demoExports() {
  // exports.foo = ...   -> works (mutates the shared object)
  // module.exports = {}  -> works (replaces the export)
  // exports = {}         -> BREAKS the link, exports nothing
  console.log('exports === module.exports initially?  true (they point to the same object)');
}

// 2) Module caching: require the SAME core module twice -> same instance
const os1 = require('os');
const os2 = require('os');
console.log('Same cached instance (os1 === os2)?', os1 === os2);

// 3) Inspect the resolved path + cache
console.log('Resolved path of "path":', require.resolve('path'));
console.log('Modules currently in cache (count):', Object.keys(require.cache).length);

// 4) Singleton pattern via module cache
//    If this were in its own file, every requirer would share `counter`.
const counter = (() => {
  let n = 0;
  return { inc: () => ++n, get: () => n };
})();
counter.inc(); counter.inc();
console.log('Singleton counter value:', counter.get());

demoExports();

console.log('\nESM equivalent (for reference, runs only in .mjs / type:module):');
console.log("  import os from 'os';");
console.log("  export const add = (a,b) => a+b;");
console.log("  // __dirname ->  path.dirname(fileURLToPath(import.meta.url))");
