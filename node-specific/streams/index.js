// Run:  node node-specific/streams/index.js
const { Readable, Transform, pipeline } = require('stream');
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

// 1) A custom Readable that emits numbers 1..5
class CounterStream extends Readable {
  constructor(max) { super({ objectMode: true }); this.n = 0; this.max = max; }
  _read() {
    this.n += 1;
    if (this.n > this.max) this.push(null);   // null = end of stream
    else this.push({ value: this.n });
  }
}

// 2) A Transform that doubles each value
const doubler = new Transform({
  objectMode: true,
  transform(chunk, _enc, cb) {
    cb(null, { value: chunk.value * 2 });
  },
});

console.log('--- object stream: counter -> doubler ---');
pipeline(new CounterStream(5), doubler, async function (source) {
  for await (const item of source) console.log('  got', item);
}, (err) => {
  if (err) return console.error('pipeline failed', err);
  demoGzip();
});

// 3) Real-world: read a file -> gzip -> write, with backpressure handled for free
function demoGzip() {
  const src = path.join(__dirname, 'index.js');
  const out = path.join(__dirname, 'index.js.gz');
  console.log('\n--- file -> gzip -> file (pipeline) ---');
  pipeline(
    fs.createReadStream(src),
    zlib.createGzip(),
    fs.createWriteStream(out),
    (err) => {
      if (err) return console.error('gzip failed', err.message);
      const orig = fs.statSync(src).size;
      const zipped = fs.statSync(out).size;
      console.log(`  ${orig} bytes -> ${zipped} bytes gzipped`);
      fs.rmSync(out);   // cleanup
      console.log('  cleaned up .gz');
    }
  );
}
