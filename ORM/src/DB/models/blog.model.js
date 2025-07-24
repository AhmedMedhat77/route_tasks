// Define User Model

import { sequelize } from "../connection.js";

sequelize.define("User", {}); //Model is Class and have to be Pascal Case auto it makes it to table > users
