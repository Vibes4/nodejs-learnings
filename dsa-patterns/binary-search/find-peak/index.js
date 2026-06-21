// Run:  node dsa-patterns/binary-search/find-peak/index.js

// Modified binary search on the slope. If nums[mid] < nums[mid + 1] we are on
// an ascending slope, so a peak must lie to the right; otherwise a peak lies
// at mid or to the left. The range always shrinks toward a peak.
function findPeakElement(nums) {
  let lo = 0;
  let hi = nums.length - 1;

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] < nums[mid + 1]) {
      lo = mid + 1; // ascending -> peak is to the right
    } else {
      hi = mid;     // descending (or equal) -> peak is at mid or left
    }
  }
  return lo; // lo === hi points at a peak
}

// Demo
console.log(findPeakElement([1, 2, 3, 1]));       // 2  (value 3 is a peak)
console.log(findPeakElement([1, 2, 1, 3, 5, 6, 4])); // 5  (value 6; index 1 also valid)
console.log(findPeakElement([1]));                 // 0
