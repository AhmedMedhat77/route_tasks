// const crypto = require("node:crypto");
const http = require("node:http");
// process.env.UV_THREADPOOL_SIZE = 4;
const start = Date.now();

// crypto.pbkdf2("password", "salt", 100000, 512, "sha256", (err, key) => {
//   console.log(1, Date.now() - start);
// });

// crypto.pbkdf2("password", "salt", 100000, 512, "sha256", (err, key) => {
//   console.log(2, Date.now() - start);
// });
// crypto.pbkdf2("password", "salt", 100000, 512, "sha256", (err, key) => {
//   console.log(3, Date.now() - start);
// });
// crypto.pbkdf2("password", "salt", 100000, 512, "sha256", (err, key) => {
//   console.log(4, Date.now() - start);
// });

// crypto.pbkdf2("password", "salt", 100000, 512, "sha256", (err, key) => {
//   console.log("\n Delay");
//   console.log(5, Date.now() - start);
// });
// crypto.pbkdf2("password", "salt", 100000, 512, "sha256", (err, key) => {
//   console.log(6, Date.now() - start);
// });

// write stream and runs on OS 
http
  .request("http://google.com", (res) => {
    res.on("data", () => {});
    res.on("end", () => {
      console.log(7, Date.now() - start);
    });
  })
  .end();
