import { Router } from "express";
import {
  loginController,
  refreshController,
  registerController,
} from "../controllers/auth.controller";

const authRoutes = Router();

authRoutes.post("/register", registerController);
authRoutes.post("/login", loginController);
authRoutes.post("/refresh", refreshController);

export default authRoutes;
