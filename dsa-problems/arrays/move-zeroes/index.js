// Run:  node dsa-problems/arrays/move-zeroes/index.js

// Move Zeroes: two pointers in-place, keep non-zero order. O(n) time, O(1) space.
function moveZeroes(nums) {
  let insert = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {                        // swap non-zero to the front slot
      [nums[insert], nums[i]] = [nums[i], nums[insert]];
      insert++;
    }
  }
  return nums;
}

console.log('Move Zeroes:');
console.log('  [0,1,0,3,12] ->', moveZeroes([0, 1, 0, 3, 12])); // [1,3,12,0,0]
