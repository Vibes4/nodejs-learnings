// Run:  node dsa-problems/stack/next-greater/index.js

// Next Greater Element: monotonic decreasing stack of indices. O(n) time, O(n) space.
function nextGreaterElement(nums) {
  const res = new Array(nums.length).fill(-1);
  const stack = [];                       // holds indices awaiting their next-greater
  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[i] > nums[stack[stack.length - 1]]) {
      res[stack.pop()] = nums[i];         // current value is the answer for popped index
    }
    stack.push(i);
  }
  return res;
}

console.log('Next Greater Element:');
console.log('  [2,1,2,4,3] ->', JSON.stringify(nextGreaterElement([2, 1, 2, 4, 3]))); // [4,2,4,-1,-1]
