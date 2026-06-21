// Run:  node dsa-problems/stack/min-stack/index.js

// MinStack: every op is O(1) by tracking the running minimum.
class MinStack {
  constructor() { this.stack = []; this.mins = []; }
  push(x) {
    this.stack.push(x);
    const min = this.mins.length ? Math.min(x, this.peekMin()) : x;
    this.mins.push(min);
  }
  pop() { this.mins.pop(); return this.stack.pop(); }
  top() { return this.stack[this.stack.length - 1]; }
  peekMin() { return this.mins[this.mins.length - 1]; }
}

console.log('MinStack:');
const ms = new MinStack();
[5, 3, 7, 2].forEach((x) => ms.push(x));
console.log('  pushed 5,3,7,2  min =', ms.peekMin()); // 2
ms.pop();
console.log('  popped 2        min =', ms.peekMin()); // 3
