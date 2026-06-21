// Run:  node dsa-patterns/prefix-sum/subarray-sum-k/index.js

// Let prefix = sum of nums[0..i]. A subarray ending at i sums to k exactly when
// some earlier prefix equals (prefix - k). We keep a hashmap of how many times
// each prefix value has occurred and add those counts as we scan, giving O(n).
// Seeding the map with {0: 1} accounts for subarrays starting at index 0.
function subarraySum(nums, k) {
  const counts = new Map([[0, 1]]);
  let prefix = 0;
  let total = 0;
  for (const num of nums) {
    prefix += num;
    total += counts.get(prefix - k) || 0;
    counts.set(prefix, (counts.get(prefix) || 0) + 1);
  }
  return total;
}

// Demo
console.log(subarraySum([1, 1, 1], 2));        // 2  ([1,1] at 0-1 and 1-2)
console.log(subarraySum([1, 2, 3], 3));        // 2  ([1,2] and [3])
console.log(subarraySum([1, -1, 1, -1], 0));   // 4
