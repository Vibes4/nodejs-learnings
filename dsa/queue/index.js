// Run:  node dsa/queue/index.js
// O(1) queue (head-index trick) + BFS over a small graph.

// Queue with O(1) enqueue/dequeue (no Array.shift reindexing).
class Queue {
  constructor() { this.items = []; this.head = 0; }
  enqueue(x) { this.items.push(x); }                 // O(1)
  dequeue() {                                         // O(1) amortized
    if (this.head >= this.items.length) return undefined;
    const x = this.items[this.head++];
    if (this.head > 50 && this.head * 2 > this.items.length) {
      this.items = this.items.slice(this.head);       // occasional compaction
      this.head = 0;
    }
    return x;
  }
  get size() { return this.items.length - this.head; }
}

// BFS: visit nodes in level order from a start node. O(V + E).
function bfs(graph, start) {
  const visited = new Set([start]);
  const order = [];
  const q = new Queue();
  q.enqueue(start);
  while (q.size > 0) {
    const node = q.dequeue();
    order.push(node);
    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        q.enqueue(neighbor);
      }
    }
  }
  return order;
}

const graph = {
  A: ['B', 'C'],
  B: ['A', 'D', 'E'],
  C: ['A', 'F'],
  D: ['B'],
  E: ['B', 'F'],
  F: ['C', 'E'],
};

console.log('BFS from A:', bfs(graph, 'A').join(' -> '));
// A -> B -> C -> D -> E -> F
