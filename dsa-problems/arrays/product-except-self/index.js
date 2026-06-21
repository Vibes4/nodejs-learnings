// Run:  node dsa-problems/arrays/product-except-self/index.js

// Product of Array Except Self: prefix * suffix, no division. O(n) time, O(n) space.
function productExceptSelf(nums) {
  const out = new Array(nums.length).fill(1);
  let prefix = 1;
  for (let i = 0; i < nums.length; i++) {      // products of everything to the left
    out[i] = prefix;
    prefix *= nums[i];
  }
  let suffix = 1;
  for (let i = nums.length - 1; i >= 0; i--) { // multiply in products to the right
    out[i] *= suffix;
    suffix *= nums[i];
  }
  return out;
}

console.log('Product Except Self:');
console.log('  [1,2,3,4] ->', productExceptSelf([1, 2, 3, 4])); // [24,12,8,6]
