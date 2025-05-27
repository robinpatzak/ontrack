import { Router } from "express";
import {
  loginController,
  logoutController,
  refreshController,
  registerController,
} from "../controllers/auth.controller";

const authRoutes = Router();

authRoutes.post("/register", registerController);
authRoutes.post("/login", loginController);
authRoutes.get("/refresh", refreshController);
authRoutes.get("/logout", logoutController);

export default authRoutes;
