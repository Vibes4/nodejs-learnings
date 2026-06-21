// Run:  node dsa-patterns/top-k/kth-largest/index.js

// Binary min-heap (smallest value at the root).
class MinHeap {
  constructor() {
    this.data = [];
  }
  size() {
    return this.data.length;
  }
  peek() {
    return this.data[0];
  }
  push(val) {
    this.data.push(val);
    this._bubbleUp(this.data.length - 1);
  }
  pop() {
    const top = this.data[0];
    const last = this.data.pop();
    if (this.data.length > 0) {
      this.data[0] = last;
      this._bubbleDown(0);
    }
    return top;
  }
  _bubbleUp(i) {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.data[parent] <= this.data[i]) break;
      [this.data[parent], this.data[i]] = [this.data[i], this.data[parent]];
      i = parent;
    }
  }
  _bubbleDown(i) {
    const n = this.data.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && this.data[l] < this.data[smallest]) smallest = l;
      if (r < n && this.data[r] < this.data[smallest]) smallest = r;
      if (smallest === i) break;
      [this.data[smallest], this.data[i]] = [this.data[i], this.data[smallest]];
      i = smallest;
    }
  }
}

// Keep a min-heap holding the k largest seen so far. Its root is the smallest
// of those k, which is exactly the k-th largest once all numbers are processed.
function findKthLargest(nums, k) {
  const heap = new MinHeap();
  for (const n of nums) {
    heap.push(n);
    if (heap.size() > k) heap.pop(); // drop the smallest, keep top k
  }
  return heap.peek();
}

// Demo
console.log(findKthLargest([3, 2, 1, 5, 6, 4], 2));       // 5
console.log(findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4)); // 4
