// Run:  node dsa-patterns/two-pointers/three-sum/index.js

// Sort first. Fix one element, then use two pointers converging from both ends
// of the remaining tail to find pairs that complete a zero-sum triplet.
// Skip duplicates at every level to keep triplets unique.
function threeSum(nums) {
  const arr = [...nums].sort((a, b) => a - b);
  const res = [];
  for (let i = 0; i < arr.length - 2; i++) {
    if (i > 0 && arr[i] === arr[i - 1]) continue; // skip duplicate anchors
    let lo = i + 1;
    let hi = arr.length - 1;
    while (lo < hi) {
      const sum = arr[i] + arr[lo] + arr[hi];
      if (sum === 0) {
        res.push([arr[i], arr[lo], arr[hi]]);
        lo++;
        hi--;
        while (lo < hi && arr[lo] === arr[lo - 1]) lo++; // skip dup lows
        while (lo < hi && arr[hi] === arr[hi + 1]) hi--; // skip dup highs
      } else if (sum < 0) {
        lo++;
      } else {
        hi--;
      }
    }
  }
  return res;
}

// Demo
console.log(threeSum([-1, 0, 1, 2, -1, -4])); // [ [ -1, -1, 2 ], [ -1, 0, 1 ] ]
console.log(threeSum([0, 0, 0, 0]));          // [ [ 0, 0, 0 ] ]
console.log(threeSum([1, 2, 3]));             // []
