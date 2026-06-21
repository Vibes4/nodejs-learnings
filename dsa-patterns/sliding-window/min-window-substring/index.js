// Run:  node dsa-patterns/sliding-window/min-window-substring/index.js

// Expand the window to the right until it covers all of t (tracked by `need`
// and a `missing` counter). Then shrink from the left while still valid,
// recording the smallest window seen.
function minWindow(s, t) {
  if (t.length === 0 || s.length < t.length) return "";
  const need = new Map();
  for (const ch of t) need.set(ch, (need.get(ch) || 0) + 1);
  let missing = t.length; // total chars still required
  let start = 0;
  let bestStart = 0;
  let bestLen = Infinity;
  for (let end = 0; end < s.length; end++) {
    const ch = s[end];
    if (need.has(ch)) {
      if (need.get(ch) > 0) missing--;
      need.set(ch, need.get(ch) - 1);
    }
    while (missing === 0) {
      if (end - start + 1 < bestLen) {
        bestLen = end - start + 1;
        bestStart = start;
      }
      const left = s[start];
      if (need.has(left)) {
        need.set(left, need.get(left) + 1);
        if (need.get(left) > 0) missing++;
      }
      start++;
    }
  }
  return bestLen === Infinity ? "" : s.slice(bestStart, bestStart + bestLen);
}

// Demo
console.log(minWindow("ADOBECODEBANC", "ABC")); // "BANC"
console.log(minWindow("a", "a"));               // "a"
console.log(minWindow("a", "aa"));              // ""
