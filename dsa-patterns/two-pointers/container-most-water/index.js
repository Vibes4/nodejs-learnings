// Run:  node dsa-patterns/two-pointers/container-most-water/index.js

// Start with the widest container (both ends). Area is limited by the shorter
// line, so move the shorter side inward — that's the only move that could find
// a taller bounding line and a larger area.
function maxArea(height) {
  let lo = 0;
  let hi = height.length - 1;
  let best = 0;
  while (lo < hi) {
    const area = Math.min(height[lo], height[hi]) * (hi - lo);
    if (area > best) best = area;
    if (height[lo] < height[hi]) lo++;
    else hi--;
  }
  return best;
}

// Demo
console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])); // 49
console.log(maxArea([1, 1]));                       // 1
