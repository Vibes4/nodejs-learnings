// Run:  node dsa-patterns/backtracking/combination-sum/index.js

// Backtracking: try each candidate from a starting index. Because a number may
// be reused, we recurse with the SAME index `i` (not i + 1). Passing `start`
// forward prevents producing the same combination in a different order.
function combinationSum(candidates, target) {
  const result = [];
  const current = [];

  function backtrack(start, remaining) {
    if (remaining === 0) {
      result.push(current.slice());
      return;
    }
    if (remaining < 0) return; // overshot the target
    for (let i = start; i < candidates.length; i++) {
      current.push(candidates[i]);           // choose
      backtrack(i, remaining - candidates[i]); // reuse allowed -> same i
      current.pop();                          // un-choose (backtrack)
    }
  }

  backtrack(0, target);
  return result;
}

// Demo
console.log(JSON.stringify(combinationSum([2, 3, 6, 7], 7)));
// [[2,2,3],[7]]
console.log(JSON.stringify(combinationSum([2, 3, 5], 8)));
// [[2,2,2,2],[2,3,3],[3,5]]
