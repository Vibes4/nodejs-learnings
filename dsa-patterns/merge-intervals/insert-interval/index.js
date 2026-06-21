// Run:  node dsa-patterns/merge-intervals/insert-interval/index.js

// Three phases over the already-sorted list:
//   1. Copy intervals that end before the new one starts (no overlap, left side).
//   2. Merge every interval that overlaps the new one into a single interval.
//   3. Copy the remaining intervals that start after the merged one ends.
function insertInterval(intervals, newInterval) {
  const result = [];
  let [start, end] = newInterval;
  let i = 0;
  const n = intervals.length;

  while (i < n && intervals[i][1] < start) {
    result.push(intervals[i]);
    i++;
  }
  while (i < n && intervals[i][0] <= end) {
    start = Math.min(start, intervals[i][0]);
    end = Math.max(end, intervals[i][1]);
    i++;
  }
  result.push([start, end]);
  while (i < n) {
    result.push(intervals[i]);
    i++;
  }
  return result;
}

// Demo
console.log(insertInterval([[1, 3], [6, 9]], [2, 5]));
// [ [ 1, 5 ], [ 6, 9 ] ]
console.log(insertInterval([[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]));
// [ [ 1, 2 ], [ 3, 10 ], [ 12, 16 ] ]
