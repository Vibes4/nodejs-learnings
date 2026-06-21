// Run:  node dsa-patterns/binary-search/koko-bananas/index.js

// Binary search on the ANSWER. The feasible speeds form a monotonic predicate:
// if speed k finishes within h hours, so does every speed > k. Search the
// smallest k in [1, maxPile] for which hoursNeeded(k) <= h.
function minEatingSpeed(piles, h) {
  const hoursNeeded = (k) => {
    let hours = 0;
    for (const p of piles) hours += Math.ceil(p / k);
    return hours;
  };

  let lo = 1;
  let hi = Math.max(...piles);

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (hoursNeeded(mid) <= h) {
      hi = mid;     // mid works -> try slower
    } else {
      lo = mid + 1; // too slow -> speed up
    }
  }
  return lo;
}

// Demo
console.log(minEatingSpeed([3, 6, 7, 11], 8));        // 4
console.log(minEatingSpeed([30, 11, 23, 4, 20], 5));  // 30
console.log(minEatingSpeed([30, 11, 23, 4, 20], 6));  // 23
