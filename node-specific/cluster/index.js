// Run:  node node-specific/cluster/index.js   then hit http://localhost:5000 repeatedly
// Watch different worker PIDs handle the requests.
const cluster = require('cluster');
const http = require('http');
const os = require('os');

const numWorkers = Math.min(os.cpus().length, 4);   // cap at 4 for the demo

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} starting ${numWorkers} workers...`);

  for (let i = 0; i < numWorkers; i++) cluster.fork();

  // Resilience: re-fork a worker if it dies
  cluster.on('exit', (worker, code) => {
    console.log(`Worker ${worker.process.pid} died (code ${code}). Forking a replacement.`);
    cluster.fork();
  });

  // Auto-stop the demo after 3s so it doesn't hang your terminal
  setTimeout(() => {
    console.log('Demo over — shutting down workers.');
    for (const id in cluster.workers) cluster.workers[id].kill();
    process.exit(0);
  }, 3000);
} else {
  // Each worker runs its own server, all sharing port 5000
  http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ handledBy: process.pid }));
  }).listen(5000);

  console.log(`Worker ${process.pid} listening on :5000`);
}
