// Run:  node dsa-patterns/fast-slow/happy-number/index.js

// The sequence "sum of squared digits" behaves like a linked list of numbers,
// so a non-happy number forms a cycle. Use Floyd's: slow takes one step, fast
// two. If fast reaches 1 it's happy; if slow meets fast it's a loop -> not happy.
function squareDigitSum(n) {
  let sum = 0;
  while (n > 0) {
    const d = n % 10;
    sum += d * d;
    n = Math.floor(n / 10);
  }
  return sum;
}

function isHappy(n) {
  let slow = n;
  let fast = squareDigitSum(n);
  while (fast !== 1 && slow !== fast) {
    slow = squareDigitSum(slow);
    fast = squareDigitSum(squareDigitSum(fast));
  }
  return fast === 1;
}

// Demo
console.log(isHappy(19)); // true  (19 -> 82 -> 68 -> 100 -> 1)
console.log(isHappy(2));  // false (enters a cycle)
console.log(isHappy(1));  // true
