// Run:  node dsa-patterns/merge-intervals/merge-intervals/index.js

// Sort intervals by start. Walk through them; if the current interval overlaps
// the last merged one (current.start <= last.end), extend the last end.
// Otherwise push the current interval as a new block.
function mergeIntervals(intervals) {
  if (intervals.length === 0) return [];
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const merged = [sorted[0].slice()];
  for (let i = 1; i < sorted.length; i++) {
    const [start, end] = sorted[i];
    const last = merged[merged.length - 1];
    if (start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      merged.push([start, end]);
    }
  }
  return merged;
}

// Demo
console.log(mergeIntervals([[1, 3], [2, 6], [8, 10], [15, 18]]));
// [ [ 1, 6 ], [ 8, 10 ], [ 15, 18 ] ]
console.log(mergeIntervals([[1, 4], [4, 5]]));
// [ [ 1, 5 ] ]
