// Run:  node dsa-patterns/backtracking/permutations/index.js

// Backtracking: build one ordering by repeatedly picking an unused element.
// A `used` array marks which indices are already in the current permutation.
function permutations(nums) {
  const result = [];
  const current = [];
  const used = new Array(nums.length).fill(false);

  function backtrack() {
    if (current.length === nums.length) {
      result.push(current.slice()); // a full permutation
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;        // choose
      current.push(nums[i]);
      backtrack();           // explore
      current.pop();         // un-choose (backtrack)
      used[i] = false;
    }
  }

  backtrack();
  return result;
}

// Demo
console.log(JSON.stringify(permutations([1, 2, 3])));
// [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
