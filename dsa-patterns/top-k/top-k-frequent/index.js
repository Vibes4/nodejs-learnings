// Run:  node dsa-patterns/top-k/top-k-frequent/index.js

// Bucket sort by frequency. A value can appear at most n times, so buckets
// indexed 1..n hold the values having that frequency. Walk buckets from high
// frequency to low and collect the first k values -> overall O(n).
function topKFrequent(nums, k) {
  const freq = new Map();
  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);

  // buckets[f] = list of values that occur exactly f times
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [val, count] of freq) buckets[count].push(val);

  const result = [];
  for (let f = buckets.length - 1; f >= 1 && result.length < k; f--) {
    for (const val of buckets[f]) {
      result.push(val);
      if (result.length === k) break;
    }
  }
  return result;
}

// Demo
console.log(JSON.stringify(topKFrequent([1, 1, 1, 2, 2, 3], 2))); // [1,2]
console.log(JSON.stringify(topKFrequent([1], 1)));                // [1]
