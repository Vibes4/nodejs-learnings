// Run:  node dsa-problems/linked-list/merge-two-lists/index.js

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

// Merge Two Sorted Lists: dummy head, splice smaller node each step. O(n+m) time, O(1) space.
function mergeTwoLists(l1, l2) {
  const dummy = new Node(null);
  let tail = dummy;
  while (l1 && l2) {
    if (l1.val <= l2.val) { tail.next = l1; l1 = l1.next; }
    else { tail.next = l2; l2 = l2.next; }
    tail = tail.next;
  }
  tail.next = l1 || l2;                  // attach the remaining tail
  return dummy.next;
}

console.log('Merge Two Sorted Lists:');
console.log('  [1,2,4] + [1,3,4] ->',
  toArray(mergeTwoLists(fromArray([1, 2, 4]), fromArray([1, 3, 4])))); // [1,1,2,3,4,4]
