// Run:  node system-design/file-upload/index.js
// Simulate a chunked upload: receive chunks, track which arrived, reassemble
// when complete, then content-hash dedupe so identical files store once.

const crypto = require('crypto');

const objectStore = new Map(); // contentHash -> bytes (the actual stored objects)
const metadata = [];           // one row per logical file (points at a hash)

// An upload session collects chunks until all are present.
class UploadSession {
  constructor(fileId, totalChunks) {
    this.fileId = fileId;
    this.totalChunks = totalChunks;
    this.chunks = new Map(); // index -> data
  }
  receive(index, data) {
    if (this.chunks.has(index)) {              // resumable: ignore duplicate chunk
      console.log(`  chunk ${index} already received (skip)`);
      return;
    }
    this.chunks.set(index, data);
    console.log(`  received chunk ${index} (${this.chunks.size}/${this.totalChunks})`);
  }
  isComplete() { return this.chunks.size === this.totalChunks; }
  assemble() {
    let out = '';
    for (let i = 0; i < this.totalChunks; i++) out += this.chunks.get(i); // ordered reassembly
    return out;
  }
}

function finalize(session, owner, name) {
  const bytes = session.assemble();
  const hash = crypto.createHash('sha256').update(bytes).digest('hex').slice(0, 12);
  if (objectStore.has(hash)) {
    console.log(`  DEDUPE: hash ${hash} already stored — pointing metadata at existing object`);
  } else {
    objectStore.set(hash, bytes);
    console.log(`  STORED new object ${hash} (${bytes.length} bytes)`);
  }
  metadata.push({ fileId: session.fileId, owner, name, hash, status: 'available' });
}

// --- Upload file A in 3 chunks (one chunk arrives twice -> resume) ---
console.log('Upload A (3 chunks):');
const a = new UploadSession('fileA', 3);
a.receive(0, 'hello-'); a.receive(1, 'world-'); a.receive(1, 'world-'); a.receive(2, 'data!');
if (a.isComplete()) finalize(a, 'alice', 'a.txt');

// --- Upload file B with identical content -> should dedupe ---
console.log('\nUpload B (same content as A):');
const b = new UploadSession('fileB', 1);
b.receive(0, 'hello-world-data!');
if (b.isComplete()) finalize(b, 'bob', 'b.txt');

console.log(`\nObjects in storage: ${objectStore.size}  (2 files, 1 stored object)`);
console.table(metadata);
