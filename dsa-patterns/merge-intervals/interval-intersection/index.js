// Run:  node dsa-patterns/merge-intervals/interval-intersection/index.js

// Two pointers, one per list. The intersection of A[i] and B[j] is
// [max(starts), min(ends)] — it is valid only when that low <= high.
// Advance the pointer whose interval ends first, since it cannot intersect
// any later interval in the other list.
function intervalIntersection(A, B) {
  const result = [];
  let i = 0, j = 0;
  while (i < A.length && j < B.length) {
    const low = Math.max(A[i][0], B[j][0]);
    const high = Math.min(A[i][1], B[j][1]);
    if (low <= high) result.push([low, high]);
    if (A[i][1] < B[j][1]) i++;
    else j++;
  }
  return result;
}

// Demo
const A = [[0, 2], [5, 10], [13, 23], [24, 25]];
const B = [[1, 5], [8, 12], [15, 24], [25, 26]];
console.log(intervalIntersection(A, B));
// [ [ 1, 2 ], [ 5, 5 ], [ 8, 10 ], [ 15, 23 ], [ 24, 24 ], [ 25, 25 ] ]
