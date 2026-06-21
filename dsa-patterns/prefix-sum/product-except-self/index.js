// Run:  node dsa-patterns/prefix-sum/product-except-self/index.js

// output[i] = (product of everything to the LEFT of i) * (product to the RIGHT).
// First pass fills output with running left products. Second pass walks right to
// left, multiplying by a running right product. No division is used.
function productExceptSelf(nums) {
  const n = nums.length;
  const output = new Array(n).fill(1);
  let left = 1;
  for (let i = 0; i < n; i++) {
    output[i] = left;       // product of all elements before i
    left *= nums[i];
  }
  let right = 1;
  for (let i = n - 1; i >= 0; i--) {
    output[i] *= right;     // multiply in product of all elements after i
    right *= nums[i];
  }
  return output;
}

// Demo
console.log(productExceptSelf([1, 2, 3, 4]));    // [ 24, 12, 8, 6 ]
console.log(productExceptSelf([-1, 1, 0, -3, 3])); // [ 0, 0, 9, 0, 0 ]
