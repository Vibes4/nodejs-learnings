// Run:  node node-specific/worker-threads/index.js
// Demonstrates offloading a CPU-bound task so the main thread stays responsive.
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

// Heavy CPU work: naive prime count up to n
function countPrimes(n) {
  let count = 0;
  for (let i = 2; i <= n; i++) {
    let isPrime = true;
    for (let j = 2; j * j <= i; j++) if (i % j === 0) { isPrime = false; break; }
    if (isPrime) count++;
  }
  return count;
}

if (isMainThread) {
  console.log('Main thread: starting worker for CPU-bound prime count...');

  // Prove the main thread stays responsive while the worker computes
  const ticker = setInterval(() => console.log('  main thread tick (event loop is free)'), 100);

  const worker = new Worker(__filename, { workerData: { limit: 2_000_000 } });

  worker.on('message', (result) => {
    clearInterval(ticker);
    console.log(`Worker done: ${result.count} primes below ${result.limit}`);
    console.log('Notice the main thread kept ticking — it was never blocked.');
  });

  worker.on('error', (e) => console.error('worker error:', e));
  worker.on('exit', (code) => code !== 0 && console.error('worker exited', code));
} else {
  // This branch runs INSIDE the worker thread
  const count = countPrimes(workerData.limit);
  parentPort.postMessage({ count, limit: workerData.limit });
}
