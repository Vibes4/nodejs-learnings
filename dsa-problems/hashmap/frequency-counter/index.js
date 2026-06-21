// Run:  node dsa-problems/hashmap/frequency-counter/index.js

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

const words = ['apple', 'banana', 'apple', 'cherry', 'banana', 'apple'];
console.log('Frequency map:', Object.fromEntries(frequency(words)));
console.log('Most frequent:', mostFrequent(words)); // apple x3
