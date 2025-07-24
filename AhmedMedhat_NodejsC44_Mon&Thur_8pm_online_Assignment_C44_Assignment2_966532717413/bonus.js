const findKthPositive = function (arr, k) {
  let missing_count = 0;
  let current = 1;
  let index = 0;

  while (missing_count < k) {
    if (index < arr.length && arr[index] === current) {
      index += 1;
    } else {
      missing_count += 1;
      if (missing_count === k) {
        return current;
      }
    }
    current += 1;
  }
};
