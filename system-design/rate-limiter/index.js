// Run:  node system-design/rate-limiter/index.js
// A working token-bucket rate limiter. Tokens refill continuously over time;
// each request spends one. Allows bursts up to `capacity`, bounded average rate.

class TokenBucket {
  constructor(capacity, refillPerSec) {
    this.capacity = capacity;        // max burst
    this.refillPerSec = refillPerSec; // sustained rate (tokens/sec)
    this.tokens = capacity;          // start full
    this.lastRefill = Date.now();
  }

  _refill() {
    const now = Date.now();
    const elapsedSec = (now - this.lastRefill) / 1000;
    // Add tokens proportional to elapsed time, capped at capacity.
    this.tokens = Math.min(this.capacity, this.tokens + elapsedSec * this.refillPerSec);
    this.lastRefill = now;
  }

  // Returns true if the request is allowed (a token was available).
  allow() {
    this._refill();
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }
}

// Bucket: capacity 5 (burst), refills 2 tokens/sec (sustained).
const limiter = new TokenBucket(5, 2);

function fire(n) {
  for (let i = 1; i <= n; i++) {
    const ok = limiter.allow();
    console.log(`req ${i}: ${ok ? 'ALLOW 200' : 'DENY  429'}  (tokens left: ${limiter.tokens.toFixed(2)})`);
  }
}

console.log('--- Burst of 8 requests against capacity 5 ---');
fire(8); // first 5 pass (burst), rest denied

console.log('\n--- Wait 1.5s -> ~3 tokens refill (2/sec) ---');
setTimeout(() => {
  fire(4); // ~3 allowed, then denied again
  console.log('\nToken bucket allows controlled bursts while capping the average rate.');
}, 1500);
