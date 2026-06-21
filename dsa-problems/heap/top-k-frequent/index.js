// Run:  node dsa-problems/heap/top-k-frequent/index.js

// Top K Frequent Elements: frequency map + bucket sort by count. O(n) time, O(n) space.
function topKFrequent(nums, k) {
  const freq = new Map();
  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, count] of freq) buckets[count].push(num); // index = frequency
  const out = [];
  for (let c = buckets.length - 1; c >= 0 && out.length < k; c--) {
    for (const num of buckets[c]) {
      out.push(num);
      if (out.length === k) break;
    }
  }
  return out;
}

console.log('[1,1,1,2,2,3], k=2 ->', JSON.stringify(topKFrequent([1, 1, 1, 2, 2, 3], 2))); // [1,2]
console.log('[1], k=1           ->', JSON.stringify(topKFrequent([1], 1)));                // [1]
