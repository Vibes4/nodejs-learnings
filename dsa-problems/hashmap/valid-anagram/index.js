// Run:  node dsa-problems/hashmap/valid-anagram/index.js

// Valid Anagram (frequency map compare): O(n) time, O(k) space.
function isAnagramMap(a, b) {
  if (a.length !== b.length) return false;
  const count = new Map();
  for (const ch of a) count.set(ch, (count.get(ch) || 0) + 1);
  for (const ch of b) {
    if (!count.get(ch)) return false;  // missing or already exhausted
    count.set(ch, count.get(ch) - 1);
  }
  return true;
}

console.log('Valid Anagram (HashMap):');
console.log('  "listen","silent" ->', isAnagramMap('listen', 'silent')); // true
console.log('  "rat","car"       ->', isAnagramMap('rat', 'car'));       // false
