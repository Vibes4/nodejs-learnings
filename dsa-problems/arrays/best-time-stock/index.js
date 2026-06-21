// Run:  node dsa-problems/arrays/best-time-stock/index.js

// Best Time to Buy & Sell Stock: track min-so-far, one pass. O(n) time, O(1) space.
function maxProfit(prices) {
  let minPrice = Infinity, best = 0;
  for (const p of prices) {
    if (p < minPrice) minPrice = p;            // cheapest day to have bought
    else best = Math.max(best, p - minPrice);  // sell today vs best so far
  }
  return best;
}

console.log('Best Time to Buy & Sell Stock:');
console.log('  [7,1,5,3,6,4] ->', maxProfit([7, 1, 5, 3, 6, 4])); // 5
