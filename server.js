import express from "express";
import router from "./routes/index.js";
import cors from "cors";
const app = express();
const port = 9000;

app.use(express.json());
app.use(cors());

app.use("/api", router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
