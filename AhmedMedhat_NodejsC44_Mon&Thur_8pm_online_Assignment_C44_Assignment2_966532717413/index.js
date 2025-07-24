// Imports
const path = require("node:path");
const fs = require("node:fs");
const EventEmitter = require("events");
const zlib = require("node:zlib");

// ANSI color codes
const RED = "\x1b[31m";
const BLUE = "\x1b[34m";
const RESET = "\x1b[0m";

// 1. Write a function that logs the current file path and directory.
function LogFilePath() {
  console.log(RED + "1. Current File Path and Directory:" + RESET);
  console.log(BLUE, { File: path.filename, Dir: __dirname }, RESET);
}
LogFilePath();

/*
2. Write a function that takes a file path and returns its file name. (0.5 Grade)
• Input Example: /user/files/report.pdf
• Output Example: "report.pdf "
*/

const filePath = "/user/files/report.pdf";
function getFileName(filePath) {
  return path.basename(filePath);
}
console.log(RED + "2. File Name:" + RESET);
console.log(BLUE, getFileName(filePath), RESET);

/*
3. Write a function that builds a path from an object (0.5 Grade)
*/
const obj = {
  dir: "user",
  file: "report.pdf",
};
function buildPath(obj) {
  return path.join(obj.dir, obj.file);
}
console.log(RED + "3. Build Path:" + RESET);
console.log(BLUE, buildPath(obj), RESET);

/*
4. Write a function that returns the file extension from a given file path. (0.5 Grade)
*/
const filePath2 = "/user/files/report.pdf";
function getFileExtension(filePath) {
  return path.extname(filePath);
}
console.log(RED + "4. File Extension:" + RESET);
console.log(BLUE, getFileExtension(filePath2), RESET);

/*
5. Write a function that parses a given path and returns its name and ext. (0.5 Grade)
*/

function parsePath(filePath) {
  const parsedResult = path.parse(filePath);
  return parsedResult.name + parsedResult.ext;
}
console.log(RED + "5. Parse Path:" + RESET);
console.log(BLUE, parsePath(filePath2), RESET);

/*
6. Write a function that checks whether a given path is absolute. (0.5 Grade)
*/
function isAbsolutePath(filePath) {
  return path.isAbsolute(filePath);
}
console.log(RED + "6. Is Absolute Path:" + RESET);
console.log(BLUE, isAbsolutePath(filePath2), RESET);

/*
7. Write a function that joins multiple segments (0.5 Grade)
• Input: "src", "components", "App.js"
• Output Example: src/components/App.js
*/
function joinSegments(...segments) {
  return path.join(...segments);
}
console.log(RED + "7. Join Segments:" + RESET);
console.log(BLUE, joinSegments("src", "components", "App.js"), RESET);

/*
8. Write a function that resolves a relative path to an absolute one. (0.5 Grade)
• Input Example: ./index.js
• Output Example: /home/user/project/src/index.js
*/
function resolvePath(relativePath) {
  return path.resolve(relativePath);
}
console.log(RED + "8. Resolve Path:" + RESET);
console.log(BLUE, resolvePath("./index.js"), RESET);

/*
9. Write a function that joins two paths. (0.5 Grade)
• Input Example: /folder1, folder2/file.txt
• Output Example: /folder1/folder2/file.txt
*/

function joinPathes(...pathes) {
  return path.join(...pathes);
}
console.log(RED + "9. Join Pathes:" + RESET);
console.log(BLUE, joinPathes("/folder1", "folder2/file.txt"), RESET);

/*
10. Write a function that deletes a file asynchronously. (0.5 Grade)
• Input Example: /path/to/file.txt
• Output Example: The file.txt is deleted.
*/

function deleteFile(filepath) {
  fs.unlink(filepath, (err) => {
    if (err) throw err;
    console.log(RED + "10. Delete File:" + RESET);
    console.log(BLUE, "The file is deleted.", RESET);
  });
}

/*
11.Write a function that creates a folder synchronously. (0.5 Grade)
Output Example: “Success”
*/

const createFolder = (folderPath) => {
  try {
    // If file exists return
    if (fs.existsSync(folderPath)) return;

    fs.mkdirSync(folderPath);

    console.log(RED + "11. Create Folder:" + RESET);
    console.log(BLUE, "Success", RESET);
  } catch (err) {
    console.error(err);
  }
};

createFolder("./newFolder");

/*
12. Create an event emitter that listens for a "start" event and logs a welcome message. (0.5 Grade)
• Output Example: Welcome event triggered!
*/

const eventEmitter = new EventEmitter();

// Fix: Use the instance, not the class
eventEmitter.on("start", () => {
  console.log(RED + "12. Event Emitter:" + RESET);
  console.log(BLUE, "Welcome event triggered!", RESET);
});

eventEmitter.emit("start");

/*
13. Emit a custom "login" event with a username parameter. (0.5 Grade)
• Input Example: "Ahmed"
• Output Example: “User logged in: Ahmed”
*/

eventEmitter.on("login", (username) => {
  console.log(RED + "13. Login Event:" + RESET);
  console.log(BLUE, `User logged in: ${username}`, RESET);
});

eventEmitter.emit("login", "Ahmed");

/*
14. Read a file synchronously and log its contents. (0.5 Grade)
• Input Example: "./notes.txt"
• Output Example: the file content => “This is a note.”
*/

const readFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    console.log(RED + "14. Read File:" + RESET);
    console.log(BLUE, data, RESET);
  } catch (err) {
    console.error(err);
  }
};

readFile("./notes.txt");

/*
15. Write asynchronously to a file. (0.5 Grade)
• Input: path: "./async.txt", content: "Async save"
*/

const writeFile = (filePath, content) => {
  fs.writeFile(filePath, content, (err) => {
    if (err) throw err;
    console.log(RED + "15. Write File:" + RESET);
    console.log(BLUE, "The file has been saved!", RESET);
  });
};

writeFile("./async.txt", "Async save");

/*
16. Check if a directory exists. (0.5 Grade)
• Input Example: "./notes.txt"
• Output Example: true
*/

const checkIfDirExists = (dirPath) => {
  try {
    const exists = fs.existsSync(dirPath);
    console.log(RED + "16. Check If Dir Exists:" + RESET);
    console.log(BLUE, exists, RESET);
  } catch (err) {
    console.error(err);
  }
};

checkIfDirExists("./notes.txt");

/*
17. Write a function that returns the OS platform and CPU architecture. (0.5 Grade)
• Output Example: {Platform: “win32”, Arch: “x64”}
*/

const getOSInfo = () => {
  console.log(RED + "17. Get OS Info:" + RESET);
  console.log(BLUE, { Platform: process.platform, Arch: process.arch }, RESET);
};

getOSInfo();

/*
18. Use a readable stream to read a file in chunks and log each chunk. (0.5 Grade)
• Input Example: "./big.txt"
• Output Example: log each chunk
*/

const readStream = fs.createReadStream("./big.txt", "utf8");

readStream.on("data", (chunk) => {
  console.log(RED + "18. Read Stream:" + RESET);
  console.log(BLUE, chunk, RESET);
});

/*
19. Use readable and writable streams to copy content from one file to another. (0.5 Grade)
• Input Example: "./source.txt", "./dest.txt"
• Output Example: File copied using streams
*/

const readStream2 = fs.createReadStream("./big.txt", "utf8");
const writeStream = fs.createWriteStream("./dest.txt");

readStream2.pipe(writeStream);

readStream2.on("end", () => {
  console.log(RED + "19. Copy File:" + RESET);
  console.log(BLUE, "File copied using streams", RESET);
});

/*
20. Create a pipeline that reads a file, compresses it, and writes it to another file. (0.5 Grade)
• Input Example: "./data.txt", "./data.txt.gz"
*/


const readStream3 = fs.createReadStream("./data.txt", "utf8");
const writeStream2 = fs.createWriteStream("./data.txt.gz");
const gzip = zlib.createGzip();

readStream3.pipe(gzip).pipe(writeStream2);

readStream3.on("end", () => {
  console.log(RED + "20. Compress File:" + RESET);
  console.log(BLUE, "File compressed using streams", RESET);
});
