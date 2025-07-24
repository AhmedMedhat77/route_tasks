import "./DB/connection.js";
import { connectDB } from "./DB/connection.js";
export default function bootstrap(app, express) {
  connectDB();
}
