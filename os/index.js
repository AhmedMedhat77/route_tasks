const os = require("os");
// Returns by bytes
const freeMomory = os.freemem();
const totalMemory = os.totalmem();
const usedMemoery = totalMemory - freeMomory;
// Change  KB To GB
console.log(`Free memory: ${freeMomory / 1024 ** 3} GB`);
console.log(`Used Memory: ${usedMemoery / 1024 ** 3} GB`);
console.log(`Total memory: ${totalMemory / 1024 ** 3} GB`);



