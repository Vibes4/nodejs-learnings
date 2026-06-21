// Run:  node dsa-patterns/binary-search/rotated-array/index.js

// Modified binary search. At each step one half [lo..mid] or [mid..hi] is
// guaranteed to be sorted. Decide which half is sorted, then check whether the
// target lies within that sorted range to pick the side to keep searching.
function search(nums, target) {
  let lo = 0;
  let hi = nums.length - 1;

  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;

    if (nums[lo] <= nums[mid]) {
      // left half [lo..mid] is sorted
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      // right half [mid..hi] is sorted
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}

// Demo
console.log(search([4, 5, 6, 7, 0, 1, 2], 0)); // 4
console.log(search([4, 5, 6, 7, 0, 1, 2], 3)); // -1
console.log(search([1], 1));                    // 0
