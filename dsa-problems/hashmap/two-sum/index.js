// Run:  node dsa-problems/hashmap/two-sum/index.js

// Two Sum (complement HashMap): O(n) time, O(n) space.
function twoSumMap(nums, target) {
  const seen = new Map();              // value -> index
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return null;
}

console.log('Two Sum (HashMap):');
console.log('  [2,7,11,15], target 9 ->', twoSumMap([2, 7, 11, 15], 9)); // [0,1]
console.log('  [3,2,4],     target 6 ->', twoSumMap([3, 2, 4], 6));      // [1,2]
