// Run:  node dsa-problems/linked-list/reverse-list/index.js

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

console.log('Reverse Linked List:');
console.log('  [1,2,3,4,5] ->', toArray(reverse(fromArray([1, 2, 3, 4, 5])))); // [5,4,3,2,1]
