// Run:  node dsa-patterns/dynamic-programming/house-robber/index.js

// For each house, decide: skip it (carry the best so far) or rob it
// (its value plus the best up to two houses back). Track the running best
// "including up to previous" and "including up to the one before that".
function rob(nums) {
  let prev2 = 0; // best up to i-2
  let prev1 = 0; // best up to i-1
  for (const money of nums) {
    const cur = Math.max(prev1, prev2 + money);
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}

// Demo
console.log(rob([1, 2, 3, 1]));     // 4  (rob houses 1 and 3: 1 + 3)
console.log(rob([2, 7, 9, 3, 1]));  // 12 (rob houses 2, 9, 1)
console.log(rob([]));               // 0
