// Run:  node dsa-problems/binary-search/first-last-occurrence/index.js

// First occurrence (lower bound) with duplicates. O(log n). -1 if absent.
function firstOccurrence(arr, target) {
  let lo = 0, hi = arr.length - 1, ans = -1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (arr[mid] === target) { ans = mid; hi = mid - 1; } // keep going left
    else if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return ans;
}

// Last occurrence (upper bound) with duplicates. O(log n). -1 if absent.
function lastOccurrence(arr, target) {
  let lo = 0, hi = arr.length - 1, ans = -1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (arr[mid] === target) { ans = mid; lo = mid + 1; } // keep going right
    else if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return ans;
}

const dups = [1, 2, 2, 2, 3, 4];
console.log('firstOccurrence(2) ->', firstOccurrence(dups, 2)); // 1
console.log('lastOccurrence(2)  ->', lastOccurrence(dups, 2));  // 3
console.log('firstOccurrence(5) ->', firstOccurrence(dups, 5)); // -1
