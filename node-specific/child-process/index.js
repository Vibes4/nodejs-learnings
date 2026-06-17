// Run:  node node-specific/child-process/index.js
const { spawn, exec, execFile } = require('child_process');

// 1) exec — buffered output, runs in a shell (simple, short commands)
console.log('--- exec ---');
exec('node -v', (err, stdout, stderr) => {
  if (err) return console.error('exec error:', err.message);
  console.log('node version (exec):', stdout.trim());
  runSpawn();
});

// 2) spawn — streamed output (good for large/long output)
function runSpawn() {
  console.log('\n--- spawn (streamed) ---');
  // List this directory; on Windows swap to: spawn('cmd', ['/c','dir'])
  const child = spawn('ls', ['-la', __dirname]);
  child.stdout.on('data', (d) => process.stdout.write('  ' + d.toString().split('\n').slice(0, 3).join('\n  ') + '\n'));
  child.stderr.on('data', (d) => console.error('stderr:', d.toString()));
  child.on('close', (code) => {
    console.log('spawn exited with code', code);
    runFork();
  });
}

// 3) fork — a Node child with an IPC channel
function runFork() {
  console.log('\n--- fork (IPC) ---');
  // Inline child: we fork THIS file path won't loop because we guard with argv.
  const path = require('path');
  const { fork } = require('child_process');
  const childFile = path.join(__dirname, '_worker.js');
  require('fs').writeFileSync(childFile,
`process.on('message', (n) => {
  let sum = 0; for (let i = 0; i <= n; i++) sum += i;
  process.send({ n, sum });
  process.exit(0);
});`);
  const child = fork(childFile);
  child.on('message', (m) => {
    console.log(`child computed sum(0..${m.n}) =`, m.sum);
    require('fs').rmSync(childFile);
    console.log('done.');
  });
  child.send(1_000_000);   // offload CPU work to the child process
}
