// Run:  node node-specific/path/index.js
const path = require('path');

const p = '/var/www/app/server/index.js';

console.log('--- decomposing a path ---');
console.log('dirname :', path.dirname(p));    // /var/www/app/server
console.log('basename:', path.basename(p));   // index.js
console.log('basename(no ext):', path.basename(p, '.js')); // index
console.log('extname :', path.extname(p));    // .js
console.log('parse   :', path.parse(p));

console.log('\n--- join vs resolve ---');
console.log("join('a','b','..','c') :", path.join('a', 'b', '..', 'c'));   // a/c
console.log("resolve('a','b')       :", path.resolve('a', 'b'));            // /cwd/a/b
console.log("resolve('a','/b')      :", path.resolve('a', '/b'));           // /b (reset)

console.log('\n--- safe path building (prevent traversal) ---');
const baseDir = path.resolve(__dirname, 'public');
function safeResolve(userInput) {
  const target = path.resolve(baseDir, userInput);
  if (!target.startsWith(baseDir + path.sep) && target !== baseDir) {
    return `BLOCKED (traversal): ${userInput}`;
  }
  return `OK: ${target}`;
}
console.log(safeResolve('images/logo.png'));
console.log(safeResolve('../../etc/passwd'));   // blocked

console.log('\nsep:', JSON.stringify(path.sep), '| delimiter:', JSON.stringify(path.delimiter));
