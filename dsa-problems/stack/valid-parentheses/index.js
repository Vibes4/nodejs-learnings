// Run:  node dsa-problems/stack/valid-parentheses/index.js

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

console.log('Valid Parentheses:');
console.log('  "()[]{}" ->', isValid('()[]{}')); // true
console.log('  "(]"     ->', isValid('(]'));      // false
console.log('  "([)]"   ->', isValid('([)]'));    // false
