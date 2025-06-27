const mysql = require("mysql2/promise");

async function createDatabaseIfNotExists() {
  const dbConfig = {
    host: "127.0.0.1",
    user: "root",
    password: "",
  };

  const databaseName = "store";

  let connection;
  try {
    // Establish a connection without specifying a database initially
    connection = await mysql.createConnection(dbConfig);

    // Execute the CREATE DATABASE IF NOT EXISTS query
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\`;`);
    console.log(`Database '${databaseName}' created or already exists.`);
  } catch (error) {
    console.error("Error creating database:", error);
  } finally {
    if (connection) {
      connection.end(); // Close the connection
    }
  }
}

createDatabaseIfNotExists();
