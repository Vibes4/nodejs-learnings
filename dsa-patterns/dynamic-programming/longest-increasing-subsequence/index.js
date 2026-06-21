// Run:  node dsa-patterns/dynamic-programming/longest-increasing-subsequence/index.js

// dp[i] = length of the longest increasing subsequence ENDING at index i.
// For each i, look at every earlier j with nums[j] < nums[i] and extend.
// The answer is the max over all dp[i].  (An O(n log n) version exists using
// a "tails" array and binary search, but this O(n^2) DP is the classic one.)
function lengthOfLIS(nums) {
  if (nums.length === 0) return 0;
  const dp = new Array(nums.length).fill(1);
  let best = 1;
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) {
        dp[i] = dp[j] + 1;
      }
    }
    if (dp[i] > best) best = dp[i];
  }
  return best;
}

// Demo
console.log(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18])); // 4  (2,3,7,101)
console.log(lengthOfLIS([0, 1, 0, 3, 2, 3]));           // 4  (0,1,2,3)
console.log(lengthOfLIS([7, 7, 7, 7]));                 // 1
