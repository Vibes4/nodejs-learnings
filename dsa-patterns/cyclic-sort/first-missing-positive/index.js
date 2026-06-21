// Run:  node dsa-patterns/cyclic-sort/first-missing-positive/index.js

// Cyclic sort, ignoring values outside [1..n]: place value v at index v-1.
// Only the range [1..n] can hold the answer (with n elements). After sorting,
// the first index i whose value is not i+1 gives answer i+1; if all match,
// the answer is n+1.
function firstMissingPositive(nums) {
  const n = nums.length;
  let i = 0;
  while (i < n) {
    const target = nums[i] - 1;
    if (nums[i] > 0 && nums[i] <= n && nums[i] !== nums[target]) {
      [nums[i], nums[target]] = [nums[target], nums[i]];
    } else {
      i++;
    }
  }
  for (let j = 0; j < n; j++) {
    if (nums[j] !== j + 1) return j + 1;
  }
  return n + 1;
}

// Demo
console.log(firstMissingPositive([1, 2, 0]));       // 3
console.log(firstMissingPositive([3, 4, -1, 1]));   // 2
console.log(firstMissingPositive([7, 8, 9, 11, 12])); // 1
