// Run:  node dsa-patterns/backtracking/subsets/index.js

// Backtracking: at each index decide to include nums[i] or not.
// Every node of the recursion tree is a valid subset, so we record on entry.
function subsets(nums) {
  const result = [];
  const current = [];

  function backtrack(start) {
    result.push(current.slice()); // record a copy of the current subset
    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);      // choose
      backtrack(i + 1);           // explore
      current.pop();              // un-choose (backtrack)
    }
  }

  backtrack(0);
  return result;
}

// Demo
console.log(JSON.stringify(subsets([1, 2, 3])));
// [[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]
