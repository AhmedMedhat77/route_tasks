import express from "express";
import {
  getUserByEmailAddressService,
  getUserByIDService,
  signupService,
  updateUserService,
} from "./auth.service.js";
const authRouter = express.Router();

authRouter.post("/signup", signupService);
authRouter.put("/:id", updateUserService);
authRouter.get("/by-email", getUserByEmailAddressService);
authRouter.get("/:id", getUserByIDService);

export default authRouter;
