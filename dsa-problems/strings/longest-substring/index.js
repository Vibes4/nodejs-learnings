// Run:  node dsa-problems/strings/longest-substring/index.js

// Longest substring without repeating characters: sliding window, O(n) time, O(n) space.
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

console.log('Longest Substring Without Repeating Chars:');
console.log('  "abcabcbb" ->', lengthOfLongestSubstring('abcabcbb')); // 3 ("abc")
console.log('  "bbbbb"    ->', lengthOfLongestSubstring('bbbbb'));    // 1 ("b")
console.log('  "pwwkew"   ->', lengthOfLongestSubstring('pwwkew'));   // 3 ("wke")
