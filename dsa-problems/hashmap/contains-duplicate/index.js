// Run:  node dsa-problems/hashmap/contains-duplicate/index.js

// Contains duplicate: O(n) time, O(n) space. Returns true on first repeat.
function containsDuplicate(nums) {
  const seen = new Set();
  for (const n of nums) {
    if (seen.has(n)) return true;   // O(1) membership check
    seen.add(n);
  }
  return false;
}

console.log('Contains duplicate:');
console.log('  [1,2,3,4] ->', containsDuplicate([1, 2, 3, 4]));   // false
console.log('  [1,2,3,1] ->', containsDuplicate([1, 2, 3, 1]));   // true
