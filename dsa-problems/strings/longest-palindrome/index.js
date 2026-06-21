// Run:  node dsa-problems/strings/longest-palindrome/index.js

// Longest Palindromic Substring: expand around center. O(n²) time, O(1) space.
function longestPalindrome(s) {
  if (s.length < 2) return s;
  let start = 0, maxLen = 1;
  const expand = (l, r) => {
    while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }
    if (r - l - 1 > maxLen) { maxLen = r - l - 1; start = l + 1; } // window grew
  };
  for (let i = 0; i < s.length; i++) {
    expand(i, i);       // odd-length center
    expand(i, i + 1);   // even-length center
  }
  return s.slice(start, start + maxLen);
}

console.log('Longest Palindromic Substring:');
console.log('  "babad" ->', longestPalindrome('babad')); // "bab" or "aba"
console.log('  "cbbd"  ->', longestPalindrome('cbbd'));   // "bb"
