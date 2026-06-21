// Run:  node dsa-problems/strings/valid-anagram/index.js

// Valid Anagram: O(n) time, O(1) space (fixed alphabet).
function isAnagram(a, b) {
  if (a.length !== b.length) return false;
  const count = {};
  for (const ch of a) count[ch] = (count[ch] || 0) + 1;
  for (const ch of b) {
    if (!count[ch]) return false;   // missing or already exhausted
    count[ch]--;
  }
  return true;
}

console.log('Valid Anagram:');
console.log('  "listen","silent" ->', isAnagram('listen', 'silent')); // true
console.log('  "rat","car"       ->', isAnagram('rat', 'car'));       // false
