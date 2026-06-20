// Run:  node dsa/arrays/index.js
// Two Sum (HashMap) + Sliding Window maximum subarray sum of size k.

// Two Sum: O(n) time, O(n) space.
function twoSum(nums, target) {
  const seen = new Map();            // value -> index
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return null;
}

// Sliding Window: max sum of any contiguous subarray of size k. O(n) time, O(1) space.
function maxSubarraySum(nums, k) {
  if (nums.length < k) return null;
  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += nums[i];   // first window
  let best = windowSum;
  for (let i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k];               // slide: add right, drop left
    best = Math.max(best, windowSum);
  }
  return best;
}

console.log('Two Sum:');
console.log('  [2,7,11,15], target 9 ->', twoSum([2, 7, 11, 15], 9)); // [0,1]
console.log('  [3,2,4],     target 6 ->', twoSum([3, 2, 4], 6));      // [1,2]

console.log('\nSliding Window (max sum of size k):');
console.log('  [2,1,5,1,3,2], k=3 ->', maxSubarraySum([2, 1, 5, 1, 3, 2], 3)); // 9
console.log('  [1,1,1,1,1],   k=2 ->', maxSubarraySum([1, 1, 1, 1, 1], 2));    // 2
