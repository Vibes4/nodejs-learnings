// Run:  node dsa-patterns/dynamic-programming/climbing-stairs/index.js

// The number of ways to reach step n equals ways(n-1) + ways(n-2):
// the last move is either a single step (from n-1) or a double step (from n-2).
// This is the Fibonacci recurrence; we keep only the last two values.
function climbStairs(n) {
  if (n <= 2) return n;
  let prev2 = 1; // ways(1)
  let prev1 = 2; // ways(2)
  for (let i = 3; i <= n; i++) {
    const cur = prev1 + prev2;
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}

// Demo
console.log(climbStairs(2)); // 2  (1+1, 2)
console.log(climbStairs(3)); // 3  (1+1+1, 1+2, 2+1)
console.log(climbStairs(5)); // 8
