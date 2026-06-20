// Run:  node dsa/lru-cache/index.js
// LRUCache with HashMap + doubly linked list. get/put both O(1).

class DLLNode {
  constructor(key, val) {
    this.key = key; this.val = val; this.prev = null; this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();                 // key -> node
    this.head = new DLLNode(null, null);  // sentinel: most recent side
    this.tail = new DLLNode(null, null);  // sentinel: least recent side
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  _remove(node) {                         // O(1)
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  _addToFront(node) {                     // O(1) -> most recently used
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  get(key) {                              // O(1)
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key);
    this._remove(node);
    this._addToFront(node);               // mark as recently used
    return node.val;
  }

  put(key, val) {                         // O(1)
    if (this.map.has(key)) this._remove(this.map.get(key));
    const node = new DLLNode(key, val);
    this._addToFront(node);
    this.map.set(key, node);
    if (this.map.size > this.capacity) {  // evict least recently used
      const lru = this.tail.prev;
      this._remove(lru);
      this.map.delete(lru.key);
      console.log(`  evicted key ${lru.key} (capacity ${this.capacity} exceeded)`);
    }
  }
}

const cache = new LRUCache(2);
cache.put(1, 'A');
cache.put(2, 'B');
console.log('get(1) ->', cache.get(1));   // A (1 now most recent)
cache.put(3, 'C');                          // evicts key 2 (least recent)
console.log('get(2) ->', cache.get(2));   // -1 (evicted)
cache.put(4, 'D');                          // evicts key 1
console.log('get(1) ->', cache.get(1));   // -1 (evicted)
console.log('get(3) ->', cache.get(3));   // C
console.log('get(4) ->', cache.get(4));   // D
