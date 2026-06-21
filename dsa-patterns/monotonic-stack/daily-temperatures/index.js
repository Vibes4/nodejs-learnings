// Run:  node dsa-patterns/monotonic-stack/daily-temperatures/index.js

// Keep a stack of indices whose answer is still pending, with temperatures in
// DECREASING order. When today is warmer than the top, we have found the
// warmer day for that index; pop and record the day gap. Each index is pushed
// and popped once, so the whole pass is O(n).
function dailyTemperatures(temps) {
  const result = new Array(temps.length).fill(0);
  const stack = []; // indices of days awaiting a warmer day
  for (let i = 0; i < temps.length; i++) {
    while (stack.length && temps[i] > temps[stack[stack.length - 1]]) {
      const prev = stack.pop();
      result[prev] = i - prev;
    }
    stack.push(i);
  }
  return result;
}

// Demo
console.log(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]));
// [ 1, 1, 4, 2, 1, 1, 0, 0 ]
console.log(dailyTemperatures([30, 40, 50, 60])); // [ 1, 1, 1, 0 ]
console.log(dailyTemperatures([30, 60, 90]));     // [ 1, 1, 0 ]
