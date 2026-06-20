// Run:  node dsa/stack/index.js
// Valid Parentheses + a MinStack with O(1) getMin.

// Valid Parentheses: O(n) time, O(n) space.
function isValid(s) {
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const stack = [];
  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') {
      stack.push(ch);
    } else {
      if (stack.pop() !== pairs[ch]) return false;  // mismatch or empty
    }
  }
  return stack.length === 0;   // leftover openers = invalid
}

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

console.log('Valid Parentheses:');
console.log('  "()[]{}" ->', isValid('()[]{}')); // true
console.log('  "(]"     ->', isValid('(]'));      // false
console.log('  "([)]"   ->', isValid('([)]'));    // false

console.log('\nMinStack:');
const ms = new MinStack();
[5, 3, 7, 2].forEach((x) => ms.push(x));
console.log('  pushed 5,3,7,2  min =', ms.peekMin()); // 2
ms.pop();
console.log('  popped 2        min =', ms.peekMin()); // 3
