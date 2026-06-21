// Run:  node dsa-patterns/cyclic-sort/missing-number/index.js

// Cyclic sort: each value v in [0..n] belongs at index v. Place values whose
// target index is in range; values equal to n have no slot and are skipped.
// After sorting, the first index i where nums[i] !== i is the missing number;
// if all match, the missing one is n.
function missingNumber(nums) {
  const n = nums.length;
  let i = 0;
  while (i < n) {
    const target = nums[i];
    if (target < n && nums[i] !== nums[target]) {
      [nums[i], nums[target]] = [nums[target], nums[i]];
    } else {
      i++;
    }
  }
  for (let j = 0; j < n; j++) {
    if (nums[j] !== j) return j;
  }
  return n;
}

// Demo
console.log(missingNumber([3, 0, 1]));        // 2
console.log(missingNumber([0, 1]));           // 2
console.log(missingNumber([9, 6, 4, 2, 3, 5, 7, 0, 1])); // 8
