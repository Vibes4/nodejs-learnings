// Run:  node dsa-patterns/monotonic-stack/next-greater/index.js

// Keep a stack of indices whose "next greater" is still unknown, with values in
// DECREASING order. When the current value exceeds the stack top, it IS that
// top's next greater element; pop and record it. Anything left on the stack at
// the end has no greater element to its right, so it stays -1.
function nextGreaterElements(nums) {
  const result = new Array(nums.length).fill(-1);
  const stack = []; // indices awaiting their next greater value
  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[i] > nums[stack[stack.length - 1]]) {
      result[stack.pop()] = nums[i];
    }
    stack.push(i);
  }
  return result;
}

// Demo
console.log(nextGreaterElements([2, 1, 2, 4, 3])); // [ 4, 2, 4, -1, -1 ]
console.log(nextGreaterElements([5, 4, 3, 2, 1])); // [ -1, -1, -1, -1, -1 ]
console.log(nextGreaterElements([1, 3, 2, 4]));    // [ 3, 4, 4, -1 ]
