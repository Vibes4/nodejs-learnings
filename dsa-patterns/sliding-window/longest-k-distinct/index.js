// Run:  node dsa-patterns/sliding-window/longest-k-distinct/index.js

// Grow the window to the right; whenever it holds more than k distinct chars,
// shrink from the left until it is valid again. A count map tracks frequencies.
function longestKDistinct(s, k) {
  if (k <= 0) return 0;
  const counts = new Map();
  let start = 0;
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    counts.set(ch, (counts.get(ch) || 0) + 1);
    while (counts.size > k) {
      const left = s[start];
      counts.set(left, counts.get(left) - 1);
      if (counts.get(left) === 0) counts.delete(left);
      start++;
    }
    best = Math.max(best, i - start + 1);
  }
  return best;
}

// Demo
console.log(longestKDistinct("eceba", 2));   // 3  ("ece")
console.log(longestKDistinct("aa", 1));      // 2  ("aa")
console.log(longestKDistinct("aabacbebebe", 3)); // 7  ("cbebebe")
