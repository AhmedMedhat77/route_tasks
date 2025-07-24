import { bootStrap } from "./app.controller.js";

import express from "express";

const app = express();
const port = 3000;

bootStrap(app, express);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
