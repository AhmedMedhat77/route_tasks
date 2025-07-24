import { Sequelize } from "sequelize";

const sequelize = new Sequelize("blogs", "root", "", {
  dialect: "mysql",
  host: "127.0.0.1",
});

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
export { connectDB, sequelize };
