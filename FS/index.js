const fs = require("node:fs");

//create file
// try {
//   fs.mkdirSync("./users/Ahmed/posts", { recursive: true });
// } catch (err) {
//   console.log(err);
// }

// Stream

const readStream = fs.createReadStream("./data.txt", {
  highWaterMark: 64 * 1024,
});

readStream.on("open", (chunk) => {
  console.log("File Opened");
});

readStream.on("ready", () => {
  console.log("file is ready");
});

readStream.on("data", (chunk) => {
  console.log(chunk);
});


readStream.on("end", () => {
  console.log("ENDED =>>>>>>>>>>>");
});

readStream.on("close", () => {
  console.log("FIle Closed");
});
