// Run:  node dsa-patterns/sliding-window/max-sum-subarray-k/index.js

// Fixed-size sliding window. Maintain the running sum of the current window;
// slide by adding the incoming element and subtracting the outgoing one.
function maxSumSubarrayK(arr, k) {
  if (k <= 0 || arr.length < k) return null;
  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += arr[i];
  let best = windowSum;
  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k];
    if (windowSum > best) best = windowSum;
  }
  return best;
}

// Demo
console.log(maxSumSubarrayK([2, 1, 5, 1, 3, 2], 3)); // 9  (5 + 1 + 3)
console.log(maxSumSubarrayK([2, 3, 4, 1, 5], 2));    // 7  (3 + 4)
