// Run:  node dsa-patterns/monotonic-stack/largest-rectangle/index.js

// Keep a stack of indices with INCREASING heights. When a shorter bar appears,
// every taller bar on the stack can no longer extend right, so we pop it and
// compute the largest rectangle in which that popped bar is the shortest one.
// Its width spans from the new left boundary (the index now on top, exclusive)
// up to the current index (exclusive). A trailing 0 height flushes the stack.
function largestRectangleArea(heights) {
  const stack = []; // indices of bars with increasing heights
  let best = 0;
  for (let i = 0; i <= heights.length; i++) {
    const h = i === heights.length ? 0 : heights[i];
    while (stack.length && heights[stack[stack.length - 1]] >= h) {
      const height = heights[stack.pop()];
      const left = stack.length ? stack[stack.length - 1] : -1;
      const width = i - left - 1;
      if (height * width > best) best = height * width;
    }
    stack.push(i);
  }
  return best;
}

// Demo
console.log(largestRectangleArea([2, 1, 5, 6, 2, 3])); // 10 (bars 5 and 6: 5*2)
console.log(largestRectangleArea([2, 4]));             // 4  (bar 4: 4*1)
console.log(largestRectangleArea([6, 2, 5, 4, 5, 1, 6])); // 12 (5,4,5: 4*3)
