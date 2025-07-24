const express = require("express");
const fs = require("node:fs");
const path = require("path");
const app = express();
const port = 3000;

const usersFilePath = path.join(__dirname, "users.json");

// Middleware to parse JSON bodies
app.use(express.json());

// Ensure the file exists before reading
const ensureUsersFileExists = () => {
  if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, JSON.stringify([]), "utf8");
  }
};

const readUsers = () => {
  ensureUsersFileExists();
  const data = fs.readFileSync(usersFilePath, "utf8");
  return JSON.parse(data);
};

app.get("/users", (req, res) => {
  const users = readUsers();
  res.status(200).json({ users, message: "All users" });
});

app.get("/users/getByName", (req, res) => {
  const { name } = req.query;
  console.log(name);
  if (!name) {
    return res.status(400).json({ message: "Missing 'name' query parameter" });
  }

  const users = readUsers();
  const user = users.find((user) => user.name === name);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ user, message: "User found" });
});

app.get("/users/:id", (req, res) => {
  const users = readUsers();
  const userId = Number(req.params.id);
  const user = users.find((user) => user.id === userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ user, message: "User found" });
});

app.get("/users/filterByAge", (req, res) => {
  const { minAge, maxAge } = req.query;
  console.log(req.query);

  if (!minAge) {
    return res.status(400).json({ message: "Missing 'minAge' or 'maxAge' query parameter" });
  }

  const users = readUsers();
  const filteredUsers = users.filter((user) => user.age >= minAge);
  res.status(200).json({ users: filteredUsers, message: "Users found" });
});

app.post("/users", (req, res) => {
  const users = readUsers();
  const { name, email, age } = req.body;

  let id = 1;
  if (users.length === 0) {
    id = 1;
  } else {
    id = users[users.length - 1].id + 1;
  }

  if (!name || !email || !age) {
    return res.status(400).json({ message: "Name , email and age are required" });
  }

  if (users.find((user) => user.email === email)) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const newUser = { id, name, email, age };

  users.push(newUser);
  fs.writeFileSync(usersFilePath, JSON.stringify(users), "utf8");
  res.status(201).json({ message: "User created" });
});

app.patch("/users/:id", (req, res) => {
  const users = readUsers();
  const user = users.find((user) => user.id === Number(req.params.id));
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const { name, email, age } = req.body;

  if (name) {
    user.name = name;
  }
  if (age) {
    user.age = age;
  }

  if (email && users.find((user) => user.email === email) && user.id !== Number(req.params.id)) {
    return res.status(400).json({ message: "Email already exists" });
  }

  if (email) {
    user.email = email;
  }
  fs.writeFileSync(usersFilePath, JSON.stringify(users), "utf8");
  res.status(200).json({ message: "User updated" });
});

app.delete("/users/:id", (req, res) => {
  const users = readUsers();
  const user = users.find((user) => user.id === Number(req.params.id));
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const newUsers = users.filter((user) => user.id !== Number(req.params.id));
  fs.writeFileSync(usersFilePath, JSON.stringify(newUsers), "utf8");
  res.status(200).json({ message: "User deleted" });
});

// Server config
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
