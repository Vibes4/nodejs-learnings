// Run:  node dsa-patterns/top-k/k-closest-points/index.js

// Binary max-heap keyed by `dist` (largest dist at the root). Each node stores
// { point, dist } so we can pop the farthest of the candidates we are keeping.
class MaxHeap {
  constructor() {
    this.data = [];
  }
  size() {
    return this.data.length;
  }
  peek() {
    return this.data[0];
  }
  push(item) {
    this.data.push(item);
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
      if (this.data[parent].dist >= this.data[i].dist) break;
      [this.data[parent], this.data[i]] = [this.data[i], this.data[parent]];
      i = parent;
    }
  }
  _bubbleDown(i) {
    const n = this.data.length;
    while (true) {
      let largest = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && this.data[l].dist > this.data[largest].dist) largest = l;
      if (r < n && this.data[r].dist > this.data[largest].dist) largest = r;
      if (largest === i) break;
      [this.data[largest], this.data[i]] = [this.data[i], this.data[largest]];
      i = largest;
    }
  }
}

// Keep a max-heap of the k closest points. If a new point is closer than the
// current farthest (the root), swap it in. Compare squared distances to avoid
// a needless sqrt.
function kClosest(points, k) {
  const heap = new MaxHeap();
  for (const [x, y] of points) {
    const dist = x * x + y * y;
    if (heap.size() < k) {
      heap.push({ point: [x, y], dist });
    } else if (dist < heap.peek().dist) {
      heap.pop();
      heap.push({ point: [x, y], dist });
    }
  }
  return heap.data.map((item) => item.point);
}

// Demo (order within the result is not significant)
console.log(JSON.stringify(kClosest([[1, 3], [-2, 2]], 1)));
// [[-2,2]]
console.log(JSON.stringify(kClosest([[3, 3], [5, -1], [-2, 4]], 2)));
// [[-2,4],[3,3]]
