const romanToInt = function (s) {
  const roman = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };
  let result = 0;

  for (let i = 0; i < s.length; i++) {
    // if the current number is less than the next number, subtract it
    // IV = 4   I = 1 v=5 so 5-1=4
    if (roman[s[i]] < roman[s[i + 1]]) {
      result -= roman[s[i]];
    } else {
      // if the current number is greater than or equal to the next number, add it
      // IX = 9   I = 1 x=10 so 10-1=9
      result += roman[s[i]];
    }
  }
  return result;
};

console.log(romanToInt("III")); // output 3
