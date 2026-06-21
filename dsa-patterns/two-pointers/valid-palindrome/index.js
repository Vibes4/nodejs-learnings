// Run:  node dsa-patterns/two-pointers/valid-palindrome/index.js

// Two pointers converge from both ends. Skip any non-alphanumeric character,
// compare the rest case-insensitively. Mismatch => not a palindrome.
function isAlphaNum(ch) {
  return /[a-z0-9]/i.test(ch);
}

function isPalindrome(s) {
  let lo = 0;
  let hi = s.length - 1;
  while (lo < hi) {
    while (lo < hi && !isAlphaNum(s[lo])) lo++;
    while (lo < hi && !isAlphaNum(s[hi])) hi--;
    if (s[lo].toLowerCase() !== s[hi].toLowerCase()) return false;
    lo++;
    hi--;
  }
  return true;
}

// Demo
console.log(isPalindrome("A man, a plan, a canal: Panama")); // true
console.log(isPalindrome("race a car"));                     // false
console.log(isPalindrome(" "));                              // true
