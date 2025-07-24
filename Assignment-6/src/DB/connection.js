import { Sequelize } from "sequelize";

const sequelize = new Sequelize("assignment_6", "root", "", {
  host: "127.0.0.1",
  dialect: "mysql",
});

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Error connecting DB ", error);
  }
}

export { connectDB, sequelize };
