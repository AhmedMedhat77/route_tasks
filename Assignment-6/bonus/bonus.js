var removeElement = function (nums, val) {
  let k = 0; // index for next valid element

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== val) {
      nums[k] = nums[i];
      k++;
    }
  }

  return k; // number of valid elements
};

let nums = [3, 2, 2, 3];
let val = 3;

let k = removeElement(nums, val);
console.log(k); 
