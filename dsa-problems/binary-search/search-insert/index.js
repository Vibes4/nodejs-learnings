// Run:  node dsa-problems/binary-search/search-insert/index.js

// Search insert position: index where target is, or would be inserted. O(log n).
function searchInsert(arr, target) {
  let lo = 0, hi = arr.length;          // note: hi is length (exclusive)
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

const a = [1, 3, 5, 7, 9, 11];
console.log('searchInsert(6)  ->', searchInsert(a, 6));  // 3
console.log('searchInsert(12) ->', searchInsert(a, 12)); // 6
