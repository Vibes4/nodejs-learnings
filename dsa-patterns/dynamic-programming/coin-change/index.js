// Run:  node dsa-patterns/dynamic-programming/coin-change/index.js

// Unbounded knapsack: dp[a] = fewest coins to make amount a.
// For each amount, try every coin and take 1 + dp[a - coin] when reachable.
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const coin of coins) {
      if (coin <= a && dp[a - coin] + 1 < dp[a]) {
        dp[a] = dp[a - coin] + 1;
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

// Demo
console.log(coinChange([1, 2, 5], 11)); // 3  (5 + 5 + 1)
console.log(coinChange([2], 3));        // -1 (cannot make 3 from only 2s)
console.log(coinChange([1, 2, 5], 0));  // 0
