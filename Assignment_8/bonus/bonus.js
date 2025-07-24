var longestCommonPrefix = function (strs) {
  if (!strs.length) return "";

  let prefix = strs[0]; // Start with the first word

  for (let i = 1; i < strs.length; i++) {
    // Reduce the prefix until it matches the start of strs[i]
    while (strs[i].indexOf(prefix) !== 0) {
      prefix = prefix.slice(0, -1);
      if (!prefix) return "";
    }
  }

  return prefix;
};

console.log(longestCommonPrefix(["flower", "flow", "flight"]));
