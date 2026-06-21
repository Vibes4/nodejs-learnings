// Run:  node dsa-patterns/two-pointers/sort-colors/index.js

// Dutch National Flag. Three pointers: `low` is the next slot for 0s, `high`
// the next slot for 2s, `mid` scans. Everything before low is 0, after high is 2.
function sortColors(nums) {
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;
  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--; // don't advance mid: the swapped-in value is unexamined
    }
  }
  return nums;
}

// Demo
console.log(sortColors([2, 0, 2, 1, 1, 0])); // [ 0, 0, 1, 1, 2, 2 ]
console.log(sortColors([2, 0, 1]));          // [ 0, 1, 2 ]
