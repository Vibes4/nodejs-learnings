// Run:  node node-specific/fs/index.js
const fs = require('fs');
const fsp = require('fs/promises');   // promise-based API
const path = require('path');

const tmpDir = path.join(__dirname, '.tmp');
const file = path.join(tmpDir, 'demo.txt');

async function main() {
  // 1) Create a directory (recursive = no error if exists)
  await fsp.mkdir(tmpDir, { recursive: true });

  // 2) Write + append (promise API)
  await fsp.writeFile(file, 'line 1\n', 'utf8');
  await fsp.appendFile(file, 'line 2\n', 'utf8');

  // 3) Read it back
  const content = await fsp.readFile(file, 'utf8');
  console.log('--- file content ---\n' + content);

  // 4) Stat / metadata
  const stat = await fsp.stat(file);
  console.log('size:', stat.size, 'bytes | isFile:', stat.isFile());

  // 5) List directory
  console.log('dir contents:', await fsp.readdir(tmpDir));

  // 6) Synchronous read (blocks) — fine for a quick script
  console.log('sync read:', fs.readFileSync(file, 'utf8').trim());

  // 7) Stream a file in chunks (memory-friendly for big files)
  console.log('\n--- streaming the same file ---');
  await new Promise((resolve) => {
    const rs = fs.createReadStream(file, { encoding: 'utf8', highWaterMark: 8 });
    rs.on('data', (chunk) => console.log('chunk:', JSON.stringify(chunk)));
    rs.on('end', resolve);
  });

  // 8) Cleanup
  await fsp.rm(tmpDir, { recursive: true, force: true });
  console.log('\ncleaned up .tmp');
}

main().catch((err) => {
  console.error('fs demo failed:', err.message);
  process.exit(1);
});
