// Run:  node dsa/heap/index.js
// A small MinHeap class + Top-K largest demo.

class MinHeap {
  constructor() { this.a = []; }
  size() { return this.a.length; }
  peek() { return this.a[0]; }

  push(val) {                              // O(log n)
    this.a.push(val);
    let i = this.a.length - 1;
    while (i > 0) {                        // bubble up
      const parent = (i - 1) >> 1;
      if (this.a[parent] <= this.a[i]) break;
      [this.a[parent], this.a[i]] = [this.a[i], this.a[parent]];
      i = parent;
    }
  }

  pop() {                                  // O(log n)
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length) {
      this.a[0] = last;
      let i = 0, n = this.a.length;        // sink down
      while (true) {
        let smallest = i, l = 2 * i + 1, r = 2 * i + 2;
        if (l < n && this.a[l] < this.a[smallest]) smallest = l;
        if (r < n && this.a[r] < this.a[smallest]) smallest = r;
        if (smallest === i) break;
        [this.a[i], this.a[smallest]] = [this.a[smallest], this.a[i]];
        i = smallest;
      }
    }
    return top;
  }
}

// K largest elements: min-heap of size k. O(n log k).
function kLargest(nums, k) {
  const heap = new MinHeap();
  for (const n of nums) {
    heap.push(n);
    if (heap.size() > k) heap.pop();       // evict smallest
  }
  const out = [];
  while (heap.size()) out.push(heap.pop());
  return out;                              // ascending order
}

console.log('MinHeap pop order:');
const h = new MinHeap();
[5, 1, 8, 3, 2].forEach((x) => h.push(x));
const sorted = [];
while (h.size()) sorted.push(h.pop());
console.log(' ', sorted.join(' '));        // 1 2 3 5 8

console.log('\n3 largest of [3,2,1,5,6,4]:', kLargest([3, 2, 1, 5, 6, 4], 3)); // [4,5,6]
