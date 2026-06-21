// Run:  node dsa-problems/strings/group-anagrams/index.js

// Group Anagrams: bucket by sorted-key. O(n·k log k) time, O(n·k) space.
function groupAnagrams(strs) {
  const buckets = new Map();
  for (const s of strs) {
    const key = s.split('').sort().join('');   // anagrams share the sorted key
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(s);
  }
  return [...buckets.values()];
}

console.log('Group Anagrams:');
console.log('  ["eat","tea","tan","ate","nat","bat"] ->',
  JSON.stringify(groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat'])));
