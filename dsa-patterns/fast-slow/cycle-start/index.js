// Run:  node dsa-patterns/fast-slow/cycle-start/index.js

class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

function buildList(values) {
  const dummy = new ListNode(0);
  let tail = dummy;
  for (const v of values) {
    tail.next = new ListNode(v);
    tail = tail.next;
  }
  return dummy.next;
}

// Phase 1: find the meeting point with tortoise/hare.
// Phase 2: reset one pointer to head; both advance one step until they meet —
// that node is the cycle's start (distance head->start == meeting->start).
function detectCycleStart(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {
      let ptr = head;
      while (ptr !== slow) {
        ptr = ptr.next;
        slow = slow.next;
      }
      return ptr;
    }
  }
  return null;
}

// Demo: cycle whose tail links back to the 3rd node (value 3)
const list = buildList([1, 2, 3, 4, 5]);
let tail = list;
while (tail.next) tail = tail.next;
tail.next = list.next.next; // 5 -> node(3)
const start = detectCycleStart(list);
console.log(start ? start.val : null); // 3

// Demo: acyclic list returns null
const acyclic = buildList([1, 2, 3]);
const none = detectCycleStart(acyclic);
console.log(none ? none.val : null); // null
