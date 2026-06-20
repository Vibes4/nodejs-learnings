// Run:  node dsa/strings/index.js
// Valid Anagram (frequency count) + Longest Substring Without Repeating Characters.

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

// Longest substring without repeating characters: sliding window, O(n) time.
function lengthOfLongestSubstring(s) {
  const lastSeen = new Map();   // char -> last index
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (lastSeen.has(ch) && lastSeen.get(ch) >= left) {
      left = lastSeen.get(ch) + 1;   // jump past the previous occurrence
    }
    lastSeen.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}

console.log('Valid Anagram:');
console.log('  "listen","silent" ->', isAnagram('listen', 'silent')); // true
console.log('  "rat","car"       ->', isAnagram('rat', 'car'));       // false

console.log('\nLongest Substring Without Repeating Chars:');
console.log('  "abcabcbb" ->', lengthOfLongestSubstring('abcabcbb')); // 3 ("abc")
console.log('  "bbbbb"    ->', lengthOfLongestSubstring('bbbbb'));    // 1 ("b")
console.log('  "pwwkew"   ->', lengthOfLongestSubstring('pwwkew'));   // 3 ("wke")
