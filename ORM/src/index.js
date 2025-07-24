import express from "express";
import bootstrap from "./app.controller.js";
const port = 3000;
const app = express();
bootstrap(app, express);
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
