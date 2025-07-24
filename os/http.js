const http = require("node:http");
const fs = require("node:fs");

const PORT = 9000;

const getAllUsers = () => {
  const data = fs.readFileSync("./users.json", { encoding: "utf-8" });
  return JSON.parse(data);
};

const saveUsers = (users) => {
  fs.writeFileSync("./users.json", JSON.stringify(users, null, 2));
};

const server = http.createServer((req, res) => {
  const [_, resource, param] = req.url.split("/");

  // GET /users
  if (req.method === "GET" && req.url === "/users") {
    const users = getAllUsers();
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(users));
  }

  // GET /users/:id
  if (req.method === "GET" && resource === "users" && param) {
    const id = parseInt(param);
    const users = getAllUsers();
    const user = users.find((u) => u.id === id);

    if (!user) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "User not found" }));
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(user));
  }

  // POST /users
  if (req.method === "POST" && req.url === "/users") {
    let bufferData = "";
    req.on("data", (chunk) => (bufferData += chunk));

    req.on("end", () => {
      const body = JSON.parse(bufferData);
      const users = getAllUsers();
      const emailExists = users.some((user) => user.email === body.email);

      if (emailExists) {
        res.writeHead(409, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Email already exists" }));
      }

      const id = users.length ? users[users.length - 1].id + 1 : 1;
      const newUser = { id, ...body };
      users.push(newUser);
      saveUsers(users);

      res.writeHead(201, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(newUser));
    });

    return;
  }

  // PATCH /users/:id
  if (req.method === "PATCH" && resource === "users" && param) {
    const id = parseInt(param);
    let bufferData = "";
    req.on("data", (chunk) => (bufferData += chunk));

    req.on("end", () => {
      const updateData = JSON.parse(bufferData);
      const users = getAllUsers();
      const userIndex = users.findIndex((user) => user.id === id);

      if (userIndex === -1) {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "User not found" }));
      }

      const emailExists = users.some((user) => user.email === updateData.email && user.id !== id);

      if (emailExists) {
        res.writeHead(409, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Email already exists" }));
      }

      users[userIndex] = { ...users[userIndex], ...updateData };
      saveUsers(users);

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(users[userIndex]));
    });

    return;
  }

  // DELETE /users/:id
  if (req.method === "DELETE" && resource === "users" && param) {
    const id = parseInt(param);
    const users = getAllUsers();
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "User not found" }));
    }

    const deletedUser = users.splice(index, 1)[0];
    saveUsers(users);

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(deletedUser));
  }

  // Fallback
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Error Page");
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
