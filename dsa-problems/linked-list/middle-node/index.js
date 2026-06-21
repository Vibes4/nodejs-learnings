// Run:  node dsa-problems/linked-list/middle-node/index.js

class Node {
  constructor(val) { this.val = val; this.next = null; }
}

function fromArray(arr) {
  const dummy = new Node(null);
  let tail = dummy;
  for (const v of arr) { tail.next = new Node(v); tail = tail.next; }
  return dummy.next;
}

// Middle of the Linked List: fast/slow pointers. O(n) time, O(1) space.
function middleNode(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {            // fast moves 2x, slow lands on middle
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;                           // for even length, the second middle
}

console.log('Middle Node:');
console.log('  [1,2,3,4,5] ->', middleNode(fromArray([1, 2, 3, 4, 5])).val); // 3
console.log('  [1,2,3,4]   ->', middleNode(fromArray([1, 2, 3, 4])).val);    // 3
