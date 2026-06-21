// Run:  node dsa-patterns/sliding-window/longest-substring-no-repeat/index.js

// Dynamic window. `start` is the left edge; a last-seen map tells us where each
// char appeared. On a repeat inside the window, jump `start` past it.
function lengthOfLongestSubstring(s) {
  const lastSeen = new Map();
  let start = 0;
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (lastSeen.has(ch) && lastSeen.get(ch) >= start) {
      start = lastSeen.get(ch) + 1;
    }
    lastSeen.set(ch, i);
    best = Math.max(best, i - start + 1);
  }
  return best;
}

// Demo
console.log(lengthOfLongestSubstring("abcabcbb")); // 3  ("abc")
console.log(lengthOfLongestSubstring("bbbbb"));    // 1  ("b")
console.log(lengthOfLongestSubstring("pwwkew"));   // 3  ("wke")
