// Run:  node dsa-problems/arrays/merge-intervals/index.js

// Merge Intervals: sort by start, merge overlaps. O(n log n) time, O(n) space.
function mergeIntervals(intervals) {
  if (!intervals.length) return [];
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const merged = [sorted[0].slice()];
  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    if (sorted[i][0] <= last[1]) last[1] = Math.max(last[1], sorted[i][1]); // overlap
    else merged.push(sorted[i].slice());
  }
  return merged;
}

console.log('Merge Intervals:');
console.log('  [[1,3],[2,6],[8,10],[15,18]] ->',
  JSON.stringify(mergeIntervals([[1, 3], [2, 6], [8, 10], [15, 18]]))); // [[1,6],[8,10],[15,18]]
