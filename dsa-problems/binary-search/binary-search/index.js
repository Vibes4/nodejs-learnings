// Run:  node dsa-problems/binary-search/binary-search/index.js

// Classic binary search: O(log n). Returns index or -1.
function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

const a = [1, 3, 5, 7, 9, 11];
console.log('binarySearch(7) ->', binarySearch(a, 7)); // 3
console.log('binarySearch(4) ->', binarySearch(a, 4)); // -1
