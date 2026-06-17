// Run:  node node-specific/globals/index.js  arg1 arg2

console.log('--- process basics ---');
console.log('Node version :', process.version);
console.log('Platform     :', process.platform, process.arch);
console.log('PID          :', process.pid);
console.log('cwd()        :', process.cwd());      // where you launched node
console.log('__dirname    :', __dirname);          // where THIS file lives
console.log('__filename   :', __filename);

console.log('\n--- CLI args (process.argv) ---');
// [0] = node binary, [1] = script path, [2..] = your args
process.argv.forEach((arg, i) => console.log(`  argv[${i}] = ${arg}`));

console.log('\n--- env vars ---');
console.log('HOME / USERPROFILE:', process.env.HOME || process.env.USERPROFILE);
console.log('Custom (set GREETING=hi before running):', process.env.GREETING || '(unset)');

console.log('\n--- global vs globalThis ---');
global.sharedCounter = 1;
console.log('globalThis === global ?', globalThis === global);
console.log('shared:', globalThis.sharedCounter);

console.log('\n--- graceful shutdown demo ---');
process.on('exit', (code) => console.log(`(process exiting with code ${code})`));
process.on('SIGINT', () => {
  console.log('\nCaught Ctrl+C — cleaning up then exiting...');
  process.exit(0);
});

console.log('Press Ctrl+C to see SIGINT handling, or wait 1.5s to auto-exit.');
setTimeout(() => process.exit(0), 1500);
