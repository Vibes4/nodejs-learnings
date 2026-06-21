// Run:  node dsa-problems/linked-list/detect-cycle/index.js

class Node {
  constructor(val) { this.val = val; this.next = null; }
}

function fromArray(arr) {
  const dummy = new Node(null);
  let tail = dummy;
  for (const v of arr) { tail.next = new Node(v); tail = tail.next; }
  return dummy.next;
}

// Floyd's cycle detection: O(n) time, O(1) space.
function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

// Build a cycle: tail -> node 3
const cyc = fromArray([1, 2, 3, 4]);
let tail = cyc; while (tail.next) tail = tail.next;
tail.next = cyc.next.next;   // point tail back into the list

console.log('Detect cycle:');
console.log('  acyclic [1,2,3] ->', hasCycle(fromArray([1, 2, 3]))); // false
console.log('  with cycle      ->', hasCycle(cyc));                   // true
