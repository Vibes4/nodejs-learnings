// Run:  node dsa-patterns/fast-slow/linked-list-cycle/index.js

class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

// Build a singly linked list from an array, return its head.
function buildList(values) {
  const dummy = new ListNode(0);
  let tail = dummy;
  for (const v of values) {
    tail.next = new ListNode(v);
    tail = tail.next;
  }
  return dummy.next;
}

// Floyd's tortoise and hare. If fast ever catches slow, a cycle exists.
function hasCycle(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

// Demo: acyclic list
const acyclic = buildList([1, 2, 3, 4]);
console.log(hasCycle(acyclic)); // false

// Demo: link the tail back to the 2nd node to create a cycle
const cyclic = buildList([1, 2, 3, 4]);
let tail = cyclic;
while (tail.next) tail = tail.next;
tail.next = cyclic.next; // 4 -> node(2)
console.log(hasCycle(cyclic)); // true
