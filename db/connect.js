import mysql from "mysql2";
import { createInitialTables } from "../query/tables.js";

let connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "store", // have to create store db go to readMe.md
});

connection.connect(function (err) {
  if (err) {
    console.log("Error connecting to Db", err.message);
    return;
  }
  console.log("Connected!");
  // TO Start once server start and create tables in SQL if not exists
  createInitialTables();
});

export { connection };
