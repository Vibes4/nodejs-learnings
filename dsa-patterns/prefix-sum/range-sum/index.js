// Run:  node dsa-patterns/prefix-sum/range-sum/index.js

// Precompute prefix[k] = sum of the first k elements (prefix[0] = 0). Then the
// sum of nums[i..j] is prefix[j + 1] - prefix[i], answered in O(1) per query.
class NumArray {
  constructor(nums) {
    this.prefix = new Array(nums.length + 1).fill(0);
    for (let i = 0; i < nums.length; i++) {
      this.prefix[i + 1] = this.prefix[i] + nums[i];
    }
  }
  sumRange(i, j) {
    return this.prefix[j + 1] - this.prefix[i];
  }
}

// Demo
const na = new NumArray([-2, 0, 3, -5, 2, -1]);
console.log(na.sumRange(0, 2)); // 1   (-2 + 0 + 3)
console.log(na.sumRange(2, 5)); // -1  (3 - 5 + 2 - 1)
console.log(na.sumRange(0, 5)); // -3  (whole array)
