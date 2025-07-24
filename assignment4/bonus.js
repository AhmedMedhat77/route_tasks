var longestCommonPrefix = function (strs) {
  if (!strs.length) return "";

  let prefix = strs[0]; // Start with the first word as ref

  for (let i = 1; i < strs.length; i++) {
    // Keep shortening the prefix until it matches the current word
    while (strs[i].indexOf(prefix) !== 0) {
      prefix = prefix.slice(0, -1);
      if (!prefix) return "";
    }
  }

  return prefix;
};
