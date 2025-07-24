import express from "express";
import { bootstrap } from "./app.controller.js";

const app = express();
const port = 9000;

bootstrap(app, express);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
