// Run:  node dsa/hashmap/index.js
// Frequency counter (Map) + contains-duplicate (Set).

// Frequency counter: O(n) time, O(k) space (k distinct items).
function frequency(items) {
  const freq = new Map();
  for (const item of items) {
    freq.set(item, (freq.get(item) || 0) + 1);
  }
  return freq;
}

// Most frequent element.
function mostFrequent(items) {
  let best = null, bestCount = 0;
  for (const [item, count] of frequency(items)) {
    if (count > bestCount) { best = item; bestCount = count; }
  }
  return { item: best, count: bestCount };
}

// Contains duplicate: O(n) time, O(n) space. Returns true on first repeat.
function containsDuplicate(nums) {
  const seen = new Set();
  for (const n of nums) {
    if (seen.has(n)) return true;   // O(1) membership check
    seen.add(n);
  }
  return false;
}

const words = ['apple', 'banana', 'apple', 'cherry', 'banana', 'apple'];
console.log('Frequency map:', Object.fromEntries(frequency(words)));
console.log('Most frequent:', mostFrequent(words)); // apple x3

console.log('\nContains duplicate:');
console.log('  [1,2,3,4]   ->', containsDuplicate([1, 2, 3, 4]));   // false
console.log('  [1,2,3,1]   ->', containsDuplicate([1, 2, 3, 1]));   // true
