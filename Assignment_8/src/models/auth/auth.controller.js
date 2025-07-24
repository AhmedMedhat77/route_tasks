import { Router } from "express";
import * as authService from "./auth.service.js";
import { authenticateToken } from "../../middleware/authenticateToken.js";
const authRouter = Router();

authRouter.post("/signup", authService.signup);
authRouter.post("/login", authService.login);
authRouter.patch("/", authenticateToken, authService.updateUser);
authRouter.delete("/", authenticateToken, authService.deleteUser);
authRouter.get("/", authenticateToken, authService.getUser);

export default authRouter;
