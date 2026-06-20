// Run:  node dsa/linked-list/index.js
// Build a list, reverse it, and detect a cycle with fast/slow pointers.

class Node {
  constructor(val) { this.val = val; this.next = null; }
}

function fromArray(arr) {
  const dummy = new Node(null);
  let tail = dummy;
  for (const v of arr) { tail.next = new Node(v); tail = tail.next; }
  return dummy.next;
}

function toArray(head) {
  const out = [];
  for (let n = head; n; n = n.next) out.push(n.val);
  return out;
}

// Reverse in place: O(n) time, O(1) space.
function reverse(head) {
  let prev = null, curr = head;
  while (curr) {
    const next = curr.next;   // save before overwriting
    curr.next = prev;         // flip the link
    prev = curr;
    curr = next;
  }
  return prev;                // new head
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

const list = fromArray([1, 2, 3, 4, 5]);
console.log('Original:', toArray(list));
console.log('Reversed:', toArray(reverse(fromArray([1, 2, 3, 4, 5]))));

// Build a cycle: tail -> node 3
const cyc = fromArray([1, 2, 3, 4]);
let tail = cyc; while (tail.next) tail = tail.next;
tail.next = cyc.next.next;   // point tail back into the list
console.log('\nDetect cycle:');
console.log('  acyclic [1,2,3] ->', hasCycle(fromArray([1, 2, 3]))); // false
console.log('  with cycle      ->', hasCycle(cyc));                   // true
