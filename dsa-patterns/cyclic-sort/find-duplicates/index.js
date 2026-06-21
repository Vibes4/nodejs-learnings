// Run:  node dsa-patterns/cyclic-sort/find-duplicates/index.js

// Cyclic sort: value v in [1..n] belongs at index v-1. Keep swapping until
// each slot holds its value or its target slot already holds a duplicate.
// Any index i whose value is not i+1 holds a number that appeared twice.
function findDuplicates(nums) {
  const n = nums.length;
  let i = 0;
  while (i < n) {
    const target = nums[i] - 1;
    if (nums[i] !== nums[target]) {
      [nums[i], nums[target]] = [nums[target], nums[i]];
    } else {
      i++;
    }
  }
  const dups = [];
  for (let j = 0; j < n; j++) {
    if (nums[j] !== j + 1) dups.push(nums[j]);
  }
  return dups;
}

// Demo
console.log(findDuplicates([4, 3, 2, 7, 8, 2, 3, 1])); // [ 3, 2 ]  (order not guaranteed)
console.log(findDuplicates([1, 1, 2]));                // [ 1 ]
console.log(findDuplicates([1, 2, 3]));                // []
